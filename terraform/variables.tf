variable "resource_group_name" {
  description = "The name of the resource group."
  default     = "example-resources"
}

variable "resource_group_location" {
  description = "The location of the resource group."
  default     = "East US"
}

variable "storage_account_name" {
  description = "The name of the storage account."
  default     = "examplestoracc"
}

variable "container_name" {
  description = "The name of the storage container."
  default     = "examplecontainer"
}

variable "ARM_CLIENT_ID" {
  description = "Azure Client ID"
  type        = string
  default     = ""
}

variable "ARM_CLIENT_SECRET" {
  description = "Azure Client Secret"
  type        = string
  default     = ""
}

variable "ARM_SUBSCRIPTION_ID" {
  description = "Azure Subscription ID"
  type        = string
  default     = ""
}

variable "ARM_TENANT_ID" {
  description = "Azure Tenant ID"
  type        = string
  default     = ""
}

variable "invoice_api_url" {
  type = string
}

variable "invoice_api_key" {
  type = string
}