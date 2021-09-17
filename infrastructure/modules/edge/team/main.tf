# aws_globalaccelerator_listener
variable "accelerator_listener" {}

variable "broker_env" {
  type = list(object({
    name  = string
    value = string
  }))
}

variable "config" {}

# aws_ecr_repository
variable "image_repository" {}

# infrastructure/modules/edge/team/network
variable "network" {}

variable "region" {
  type = string
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

# TODO: Delete after prod apply
module "network" {
  source = "./network"
  config = var.config
  region = var.region

  __skip_ip = true

  providers = {
    aws = aws
  }
}

module "cache" {
  source = "./cache"
  config = var.config
  region = var.region

  private_subnets = var.network.private_subnets
  vpc             = var.network.vpc

  providers = {
    aws = aws
  }
}

module "load_balancer" {
  source = "./load-balancer"
  config = var.config
  region = var.region

  accelerator_listener = var.accelerator_listener
  public_subnets       = var.network.public_subnets
  vpc                  = var.network.vpc

  providers = {
    aws = aws
  }
}

module "elastic_container" {
  source = "./elastic-container"
  config = var.config
  region = var.region

  broker_env         = var.broker_env
  cache_redis        = module.cache.redis
  http_target_group  = module.load_balancer.http_target_group
  https_target_group = module.load_balancer.https_target_group
  image_repository   = var.image_repository
  private_subnets    = var.network.private_subnets
  vpc                = var.network.vpc

  providers = {
    aws = aws
  }

  depends_on = [
    module.load_balancer.http_load_balancer_listener,
    module.load_balancer.https_load_balancer_listener,
  ]
}
