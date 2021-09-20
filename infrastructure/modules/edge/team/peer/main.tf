variable "config" {}

variable "region" {
  type = string
}

# aws_vpc
variable "primary_vpc" {}

# list(aws_route_table)
variable "private_route_tables" {}

# aws_vpc
variable "team_vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"

      configuration_aliases = [
        aws.primary,
        aws.team,
      ]
    }
  }
}

resource "aws_vpc_peering_connection" "team" {
  vpc_id        = var.team_vpc.id
  peer_vpc_id   = var.primary_vpc.id
  peer_region   = var.config.environment.primary_region
  peer_owner_id = var.config.variables.AWS_ACCOUNT_ID

  tags = {
    Name = "edge-${var.region} to edge-${var.config.environment.primary_region}"
  }

  provider = aws.team
}

resource "aws_vpc_peering_connection_accepter" "peer" {
  vpc_peering_connection_id = aws_vpc_peering_connection.team.id
  auto_accept = true

  provider = aws.primary
}

resource "aws_vpc_peering_connection_options" "requester" {
  vpc_peering_connection_id = aws_vpc_peering_connection_accepter.peer.id

  requester {
    allow_remote_vpc_dns_resolution = true
  }

  provider = aws.team
}

resource "aws_vpc_peering_connection_options" "accepter" {
  vpc_peering_connection_id = aws_vpc_peering_connection_accepter.peer.id

  accepter {
    allow_remote_vpc_dns_resolution = true
  }

  provider = aws.primary
}

resource "aws_route" "peer" {
  count = length(var.private_route_tables)

  route_table_id            = var.private_route_tables[count.index].id
  destination_cidr_block    = var.primary_vpc.cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.team.id

  provider = aws.team
}
