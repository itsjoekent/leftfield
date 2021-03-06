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
      name = "development"
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
