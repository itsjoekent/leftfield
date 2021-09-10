variable "availability_zones" {
  type = list(string)
}

variable "config" {}

# list(aws_subnet)
variable "private_subnets" {}

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

resource "aws_elasticache_subnet_group" "api_redis_subnet" {
  name       = "api-${var.config.environment.primary_region}-ch-net"
  subnet_ids = var.private_subnets.*.id
}

resource "aws_elasticache_parameter_group" "api_redis" {
  name   = "api-${var.config.environment.primary_region}-param"
  family = "redis6.x"

  parameter {
    name  = "maxmemory-policy"
    value = "volatile-lfu"
  }
}

resource "aws_security_group" "redis" {
  name   = "api-redis-${var.config.environment.primary_region}"
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

resource "aws_elasticache_replication_group" "api_redis" {
  automatic_failover_enabled    = true
  availability_zones            = var.availability_zones
  replication_group_id          = "api-${var.config.environment.primary_region}-redis"
  replication_group_description = "api redis"
  node_type                     = var.config.environment.api.redis_node_type
  number_cache_clusters         = var.config.environment.api.redis_nodes
  parameter_group_name          = aws_elasticache_parameter_group.api_redis.id
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.api_redis_subnet.name
  security_group_ids            = [aws_security_group.redis.id]
  transit_encryption_enabled    = false
  multi_az_enabled              = true
}

resource "random_password" "redis_user" {
  length  = 16
  special = false
}

resource "aws_elasticache_user" "redis" {
  user_id       = "api-redis-${var.config.environment.primary_region}"
  user_name     = "api-redis-${var.config.environment.primary_region}"
  access_string = "on ~* +@all"
  engine        = "REDIS"
  passwords     = [random_password.redis_user.result]
}

output "user" {
  value = aws_elasticache_user.redis
}

output "replication_group" {
  value = aws_elasticache_replication_group.api_redis
}
