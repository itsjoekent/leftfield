# TODO:
# Global Edge redis cluster
# Global accelerator
# DNS entry
# API application, Mongo

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
    AWS_ACCESS_KEY_ID = {
      name  = "AWS_ACCESS_KEY_ID"
      value = var.AWS_ACCESS_KEY_ID
    }

    AWS_SECRET_ACCESS_KEY = {
      name  = "AWS_SECRET_ACCESS_KEY"
      value = var.AWS_SECRET_ACCESS_KEY
    }

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
}

module "edge_team_us_east_1" {
  source                  = "../modules/edge-team"
  environment             = var.ENVIRONMENT
  region                  = "us-east-1"
  image_repository        = module.edge_global.image_repository
  ecs_task_execution_role = module.edge_global.ecs_task_execution_role
  container_vars          = local.edge_container_vars
  container_cpu           = 1
  container_memory        = 2048
  auto_scale_max          = 2
  providers = {
    aws = aws.us_east_1
  }
}
