# aws_globalaccelerator_listener
variable "accelerator_listener" {}

variable "config" {}

# aws_ecr_repository
variable "image_repository" {}

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

module "network" {
  source = "./network"
  config = var.config
  region = var.region

  providers = {
    aws = aws
  }
}

# module "cache" {
#   source = "./cache"
#   config = var.config
#   region = var.region
#
#   private_subnets    = module.network.private_subnets
#   vpc                = module.network.vpc
#
#   providers = {
#     aws = aws
#   }
# }

module "load_balancer" {
  source = "./load-balancer"
  config = var.config
  region = var.region

  accelerator_listener = var.accelerator_listener
  public_subnets       = module.network.public_subnets
  vpc                  = module.network.vpc

  providers = {
    aws = aws
  }
}

module "elastic_container" {
  source = "./elastic-container"
  config = var.config
  region = var.region

  # cache_redis        = module.cache.redis
  # cache_user         = module.cache.user
  http_target_group  = module.load_balancer.http_target_group
  https_target_group = module.load_balancer.https_target_group
  image_repository   = var.image_repository
  private_subnets    = module.network.private_subnets
  vpc                = module.network.vpc

  providers = {
    aws = aws
  }

  depends_on = [
    module.load_balancer.http_load_balancer_listener,
    module.load_balancer.https_load_balancer_listener,
  ]
}
