variable "config" {}

variable "region" {
  type = string
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

locals {
  availability_zones = var.config.edge_data.availability_zones[var.region]
}

resource "aws_vpc" "edge" {
  cidr_block = var.config.global.edge.vpc_cidr_block

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    name = "team-${var.region}-vpc"
  }
}

resource "aws_internet_gateway" "edge" {
  vpc_id = aws_vpc.edge.id
}

resource "aws_subnet" "edge_public" {
  count = length(local.availability_zones)

  vpc_id                  = aws_vpc.edge.id
  availability_zone       = local.availability_zones[count.index]
  cidr_block              = cidrsubnet(aws_vpc.edge.cidr_block, 6, count.index)
  map_public_ip_on_launch = true

  tags = {
    name = "team-${local.availability_zones[count.index]}-public-subnet"
  }

  depends_on = [
    aws_internet_gateway.edge
  ]
}

# resource "aws_route_table" "edge_public" {
#   vpc_id = aws_vpc.edge.id
#
#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.edge.id
#   }
#
#   tags = {
#     name = "team-${var.region}-public-route-table"
#   }
# }
#
# resource "aws_route_table_association" "edge_public" {
#   count = length(local.availability_zones)
#
#   subnet_id      = aws_subnet.edge_public[count.index].id
#   route_table_id = aws_route_table.edge_public.id
# }

resource "aws_subnet" "edge_private" {
  count = length(local.availability_zones)

  vpc_id                  = aws_vpc.edge.id
  availability_zone       = local.availability_zones[count.index]
  cidr_block              = cidrsubnet(aws_vpc.edge.cidr_block, 4, count.index + length(local.availability_zones))
  map_public_ip_on_launch = false

  tags = {
    name = "team-${local.availability_zones[count.index]}-private-subnet"
  }
}

resource "aws_eip" "edge" {
  count = length(local.availability_zones)

  vpc = true

  depends_on = [aws_internet_gateway.edge]

  tags = {
    name = "team-${local.availability_zones[count.index]}-eip"
  }
}

resource "aws_nat_gateway" "edge_public" {
  count = length(local.availability_zones)

  allocation_id = aws_eip.edge[count.index].id
  subnet_id     = aws_subnet.edge_public[count.index].id

  tags = {
    name = "team-${local.availability_zones[count.index]}-nat-gateway"
  }

  depends_on = [aws_internet_gateway.edge]
}

resource "aws_route_table" "edge_private" {
  count = length(local.availability_zones)

  vpc_id = aws_vpc.edge.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.edge_public[count.index].id
  }

  tags = {
    name = "team-${local.availability_zones[count.index]}-private-route-table"
  }
}

resource "aws_route_table_association" "edge_private" {
  count = length(local.availability_zones)

  subnet_id      = aws_subnet.edge_private[count.index].id
  route_table_id = aws_route_table.edge_private[count.index].id
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.edge.id
  service_name      = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.edge_private.*.id

  tags = {
    name = "team-${var.region}-s3-endpoint"
  }
}

output "vpc" {
  value = aws_vpc.edge
}

output "public_subnets" {
  value = aws_subnet.edge_public.*
}

output "private_subnets" {
  value = aws_subnet.edge_public.*
}
