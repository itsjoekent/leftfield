variable "config" {}

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }

    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.9"
    }
  }
}

resource "digitalocean_database_cluster" "mongo" {
  name       = "lf-${var.config.variables.ENVIRONMENT}-mongo"
  engine     = "mongodb"
  version    = var.config.global.api.mongo_version
  size       = var.config.global.api.mongo_size
  region     = var.config.global.api.region
  node_count = var.config.environment.api.mongo_nodes
}

resource "digitalocean_database_cluster" "redis" {
  name       = "lf-${var.config.variables.ENVIRONMENT}-redis"
  engine     = "redis"
  version    = var.config.global.api.redis_version
  size       = var.config.global.api.redis_size
  region     = var.config.global.api.region
  node_count = var.config.environment.api.redis_nodes
}

locals {
  container_env = concat([
    {
      key   = "AUTH_TOKEN_SECRET",
      value = var.config.variables.AUTH_TOKEN_SECRET
      type  = "SECRET"
    },
    {
      key   = "AWS_ACCESS_KEY_ID"
      value = var.config.variables.AWS_ACCESS_KEY_ID
      type  = "SECRET"
    },
    {
      key   = "AWS_SECRET_ACCESS_KEY"
      value = var.config.variables.AWS_SECRET_ACCESS_KEY
      type  = "SECRET"
    },
    {
      key   = "DOMAIN"
      value = join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))
      type  = "GENERAL"
    },
    {
      key   = "EDGE_DNS_CNAME"
      value = join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))
      type  = "GENERAL"
    },
    {
      key   = "EDGE_DOMAIN"
      value = "https://${join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))}"
      type  = "GENERAL"
    },
    {
      key   = "EMAIL_API_KEY"
      value = var.config.variables.EMAIL_API_KEY
      type  = "SECRET"
    },
    {
      key   = "EMAIL_DOMAIN"
      value = var.config.variables.EMAIL_DOMAIN
      type  = "GENERAL"
    },
    {
      key   = "FRONTEND_URL"
      value = "https://${join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))}"
      type  = "GENERAL"
    },
    {
      key   = "MONGODB_URL"
      value = digitalocean_database_cluster.mongo.uri
      type  = "SECRET"
    },
    {
      key   = "NODE_ENV"
      value = var.config.variables.ENVIRONMENT
      type  = "GENERAL"
    },
    {
      key   = "REDIS_URL"
      value = digitalocean_database_cluster.redis.uri
      type  = "SECRET"
    },
    {
      key   = "SSL_AT_REST_KEY"
      value = var.config.variables.SSL_AT_REST_KEY
      type  = "SECRET"
    },
    {
      key   = "STORAGE_MAIN_REGION"
      value = var.config.environment.edge.primary_region
      type  = "GENERAL"
    },
    {
      key   = "STORAGE_REGIONS"
      value = replace(upper(join(",", var.config.environment.edge.regions)), "-", "_")
      type  = "GENERAL"
    }
    ], [
    for region in var.config.environment.edge.regions : {
      key   = "STORAGE_ENDPOINT_${upper(replace(region, "-", "_"))}"
      value = "https://s3.${region}.amazonaws.com"
      type  = "GENERAL"
    }
    ], [
    for region in var.config.environment.edge.regions : {
      key   = "STORAGE_BUCKET_${upper(replace(region, "-", "_"))}"
      value = "leftfield-${var.config.variables.ENVIRONMENT}-${region}"
      type  = "GENERAL"
    }
  ])
}

resource "digitalocean_app" "api" {
  spec {
    name   = "leftfield-${var.config.variables.ENVIRONMENT}-api"
    region = var.config.global.api.region

    domain {
      name = join(".", [var.config.variables.API_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE])
      type = "ALIAS"
    }

    service {
      name               = "api-service"
      dockerfile_path    = "dockerfiles/api.remote.dockerfile"
      instance_count     = var.config.environment.api.service_instance_count
      instance_size_slug = var.config.environment.api.service_instance_size

      # Github must be installed on the given account:
      # https://cloud.digitalocean.com/apps/github/install
      github {
        repo           = var.config.global.api.git_repository
        branch         = var.config.global.api.git_branch
        deploy_on_push = var.config.variables.ENVIRONMENT == "production" ? true : false
      }

      routes {
        path = "/"
      }

      dynamic "env" {
        for_each = local.container_env

        content {
          key   = env.value.key
          value = env.value.value
          type  = env.value.type
        }
      }

      health_check {
        http_path             = "/_lf/health-check"
        initial_delay_seconds = 5
        period_seconds        = 5
        timeout_seconds       = 5
        success_threshold     = 2
        failure_threshold     = 2
      }
    }

    worker {
      name               = "task-manufacture"
      dockerfile_path    = "dockerfiles/task.manufacture.remote.dockerfile"
      instance_count     = var.config.environment.api.task_manufacture_instance_count
      instance_size_slug = var.config.environment.api.task_manufacture_instance_size

      # Github must be installed on the given account:
      # https://cloud.digitalocean.com/apps/github/install
      github {
        repo           = var.config.global.api.git_repository
        branch         = var.config.global.api.git_branch
        deploy_on_push = var.config.variables.ENVIRONMENT == "production" ? true : false
      }

      dynamic "env" {
        for_each = local.container_env

        content {
          key   = env.value.key
          value = env.value.value
          type  = env.value.type
        }
      }
    }

    worker {
      name               = "task-ssl"
      dockerfile_path    = "dockerfiles/task.ssl.remote.dockerfile"
      instance_count     = var.config.environment.api.task_ssl_instance_count
      instance_size_slug = var.config.environment.api.task_ssl_instance_size

      # Github must be installed on the given account:
      # https://cloud.digitalocean.com/apps/github/install
      github {
        repo           = var.config.global.api.git_repository
        branch         = var.config.global.api.git_branch
        deploy_on_push = var.config.variables.ENVIRONMENT == "production" ? true : false
      }

      dynamic "env" {
        for_each = local.container_env

        content {
          key   = env.value.key
          value = env.value.value
          type  = env.value.type
        }
      }
    }
  }
}

resource "digitalocean_database_firewall" "mongo" {
  cluster_id = digitalocean_database_cluster.mongo.id

  rule {
    type  = "app"
    value = digitalocean_app.api.spec[0].name
  }
}

resource "digitalocean_database_firewall" "redis" {
  cluster_id = digitalocean_database_cluster.redis.id

  rule {
    type  = "app"
    value = digitalocean_app.api.spec[0].name
  }
}

resource "digitalocean_project" "api" {
  name        = "Leftfield ${var.config.variables.ENVIRONMENT}"
  purpose     = "Host Leftfield API components"
  environment = var.config.variables.ENVIRONMENT == "production" ? "production" : "staging"
  resources = [
    "do:dbaas:${digitalocean_database_cluster.mongo.id}",
    "do:dbaas:${digitalocean_database_cluster.redis.id}"
  ]
}

resource "dnsimple_zone_record" "api" {
  zone_name = var.config.variables.DNS_ZONE
  name      = var.config.variables.API_DNS_SUBDOMAIN
  value     = digitalocean_app.api.live_url
  type      = "CNAME"
  ttl       = 3600
}
