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
  region  = "us-east-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

# -- TODO: DELETE --
provider "aws" {
  region  = "us-east-1"
  alias   = "us-east-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

provider "aws" {
  region  = "us-west-1"
  alias   = "us-west-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}
# -------------------

provider "aws" {
  region  = "us-east-1"
  alias   = "us_east_1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

provider "aws" {
  region  = "us-west-1"
  alias   = "us_west_1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

module "edge_replication_policy" {
  source = "../modules/edge-replication-policy"
  source_bucket = module.edge_storage_us_east_1
  destination_buckets = [module.edge_storage_us_west_1]
}

module "edge_storage_us_west_1" {
  source = "../modules/edge-secondary-storage"
  environment = var.ENVIRONMENT
  region = "us-west-1"
  providers = {
    aws = aws.us_west_1
  }
}

module "edge_storage_us_east_1" {
  source = "../modules/edge-primary-storage"
  environment = var.ENVIRONMENT
  region = "us-east-1"
  replication_policy_arn = module.edge_replication_policy.arn
  destination_buckets = [module.edge_storage_us_west_1]
  providers = {
    aws = aws.us_east_1
  }
}
