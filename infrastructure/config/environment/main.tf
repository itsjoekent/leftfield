variable "ENVIRONMENT" {
  type = string
}

locals {
  config = {
    staging = {
      api = {
        service_instance_count = 1
        service_instance_size  = "basic-xxs"

        task_manufacture_instance_count = 1
        task_manufacture_instance_size = "basic-xxs"

        task_ssl_instance_count = 1
        task_ssl_instance_size = "basic-xxs"
      }

      edge = {
        autoscale_max = 2
        autoscale_min = 1
        container_cpu = "256"
        container_memory = "512"
        cache_nodes = 2
        cache_node_type = "cache.t2.small"
        instance_type = "t2.micro"
        primary_region = "us-east-1"
        regions = ["us-east-1", "us-west-1"]
        secondary_regions = ["us-west-1"]
      }
    }
  }
}

output "config" {
  value = local.config[var.ENVIRONMENT]
}
