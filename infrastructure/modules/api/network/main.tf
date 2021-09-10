variable "availability_zones" {
  type = list(string)
}

variable "config" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

resource "aws_vpc" "api" {
  cidr_block = var.config.global.api.vpc_cidr_block

  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    name = "api-vpc"
  }
}

resource "aws_internet_gateway" "api" {
  vpc_id = aws_vpc.api.id
}

resource "aws_subnet" "api_public" {
  count = length(var.availability_zones)

  vpc_id                  = aws_vpc.api.id
  availability_zone       = var.availability_zones[count.index]
  cidr_block              = cidrsubnet(aws_vpc.api.cidr_block, 6, count.index)
  map_public_ip_on_launch = true

  tags = {
    name = "api-${var.availability_zones[count.index]}-public-subnet"
  }

  depends_on = [
    aws_internet_gateway.api
  ]
}

resource "aws_route_table" "api_public" {
  vpc_id = aws_vpc.api.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.api.id
  }

  tags = {
    name = "api-public-route-table"
  }
}

resource "aws_route_table_association" "api_public" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.api_public[count.index].id
  route_table_id = aws_route_table.api_public.id
}

resource "aws_subnet" "api_private" {
  count = length(var.availability_zones)

  vpc_id                  = aws_vpc.api.id
  availability_zone       = var.availability_zones[count.index]
  cidr_block              = cidrsubnet(aws_vpc.api.cidr_block, 4, count.index + length(var.availability_zones))
  map_public_ip_on_launch = false

  tags = {
    name = "api-${var.availability_zones[count.index]}-private-subnet"
  }
}

resource "aws_eip" "api" {
  count = length(var.availability_zones)

  vpc = true

  depends_on = [aws_internet_gateway.api]

  tags = {
    name = "api-${var.availability_zones[count.index]}-eip"
  }
}

resource "aws_nat_gateway" "api_public" {
  count = length(var.availability_zones)

  allocation_id = aws_eip.api[count.index].id
  subnet_id     = aws_subnet.api_public[count.index].id

  tags = {
    name = "api-${var.availability_zones[count.index]}-nat-gateway"
  }

  depends_on = [aws_internet_gateway.api]
}

resource "aws_route_table" "api_private" {
  count = length(var.availability_zones)

  vpc_id = aws_vpc.api.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.api_public[count.index].id
  }

  tags = {
    name = "api-${var.availability_zones[count.index]}-private-route-table"
  }
}

resource "aws_route_table_association" "api_private" {
  count = length(var.availability_zones)

  subnet_id      = aws_subnet.api_private[count.index].id
  route_table_id = aws_route_table.api_private[count.index].id
}

output "vpc" {
  value = aws_vpc.api
}

output "public_subnets" {
  value = aws_subnet.api_public.*
}

output "private_subnets" {
  value = aws_subnet.api_private.*
}
