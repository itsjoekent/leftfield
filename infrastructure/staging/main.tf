# TODO:
# - auto scale policy (edge & api)
# - mongodbatlas_cloud_backup_schedule + alerts

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

    random = {
      source  = "hashicorp/random"
      version = "3.1.0"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "getleftfield"

    workspaces {
      name = "aws-staging"
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

provider "dnsimple" {
  token   = var.DNSIMPLE_API_TOKEN
  account = var.DNSIMPLE_ACCOUNT_ID
}

provider "mongodbatlas" {
  public_key = var.MONGO_ATLAS_PUBLIC_KEY
  private_key  = var.MONGO_ATLAS_PRIVATE_KEY
}

module "global_config" {
  source = "../config/global"
}

module "environment_config" {
  source      = "../config/environment"
  ENVIRONMENT = var.ENVIRONMENT
}

locals {
  config = {
    variables = {
      API_DNS_SUBDOMAIN           = var.API_DNS_SUBDOMAIN
      AUTH_TOKEN_SECRET           = var.AUTH_TOKEN_SECRET
      AWS_ACCESS_KEY_ID           = var.AWS_ACCESS_KEY_ID
      AWS_ACCOUNT_ID              = var.AWS_ACCOUNT_ID
      AWS_SECRET_ACCESS_KEY       = var.AWS_SECRET_ACCESS_KEY
      DNS_ZONE                    = var.DNS_ZONE
      EDGE_CACHE_KEY              = var.EDGE_CACHE_KEY
      EDGE_DNS_SUBDOMAIN          = var.EDGE_DNS_SUBDOMAIN
      EMAIL_API_KEY               = var.EMAIL_API_KEY
      EMAIL_DOMAIN                = var.EMAIL_DOMAIN
      ENVIRONMENT                 = var.ENVIRONMENT
      MONGO_ATLAS_ORGANIZATION_ID = var.MONGO_ATLAS_ORGANIZATION_ID
      SSL_AT_REST_KEY             = var.SSL_AT_REST_KEY
    }

    environment = module.environment_config.config
    global      = module.global_config.config
  }
}

provider "aws" {
  region     = local.config.environment.primary_region
  alias      = "primary"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

module "entrypoint" {
  source = "../modules/entrypoint"
  config = local.config

  providers = {
    aws.primary   = aws.primary
    aws.us_east_1 = aws.us_east_1
    aws.us_west_1 = aws.us_west_1

    dnsimple = dnsimple

    mongodbatlas = mongodbatlas
  }
}
