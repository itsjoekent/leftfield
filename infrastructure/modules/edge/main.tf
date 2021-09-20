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
      version = "~> 0.9"
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

module "team_network_us_east_1" {
  count = contains(var.config.environment.regions, "us-east-1") ? 1 : 0

  source = "./team/network"
  config = local.config
  region = "us-east-1"

  providers = {
    aws = aws.us_east_1
  }
}

module "team_network_us_west_1" {
  count = contains(var.config.environment.regions, "us-west-1") ? 1 : 0

  source = "./team/network"
  config = local.config
  region = "us-west-1"

  providers = {
    aws = aws.us_west_1
  }
}

locals {
  networks = {
    "us-east-1" = try(module.team_network_us_east_1.0, null)
    "us-west-1" = try(module.team_network_us_west_1.0, null)
  }

  primary_network = local.networks[var.config.environment.primary_region]
}

module "us_east_1_peer" {
  count = contains(var.config.environment.secondary_regions, "us-east-1") ? 1 : 0

  source = "./team/peer"
  config = local.config
  region = "us-east-1"

  primary_vpc                  = local.primary_network.vpc
  primary_private_route_tables = local.primary_network.private_route_tables

  tean_private_route_tables = local.networks["us-east-1"].private_route_tables
  team_vpc                  = local.networks["us-east-1"].vpc

  providers = {
    aws.primary = aws.primary
    aws.team    = aws.us_east_1
  }
}

module "us_west_1_peer" {
  count = contains(var.config.environment.secondary_regions, "us-west-1") ? 1 : 0

  source = "./team/peer"
  config = local.config
  region = "us-west-1"

  primary_vpc                  = local.primary_network.vpc
  primary_private_route_tables = local.primary_network.private_route_tables

  team_private_route_tables = local.networks["us-west-1"].private_route_tables
  team_vpc                  = local.networks["us-west-1"].vpc

  providers = {
    aws.primary = aws.primary
    aws.team    = aws.us_west_1
  }
}

module "broker" {
  source = "./broker"
  config = local.config

  private_subnets = local.primary_network.private_subnets
  vpc             = local.primary_network.vpc

  providers = {
    aws = aws.primary
  }
}

module "team_us_east_1" {
  count = contains(var.config.environment.regions, "us-east-1") ? 1 : 0

  source = "./team"
  config = local.config
  region = "us-east-1"

  broker_env           = module.broker.environment_vars
  image_repository     = aws_ecr_repository.image_repository
  accelerator_listener = module.accelerator.listener
  network              = local.networks["us-east-1"]

  providers = {
    aws = aws.us_east_1
  }

  depends_on = [
    module.storage.primary_bucket
  ]
}

module "team_us_west_1" {
  count = contains(var.config.environment.regions, "us-west-1") ? 1 : 0

  source = "./team"
  config = local.config
  region = "us-west-1"

  broker_env           = module.broker.environment_vars
  image_repository     = aws_ecr_repository.image_repository
  accelerator_listener = module.accelerator.listener
  network              = local.networks["us-west-1"]

  providers = {
    aws = aws.us_west_1
  }

  depends_on = [
    module.storage.primary_bucket
  ]
}

output "accelerator" {
  value = module.accelerator.accelerator
}

output "broker_env" {
  value = module.broker.environment_vars
}

output "primary_network" {
  value = local.primary_network
}
