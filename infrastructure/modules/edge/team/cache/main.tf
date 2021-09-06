variable "config" {}

# list(aws_subnet)
variable "private_subnets" {}

variable "region" {
  type = string
}

# aws_vpc
variable "vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

resource "aws_elasticache_subnet_group" "edge_cache_subnet" {
  name       = "team-${var.region}-ch-net"
  subnet_ids = var.private_subnets.*.id
}

resource "aws_elasticache_parameter_group" "edge_cache" {
  name   = "team-${var.region}-param"
  family = "redis6.x"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lfu"
  }
}

resource "aws_security_group" "cache" {
  name   = "edge-cache-${var.region}"
  vpc_id = var.vpc.id

  ingress = [
    {
      description      = "TCP from VPC"
      from_port        = 0
      to_port          = 0
      protocol         = -1
      cidr_blocks      = [var.vpc.cidr_block]
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]

  egress = [
    {
      description      = "Outbound"
      from_port        = 0
      to_port          = 0
      protocol         = -1
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]
}

resource "aws_elasticache_replication_group" "edge_cache" {
  automatic_failover_enabled    = true
  availability_zones            = var.config.edge_data.availability_zones[var.region]
  replication_group_id          = "edge-${var.region}-cache"
  replication_group_description = "Edge cache"
  node_type                     = var.config.environment.edge.cache_node_type
  number_cache_clusters         = var.config.environment.edge.cache_nodes
  parameter_group_name          = aws_elasticache_parameter_group.edge_cache.id
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.edge_cache_subnet.name
  security_group_ids            = [aws_security_group.cache.id]
  transit_encryption_enabled    = false
  multi_az_enabled              = true
}

resource "random_password" "cache_user" {
  length  = 16
  special = false
}

resource "aws_elasticache_user" "cache" {
  user_id       = "edge-cache-${var.region}"
  user_name     = "edge-cache-${var.region}"
  access_string = "on ~* +@all"
  engine        = "REDIS"
  passwords     = [random_password.cache_user.result]
}

resource "aws_ecs_cluster" "edge" {
  name = "team-${var.region}-cls"
}

output "user" {
  value = aws_elasticache_user.cache
}

output "redis" {
  value = aws_elasticache_replication_group.edge_cache
}
