variable "resource_group_name" {
  description = "The name of the resource group in which to create the Container App and ACR."
  type        = string
}

variable "location" {
  description = "The location/region where the Container App and ACR should be created."
  type        = string
}

variable "acr_name" {
  description = "The name of the Azure Container Registry."
  type        = string
}

variable "acr_sku" {
  description = "The SKU of the Azure Container Registry."
  type        = string
  default     = "Basic"
}

variable "container_app_name" {
  description = "The name of the Container App."
  type        = string
}

variable "image_name" {
  description = "Name of a local image to push to ACR"
  type        = string
}

variable "build_context" {
  description = "Path to the location of the application to build with docker"
  type        = string
}

variable "dockerfile" {
  description = "Path to the applications dockerfile"
  type        = string
}

variable "registry_login_server" {
  description = "URI of the ACR registry images should be pushed/pulled from"
  type        = string
}

variable "registry_username" {
  description = "Username for the ACR registry"
  type        = string
}

variable "registry_password" {
  description = "Password for the ACR registry"
  type        = string
}


variable "container_app_environment_id" {
  description = "Id of the azure container app environment to deploy to"
  type        = string
}

variable "env_vars" {
  description = "Environment variables for the container"
  type        = map(string)
  default     = {}
}





