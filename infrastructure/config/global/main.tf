locals {
  config = {
    api = {
      health_check_path = "/_lf/health-check"

      http_port  = 80
      https_port = 80

      vpc_cidr_block = "10.0.0.0/16"
    }

    edge = {
      accelerator_name = "edge"

      health_check_path = "/_lf/health-check"

      http_port  = 80
      https_port = 443

      image_repository_name = "edge"

      vpc_cidr_block = "10.0.0.0/16"
    }
  }
}

output "config" {
  value = local.config
}
