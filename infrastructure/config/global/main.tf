locals {
  config = {
    edge = {
      accelerator_name = "edge"

      health_check_path = "/_lf/health-check"

      http_port = 80
      https_port = 443

      vpc_cidr_block = "10.0.0.0/16"
    }
  }
}

output "config" {
  value = local.config
}
