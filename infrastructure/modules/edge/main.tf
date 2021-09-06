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

    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.6"
    }
  }
}

module "accelerator" {
  source = "./accelerator"
  config = var.config

  providers = {
    aws      = aws.primary
    dnsimple = dnsimple
  }
}

module "storage" {
  source = "./storage"
  config = var.config

  providers = {
    aws.primary   = aws.primary
    aws.us_east_1 = aws.us_east_1
    aws.us_west_1 = aws.us_west_1
  }
}

resource "aws_ecr_repository" "image_repository" {
  name = "edge/${var.config.variables.ENVIRONMENT}"
}

module "team_us_east_1" {
  count = contains(var.config.environment.edge.regions, "us-east-1") ? 1 : 0

  source = "./team"
  config = var.config
  region = "us-east-1"

  providers = {
    aws = aws.us_east_1
  }

  depends_on = [
    module.accelerator.accelerator,
    module.storage.primary_bucket,
  ]
}

module "team_us_west_1" {
  count = contains(var.config.environment.edge.regions, "us-west-1") ? 1 : 0

  source = "./team"
  config = var.config
  region = "us-west-1"

  providers = {
    aws = aws.us_west_1
  }

  depends_on = [
    module.accelerator.accelerator,
    module.storage.primary_bucket,
  ]
}
