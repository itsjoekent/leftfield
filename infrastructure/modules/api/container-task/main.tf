variable "autoscale_max" {
  type = number
}

variable "autoscale_min" {
  type = number
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

resource "aws_cloudwatch_log_group" "task" {
  name = "task-${var.name}-container-logs"

  retention_in_days = 30
}

resource "aws_ecs_task_definition" "task" {
  family                   = "task-${var.name}"
  network_mode             = "awsvpc"
  execution_role_arn       = var.iam_role.arn
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.config.environment.api.task_container_cpu
  memory                   = var.config.environment.api.task_container_memory

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
          awslogs-group         = aws_cloudwatch_log_group.task.name
          awslogs-stream-prefix = "awslogs-task-${var.name}"
        }
      }

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

resource "aws_security_group" "task" {
  name   = "task-${var.name}-ecs"
  vpc_id = var.vpc.id

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

data "aws_ecs_task_definition" "task" {
  task_definition = aws_ecs_task_definition.task.family
}

resource "aws_ecs_cluster" "task" {
  name = "task-${var.name}"
}

resource "aws_ecs_service" "task" {
  name                 = "task-${var.name}"
  cluster              = aws_ecs_cluster.task.id
  task_definition      = "${aws_ecs_task_definition.task.family}:${max(aws_ecs_task_definition.task.revision, data.aws_ecs_task_definition.task.revision)}"
  desired_count        = var.autoscale_min
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  launch_type          = "FARGATE"
  force_new_deployment = true

  network_configuration {
    subnets         = var.private_subnets.*.id
    security_groups = [aws_security_group.task.id]
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_appautoscaling_target" "task" {
  max_capacity       = var.autoscale_max
  min_capacity       = var.autoscale_min
  resource_id        = "service/${aws_ecs_cluster.task.name}/${aws_ecs_service.task.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "memory" {
  name               = "task-${var.name}-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.task.resource_id
  scalable_dimension = aws_appautoscaling_target.task.scalable_dimension
  service_namespace  = aws_appautoscaling_target.task.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value = var.config.environment.api.autoscaling.task.mem_threshold
  }
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "task-${var.name}-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.task.resource_id
  scalable_dimension = aws_appautoscaling_target.task.scalable_dimension
  service_namespace  = aws_appautoscaling_target.task.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = var.config.environment.api.autoscaling.task.cpu_threshold
  }
}
