resource "null_resource" "docker_image" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOT
      az acr login --name ${var.acr_name} -u ${var.registry_username} -p ${var.registry_password}
      docker build --platform linux/amd64 -t ${var.registry_login_server}/${var.image_name} -f ${var.dockerfile} ${var.build_context} 
      docker push ${var.registry_login_server}/${var.image_name}
    EOT
  }
}

resource "azurerm_container_app" "app" {
  name                = var.container_app_name
  resource_group_name = var.resource_group_name
  container_app_environment_id      = var.container_app_environment_id

  identity {
    type = "SystemAssigned"
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight { 
      percentage = 100
      latest_revision = true 
    }
  }

  revision_mode = "Single"

  registry {
    server = var.registry_login_server
    password_secret_name = "pwd"
    username = var.registry_username
  }

  secret {
    name = "pwd"
    value = var.registry_password
  }

  template {
    container {
      name  = "app"
      image = "${var.registry_login_server}/${var.image_name}"
      cpu    = 0.25
      memory = "0.5Gi"

      dynamic "env" {
        for_each = var.env_vars

        content {
          name  = env.key
          value = env.value
        }
      }

      env {
        name = "buildstamp"
        value = timestamp()
      }
    }
  }

  depends_on = [null_resource.docker_image]
}
