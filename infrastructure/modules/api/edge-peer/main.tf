# aws_vpc
variable "api_vpc" {}

variable "config" {}

# aws_vpc
variable "edge_vpc" {}

# list(aws_route_table)
variable "private_route_tables" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

resource "aws_vpc_peering_connection" "api_network_peer" {
  vpc_id        = var.edge_vpc.id
  peer_vpc_id   = var.api_vpc.id
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
  vpc_peering_connection_id = aws_vpc_peering_connection.api_network_peer.id
  auto_accept = true
}

resource "aws_route" "peer" {
  count = length(var.private_route_tables)

  route_table_id            = var.private_route_tables[count.index].id
  destination_cidr_block    = var.edge_vpc.cidr_block
  vpc_peering_connection_id = aws_vpc_peering_connection.api_network_peer.id
}
