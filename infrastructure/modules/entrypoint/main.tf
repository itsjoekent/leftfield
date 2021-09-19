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

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.0.1"
    }
  }
}

module "edge" {
  source = "../edge"
  config = var.config

  providers = {
    aws.primary   = aws.primary
    aws.us_east_1 = aws.us_east_1
    aws.us_west_1 = aws.us_west_1

    dnsimple = dnsimple
  }
}

module "api" {
  source = "../api"
  config = var.config

  broker_env       = module.edge.broker_env
  edge_accelerator = module.edge.accelerator

  providers = {
    aws          = aws.primary
    dnsimple     = dnsimple
    mongodbatlas = mongodbatlas
  }
}

module "api_edge_peer" {
  source = "../api/edge-peer"
  config = var.config

  api_vpc              = module.api.network.vpc
  edge_vpc             = module.edge.primary_network.vpc.id
  private_route_tables = module.api.network.private_route_tables
}
