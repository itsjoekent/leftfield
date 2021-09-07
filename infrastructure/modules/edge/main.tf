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
  name = var.config.global.edge.image_repository_name
}

# NOTE:
# Putting these data resources in the conditional modules causes Terrafom to panic.

data "aws_ip_ranges" "all" {
  services = ["globalaccelerator", "route53_healthchecks"]

  provider = aws.primary
}

data "aws_availability_zones" "us_east_1_available" {
  state = "available"

  provider = aws.us_east_1
}

data "aws_availability_zones" "us_west_1_available" {
  state = "available"

  provider = aws.us_west_1
}

locals {
  config = merge(var.config, {
    edge_data = {
      availability_zones = {
        "us-east-1" = slice(data.aws_availability_zones.us_east_1_available.names, 0, 2)
        "us-west-1" = slice(data.aws_availability_zones.us_west_1_available.names, 0, 2)
      }

      container_firewall_aws_ip_ranges = data.aws_ip_ranges.all.cidr_blocks
    }
  })
}

module "team_us_east_1" {
  count = contains(var.config.environment.edge.regions, "us-east-1") ? 1 : 0

  source = "./team"
  config = local.config
  region = "us-east-1"

  providers = {
    aws = aws.us_east_1
  }

  depends_on = [
    aws_ecr_repository.image_repository,
    module.accelerator.accelerator,
    module.storage.primary_bucket,
  ]
}

module "team_us_west_1" {
  count = contains(var.config.environment.edge.regions, "us-west-1") ? 1 : 0

  source = "./team"
  config = local.config
  region = "us-west-1"

  providers = {
    aws = aws.us_west_1
  }

  depends_on = [
    aws_ecr_repository.image_repository,
    module.accelerator.accelerator,
    module.storage.primary_bucket,
  ]
}
