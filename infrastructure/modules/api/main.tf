variable "broker_env" {
  type = list(object({
    name  = string
    value = string
  }))
}

# aws_globalaccelerator_accelerator
variable "edge_accelerator" {}

variable "config" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }

    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.9"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.0.1"
    }
  }
}

data "aws_availability_zones" "api" {
  state = "available"
}

data "aws_ip_ranges" "all" {
  services = ["route53_healthchecks"]
}

locals {
  availability_zones = slice(data.aws_availability_zones.api.names, 0, 2)
  aws_ip_ranges      = data.aws_ip_ranges.all.cidr_blocks
}

module "product_repository" {
  source = "./container-repository"
  name   = "product"

  providers = {
    aws = aws
  }
}

module "task_manufacture_repository" {
  source = "./container-repository"
  name   = "task-manufacture"

  providers = {
    aws = aws
  }
}

module "task_ssl_repository" {
  source = "./container-repository"
  name   = "task-ssl"

  providers = {
    aws = aws
  }
}

module "network" {
  source = "./network"
  config = var.config

  availability_zones = local.availability_zones

  providers = {
    aws = aws
  }
}

module "redis" {
  source = "./redis"
  config = var.config

  availability_zones = local.availability_zones
  private_subnets    = module.network.private_subnets
  vpc                = module.network.vpc

  providers = {
    aws = aws
  }
}

module "mongo" {
  source = "./mongo"
  config = var.config

  vpc                  = module.network.vpc
  private_route_tables = module.network.private_route_tables

  providers = {
    aws          = aws
    mongodbatlas = mongodbatlas
  }
}

module "load_balancer" {
  source = "./load-balancer"
  config = var.config

  public_subnets = module.network.public_subnets
  vpc            = module.network.vpc

  providers = {
    aws      = aws
    dnsimple = dnsimple
  }
}

module "container_shared" {
  source = "./container-shared"
  config = var.config

  broker_env              = var.broker_env
  edge_accelerator        = var.edge_accelerator
  mongo_cluster           = module.mongo.cluster
  mongo_user              = module.mongo.user
  redis_replication_group = module.redis.replication_group

  providers = {
    aws = aws
  }
}

module "product_api" {
  source = "./container-http"
  config = var.config
  name   = "product"

  autoscale_min         = var.config.environment.api.product_autoscale_min
  autoscale_max         = var.config.environment.api.product_autoscale_max
  aws_ip_ranges         = local.aws_ip_ranges
  container_environment = module.container_shared.environment
  container_secrets     = module.container_shared.secrets
  iam_role              = module.container_shared.iam_role
  image_repository      = module.product_repository.repository
  lb_target_group       = module.load_balancer.target_group
  private_subnets       = module.network.private_subnets
  vpc                   = module.network.vpc

  depends_on = [
    module.container_shared.ssm_parameters,
  ]

  providers = {
    aws = aws
  }
}

module "task_manufacture" {
  source = "./container-task"
  config = var.config
  name   = "manufacture"

  autoscale_min         = var.config.environment.api.manufacture_autoscale_min
  autoscale_max         = var.config.environment.api.manufacture_autoscale_max
  container_environment = module.container_shared.environment
  container_secrets     = module.container_shared.secrets
  iam_role              = module.container_shared.iam_role
  image_repository      = module.task_manufacture_repository.repository
  private_subnets       = module.network.private_subnets
  vpc                   = module.network.vpc

  depends_on = [
    module.container_shared.ssm_parameters,
  ]

  providers = {
    aws = aws
  }
}

module "task_ssl" {
  source = "./container-task"
  config = var.config
  name   = "ssl"

  autoscale_min         = var.config.environment.api.ssl_autoscale_min
  autoscale_max         = var.config.environment.api.ssl_autoscale_max
  container_environment = module.container_shared.environment
  container_secrets     = module.container_shared.secrets
  iam_role              = module.container_shared.iam_role
  image_repository      = module.task_ssl_repository.repository
  private_subnets       = module.network.private_subnets
  vpc                   = module.network.vpc

  depends_on = [
    module.container_shared.ssm_parameters,
  ]

  providers = {
    aws = aws
  }
}

output "network" {
  value = module.network
}
