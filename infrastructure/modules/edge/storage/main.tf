variable "config" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"

      configuration_aliases = [
        aws.primary,
        aws.us_east_1,
        aws.us_west_1,
      ]
    }
  }
}

module "secondary_us_east_1" {
  count = contains(var.config.environment.edge.secondary_regions, "us-east-1") ? 1 : 0

  source = "./secondary"
  config = var.config
  region = "us-east-1"

  providers = {
    aws = aws.us_east_1
  }
}

module "secondary_us_west_1" {
  count = contains(var.config.environment.edge.secondary_regions, "us-west-1") ? 1 : 0

  source = "./secondary"
  config = var.config
  region = "us-west-1"

  providers = {
    aws = aws.us_west_1
  }
}

locals {
  secondary_buckets = compact([
    try(module.secondary_us_east_1[0].bucket, ""),
    try(module.secondary_us_west_1[0].bucket, "")
  ])
}

module "primary_us_east_1" {
  count = var.config.environment.edge.primary_region == "us-east-1" ? 1 : 0

  source = "./primary"
  config = var.config
  region = "us-east-1"

  secondary_buckets = local.secondary_buckets

  providers = {
    aws = aws.us_east_1
  }
}

module "primary_us_west_1" {
  count = var.config.environment.edge.primary_region == "us-west-1" ? 1 : 0

  source = "./primary"
  config = var.config
  region = "us-west-1"

  secondary_buckets = local.secondary_buckets

  providers = {
    aws = aws.us_west_1
  }
}

locals {
  primary_bucket = element(compact([
    try(module.primary_us_east_1[0].bucket, ""),
    try(module.primary_us_west_1[0].bucket, "")
  ]), 0)
}

output "primary_bucket" {
  value = local.primary_bucket
}

output "secondary_buckets" {
  value = local.secondary_buckets
}
