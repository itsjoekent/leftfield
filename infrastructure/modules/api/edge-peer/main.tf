# aws_vpc
variable "api_private_route_tables" {}

# aws_vpc
variable "api_vpc" {}

variable "config" {}

# list(aws_route_table)
variable "edge_private_route_tables" {}

# aws_vpc
variable "edge_vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

resource "aws_vpc_peering_connection" "api_network_peer" {
  vpc_id        = var.api_vpc.id
  peer_vpc_id   = var.edge_vpc.id
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

# resource "aws_route" "api" {
#   count = length(var.api_private_route_tables)
#
#   route_table_id            = var.api_private_route_tables[count.index].id
#   destination_cidr_block    = var.edge_vpc.cidr_block
#   vpc_peering_connection_id = aws_vpc_peering_connection.api_network_peer.id
# }
#
# resource "aws_route" "edge" {
#   count = length(var.edge_private_route_tables)
#
#   route_table_id            = var.edge_private_route_tables[count.index].id
#   destination_cidr_block    = var.api_vpc.cidr_block
#   vpc_peering_connection_id = aws_vpc_peering_connection.api_network_peer.id
# }
