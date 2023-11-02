provider "azurerm" {
  client_id       = var.ARM_CLIENT_ID
  client_secret   = var.ARM_CLIENT_SECRET
  subscription_id = var.ARM_SUBSCRIPTION_ID
  tenant_id       = var.ARM_TENANT_ID
  features {

  }
}

provider "azuread" {}

resource "azurerm_resource_group" "example" {
  name     = var.resource_group_name
  location = var.resource_group_location
}

resource "azurerm_storage_account" "storage" {
  name                     = "tfexamplestorage"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "invoice_files" {
  name                  = "invoicefiles"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

resource "azurerm_container_registry" "acr" {
  name                     = "tfexamplereg"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  sku                      = "Basic"
  admin_enabled            = true
}

resource "azurerm_container_app_environment" "environment" {
  name                       = "terraform-containers"
  location                   = azurerm_resource_group.example.location
  resource_group_name        = azurerm_resource_group.example.name
}

resource "azurerm_eventgrid_topic" "orders_topic" {
  name                = "terraform-order-updates"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

module "orders_container_app" {
  source              = "./modules/containerapps"
  acr_name = azurerm_container_registry.acr.name
  container_app_name = "orders"
  container_app_environment_id  = azurerm_container_app_environment.environment.id
  
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
  registry_login_server = azurerm_container_registry.acr.login_server
  registry_username = azurerm_container_registry.acr.admin_username
  registry_password = azurerm_container_registry.acr.admin_password
  image_name = "orders:latest"
  build_context = "."
  dockerfile = "./orders/Dockerfile"

  env_vars = {
    PORT                               = "3000"
    AZURE_REGION                       = azurerm_resource_group.example.location
    AZURE_TOPIC                        = azurerm_eventgrid_topic.orders_topic.name
  }
}

resource "azurerm_role_assignment" "orders_topic_access" {
  scope                = azurerm_eventgrid_topic.orders_topic.id
  role_definition_name = "EventGrid Data Sender"
  principal_id         = module.orders_container_app.container_app_identity

  depends_on = [
    module.orders_container_app
  ]
}

module "invoices_container_app" {
  source              = "./modules/containerapps"
  acr_name = azurerm_container_registry.acr.name
  container_app_name = "invoices"
  container_app_environment_id  = azurerm_container_app_environment.environment.id
  resource_group_name = azurerm_resource_group.example.name
  registry_login_server = azurerm_container_registry.acr.login_server
  registry_username = azurerm_container_registry.acr.admin_username
  registry_password = azurerm_container_registry.acr.admin_password
  location            = azurerm_resource_group.example.location
  image_name = "invoices:latest"
  build_context = "."
  dockerfile = "./invoices/Dockerfile"


  env_vars = {
    PORT                               = "3000"
    AZURE_REGION                       = azurerm_resource_group.example.location
    AZURE_STORAGE_CONNECTION_STRING    = azurerm_storage_account.storage.primary_connection_string
    AZURE_INVOICES_CONTAINER_NAME = azurerm_storage_container.invoice_files.name
    INVOICE_API_KEY = var.invoice_api_key
    INVOICE_API_URL = var.invoice_api_url
  }
}

resource "azurerm_role_assignment" "invoices_storage_access" {
  scope = azurerm_resource_group.example.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = module.invoices_container_app.container_app_identity
}

resource "azurerm_eventgrid_event_subscription" "invoices_subscription" {
  name  = "example-eventgridsubscription-auth"
  scope = azurerm_eventgrid_topic.orders_topic.id

  webhook_endpoint {
    url = "https://${module.invoices_container_app.container_app_endpoint}/handle-orders"
    max_events_per_batch  = 1
    preferred_batch_size_in_kilobytes = 64
  }
}
