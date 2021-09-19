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

locals {
  username = "leftfield"
}

locals {
  cidr_blocks = {
    api         = var.config.global.api.vpc_cidr_block
    "us-east-1" = var.config.global.edge.vpc_cidr_block["us-east-1"]
    "us-west-1" = var.config.global.edge.vpc_cidr_block["us-west-1"]
  }

  environment_cidr_blocks = concat(["api"], var.config.environment.regions)
}

resource "aws_security_group" "broker" {
  name = "edge-broker"
  vpc_id = var.vpc.id

  dynamic "ingress" {
    for_each = local.environment_cidr_blocks

    content {
      from_port   = 0
      to_port     = 0
      protocol    = -1
      cidr_blocks = [local.cidr_blocks[ingress.value]]
    }
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "random_password" "broker" {
  length  = 16
  special = false
}

resource "aws_mq_broker" "leftfield" {
  broker_name = "leftfield"

  engine_type        = "ActiveMQ"
  engine_version     = "5.15.9"
  host_instance_type = var.config.environment.edge.broker_instance_type
  apply_immediately  = true
  publicly_accessible = false
  deployment_mode = "ACTIVE_STANDBY_MULTI_AZ"

  security_groups = [aws_security_group.broker.id]
  subnet_ids      = var.private_subnets.*.id

  user {
    username = local.username
    password = random_password.broker.result
    console_access = true
  }
}

output "environment_vars" {
  value = [
    {
      name  = "BROADCAST_URL"
      value = aws_mq_broker.leftfield.instances.0.endpoints.3
    },
    {
      name  = "BROADCAST_USER"
      value = local.username
    },
    {
      name  = "BROADCAST_PASSWORD"
      value = random_password.broker.result
    }
  ]
}

output "broker" {
  value = aws_mq_broker.leftfield
}
