locals {
  config = {
    api = {
      git_branch     = "main"
      git_repository = "getleftfield/code"

      image_repository_name = "api"

      mongo_nodes   = 1
      mongo_size    = "db-s-1vcpu-1gb"
      mongo_version = "4"

      redis_nodes   = 1
      redis_size    = "db-s-1vcpu-1gb"
      redis_version = "6"

      region = "nyc2"
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
