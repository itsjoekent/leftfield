variable "ENVIRONMENT" {
  type = string
}

locals {
  config = {
    staging = {
      primary_region    = "us-east-1"
      regions           = ["us-east-1", "us-west-1"]
      secondary_regions = ["us-west-1"]

      default_dns_ttl = 60

      api = {
        redis_nodes     = 2
        redis_node_type = "cache.t2.small"

        mongo_shards = 1
        mongo_disk_size = 10
        mongo_instance_size = "M10"

        http_container_cpu    = "256"
        http_container_memory = "512"

        task_container_cpu    = "256"
        task_container_memory = "512"

        product_autoscale_min = 1

        manufacture_autoscale_min = 1

        ssl_autoscale_min = 1
      }

      edge = {
        autoscale_max    = 2
        autoscale_min    = 1
        container_cpu    = "256"
        container_memory = "512"
        cache_nodes      = 2
        cache_node_type  = "cache.t2.small"
      }
    }

    production = {
      primary_region    = "us-east-1"
      regions           = ["us-east-1", "us-west-1"]
      secondary_regions = ["us-west-1"]

      default_dns_ttl = 3600

      api = {
        redis_nodes     = 2
        redis_node_type = "cache.t2.small"

        mongo_shards = 1
        mongo_disk_size = 10
        mongo_instance_size = "M20"

        http_container_cpu    = "1024"
        http_container_memory = "2048"

        task_container_cpu    = "2048"
        task_container_memory = "4096"

        product_autoscale_min = 1

        manufacture_autoscale_min = 1

        ssl_autoscale_min = 1
      }

      edge = {
        autoscale_max    = 2
        autoscale_min    = 1
        container_cpu    = "1024"
        container_memory = "2048"
        cache_nodes      = 2
        cache_node_type  = "cache.t2.medium"
      }
    }
  }
}

output "config" {
  value = local.config[var.ENVIRONMENT]
}
