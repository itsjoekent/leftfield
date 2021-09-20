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

# team-us-east-1
# subnet-0294ebb4255b5e309
# vpc-03ceffff242feeeff
#
# team-us-west-1
# subnet-0c581d1b17e60aeae
# vpc-0903e689ce5d2f2a8
# Destination Target
# 10.1.0.0/16	pcx-09951edae905bb12c
#   pcx-09951edae905bb12c
#     vpc-0903e689ce5d2f2a8
#
# Amazon MQ Brokers leftfield
#   subnet-0294ebb4255b5e309
#   subnet-0bc508179ad64b09f
#     vpc-03ceffff242feeeff
#
# Why is the destination target for -west- ... west... and not the primary


module "api_edge_peer" {
  source = "../api/edge-peer"
  config = var.config

  api_vpc              = module.api.network.vpc
  edge_vpc             = module.edge.primary_network.vpc
  private_route_tables = module.api.network.private_route_tables
}
