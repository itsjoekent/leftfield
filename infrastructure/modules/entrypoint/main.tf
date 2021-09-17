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

resource "aws_vpc_peering_connection" "api_network_peer" {
  peer_vpc_id   = module.api.network.vpc.id
  vpc_id        = module.edge.primary_network.vpc.id
  auto_accept   = true

  accepter {
    allow_remote_vpc_dns_resolution = true
  }

  requester {
    allow_remote_vpc_dns_resolution = true
  }

  tags = {
    Name = "api peer to edge-${var.config.environment.primary_region}"
  }
}

resource "aws_vpc_peering_connection_accepter" "peer" {
  vpc_peering_connection_id = module.api.network.vpc.id
  auto_accept = true
}
