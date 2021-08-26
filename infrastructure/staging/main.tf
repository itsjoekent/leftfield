# TODO:
# https://aws.amazon.com/about-aws/whats-new/2019/03/aws-privatelink-now-supports-access-over-vpc-peering/
# Peering between Edge VPC's
# Global Edge redis cluster
# Edge global accelerator
#  -> Take edge LB off public subnet
# Edge DNSimple DNS entry

# API application, Mongo
#  - Seperate domain / infra from Edge

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "getleftfield"

    workspaces {
      name = "staging"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

provider "aws" {
  region     = "us-east-1"
  alias      = "us_east_1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

provider "aws" {
  region     = "us-west-1"
  alias      = "us_west_1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

module "edge_global" {
  source      = "../modules/edge-global"
  environment = var.ENVIRONMENT
}

module "edge_storage_us_west_1" {
  source      = "../modules/edge-secondary-storage"
  environment = var.ENVIRONMENT
  region      = "us-west-1"
  providers = {
    aws = aws.us_west_1
  }
}

module "edge_storage_us_east_1" {
  source              = "../modules/edge-primary-storage"
  environment         = var.ENVIRONMENT
  region              = "us-east-1"
  destination_buckets = [module.edge_storage_us_west_1]
  providers = {
    aws = aws.us_east_1
  }
}

# TODO: Inject environment variables for Email API
# DEFAULT_MAX_AGE
# EDGE_DOMAIN
locals {
  edge_container_vars = {
    STORAGE_MAIN_REGION = {
      name  = "STORAGE_MAIN_REGION"
      value = "us-east-1"
    }

    STORAGE_REGIONS = {
      name  = "STORAGE_REGIONS"
      value = "us-east-1,us-west-1"
    }

    STORAGE_ENDPOINT_US_EAST_1 = {
      name  = "STORAGE_ENDPOINT_US_EAST_1"
      value = "https://s3.us-east-1.amazonaws.com"
    }

    STORAGE_BUCKET_US_EAST_1 = {
      name  = "STORAGE_BUCKET_US_EAST_1"
      value = module.edge_storage_us_east_1.name
    }

    STORAGE_ENDPOINT_US_WEST_1 = {
      name  = "STORAGE_ENDPOINT_US_WEST_1"
      value = "https://s3.us-west-1.amazonaws.com"
    }

    STORAGE_BUCKET_US_WEST_1 = {
      name  = "STORAGE_BUCKET_US_WEST_1"
      value = module.edge_storage_us_west_1.name
    }
  }

  edge_container_secrets = [
    {
      name  = "AWS_ACCESS_KEY_ID"
      path  = "/edge/AWS_ACCESS_KEY_ID"
      value = var.AWS_ACCESS_KEY_ID
    },
    {
      name  = "AWS_SECRET_ACCESS_KEY"
      path  = "/edge/AWS_SECRET_ACCESS_KEY"
      value = var.AWS_SECRET_ACCESS_KEY
    }
  ]
}

module "edge_team_us_east_1" {
  source            = "../modules/edge-team"
  environment       = var.ENVIRONMENT
  region            = "us-east-1"
  aws_account_id    = var.AWS_ACCOUNT_ID
  image_repository  = module.edge_global.image_repository
  container_vars    = local.edge_container_vars
  container_secrets = local.edge_container_secrets
  container_cpu     = 1
  container_memory  = 2048
  auto_scale_max    = 2
  storage_bucket    = module.edge_storage_us_east_1
  cache_node_type   = "cache.t2.small"
  cache_nodes       = 2
  providers = {
    aws = aws.us_east_1
  }
}
