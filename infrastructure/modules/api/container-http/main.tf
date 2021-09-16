variable "autoscale_max" {
  type = number
}

variable "autoscale_min" {
  type = number
}

variable "aws_ip_ranges" {
  type = list(string)
}

variable "config" {}

variable "container_environment" {
  type = list(object({
    name  = string
    value = string
  }))
}

variable "container_secrets" {
  type = list(object({
    name      = string
    valueFrom = string
  }))
}

# aws_iam_role
variable "iam_role" {}

# aws_ecr_repository
variable "image_repository" {}

# aws_lb_target_group
variable "lb_target_group" {}

variable "name" {
  type = string
}

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

resource "aws_cloudwatch_log_group" "api" {
  name = "api-${var.name}-container-logs"

  retention_in_days = 30
}

resource "aws_ecs_task_definition" "api" {
  family                   = "api-${var.name}"
  network_mode             = "awsvpc"
  execution_role_arn       = var.iam_role.arn
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.config.environment.api.http_container_cpu
  memory                   = var.config.environment.api.http_container_memory

  container_definitions = jsonencode([
    {
      name      = var.name
      image     = "${var.image_repository.repository_url}:latest"
      essential = true

      environment = var.container_environment
      secrets     = var.container_secrets

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = var.config.environment.primary_region
          awslogs-group         = aws_cloudwatch_log_group.api.name
          awslogs-stream-prefix = "awslogs-api-${var.name}"
        }
      }

      portMappings = [
        {
          containerPort = var.config.global.api.http_port
          protocol      = "tcp"
        }
      ]

      ulimits = [
        {
          name      = "nofile"
          softLimit = 65536
          hardLimit = 65536
        }
      ]
    }
  ])
}

resource "aws_security_group" "api_aws" {
  # AWS enforces a maxiumum amount of rules per security group,
  # this is a hacky workaround.
  count = ceil(length(var.aws_ip_ranges) / 50)

  name   = "api-${var.name}-aws-${count.index}"
  vpc_id = var.vpc.id

  ingress = [
    {
      description      = "AWS Services"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = slice(var.aws_ip_ranges, count.index * 50, min((count.index * 50) + 50, length(var.aws_ip_ranges)))
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]
}

resource "aws_security_group" "api_lb" {
  name   = "api-${var.name}-ecs"
  vpc_id = var.vpc.id

  ingress = [
    {
      description      = "TCP from VPC"
      from_port        = var.config.global.api.http_port
      to_port          = var.config.global.api.http_port
      protocol         = "tcp"
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

locals {
  security_groups = flatten([
    [aws_security_group.api_lb.id],
    aws_security_group.api_aws.*.id
  ])
}

data "aws_ecs_task_definition" "api" {
  task_definition = aws_ecs_task_definition.api.family
}

resource "aws_ecs_cluster" "api" {
  name = "api-${var.name}"
}

resource "aws_ecs_service" "api" {
  name                 = "api-${var.name}"
  cluster              = aws_ecs_cluster.api.id
  task_definition      = "${aws_ecs_task_definition.api.family}:${max(aws_ecs_task_definition.api.revision, data.aws_ecs_task_definition.api.revision)}"
  desired_count        = var.autoscale_min
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  launch_type          = "FARGATE"
  force_new_deployment = true

  network_configuration {
    subnets         = var.private_subnets.*.id
    security_groups = local.security_groups
  }

  load_balancer {
    target_group_arn = var.lb_target_group.arn
    container_name   = var.name
    container_port   = var.config.global.api.http_port
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_appautoscaling_target" "api" {
  max_capacity       = var.autoscale_max
  min_capacity       = var.autoscale_min
  resource_id        = "service/${aws_ecs_cluster.api.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "memory" {
  name               = "api-${var.name}-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value = var.config.environment.api.autoscaling.http.mem_threshold
  }
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "api-${var.name}-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = var.config.environment.api.autoscaling.http.cpu_threshold
  }
}
