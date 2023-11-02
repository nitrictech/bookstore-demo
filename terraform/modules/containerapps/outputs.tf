output "container_app_identity" {
  value       = azurerm_container_app.app.identity.0.principal_id
  description = "The managed identity of this container app"
}

output "container_app_endpoint" {
  value       = azurerm_container_app.app.ingress[0].fqdn
  description = "The application endpoint of this container app"
}
