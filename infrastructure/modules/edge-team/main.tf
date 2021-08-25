# TODO: Redis

variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "auto_scale_max" {
  type = number
}

variable "image_repository" {}

variable "ecs_task_execution_role" {}

variable "container_vars" {}

variable "container_cpu" {
  type = number
}

variable "container_memory" {
  type = number
}

variable "cache_node_type" {
  type = string
}

variable "cache_node_replicas" {
  type = number
}

locals {
  container_tcp_port = 5001
  container_tls_port = 5002

  vpc_cidr_block = "10.0.0.0/16"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "edge" {
  cidr_block = local.vpc_cidr_block

  enable_dns_support   = true
  enable_dns_hostnames = false
}

resource "aws_internet_gateway" "edge" {
  vpc_id = aws_vpc.edge.id
}

resource "aws_subnet" "edge" {
  count = length(data.aws_availability_zones.available.names)

  vpc_id            = aws_vpc.edge.id
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(local.vpc_cidr_block, 8, count.index)

  tags = {
    name = "edge-team-${data.aws_availability_zones.available.names[count.index]}-subnet"
  }

  depends_on = [
    aws_internet_gateway.edge
  ]
}

# resource "aws_elasticache_cluster" "cache" {
#   cluster_id           = "edge-team-${var.region}-cache"
#   engine               = "redis"
#   node_type            = var.cache_node_type
#   num_cache_nodes      = var.cache_node_replicas
#   parameter_group_name = "default.redis6.x"
#   engine_version       = "3.2.10"
#   port                 = 6379
# }

resource "aws_ecs_cluster" "edge" {
  name = "edge-team-${var.region}-cls"
}

resource "aws_lb" "edge" {
  name                             = "edge-team-${var.region}-lb"
  load_balancer_type               = "network"
  subnets                          = aws_subnet.edge.*.id
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = var.environment == "production" ? true : false
}

resource "aws_lb_target_group" "edge_tcp" {
  name               = "edge-team-${var.region}-tcp-tg"
  port               = local.container_tcp_port
  protocol           = "TCP"
  vpc_id             = aws_vpc.edge.id
  target_type        = "ip"
  preserve_client_ip = true

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTP"
    timeout             = 6
    path                = "/_leftfield/health-check"
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "edge_tls" {
  name               = "edge-team-${var.region}-tls-tg"
  port               = local.container_tls_port
  protocol           = "TCP"
  vpc_id             = aws_vpc.edge.id
  target_type        = "ip"
  preserve_client_ip = true

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTPS"
    timeout             = 10
    path                = "/_leftfield/health-check"
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "edge_tcp_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = local.container_tcp_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tcp.arn
  }
}

resource "aws_lb_listener" "edge_tls_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = local.container_tls_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tls.arn
  }
}

resource "aws_cloudwatch_log_group" "edge_task" {
  name = "edge-team-${var.region}-logs"
}

resource "aws_ecs_task_definition" "edge" {
  family                   = "edge-team-${var.region}-task"
  network_mode             = "awsvpc"
  execution_role_arn       = var.ecs_task_execution_role.arn
  requires_compatibilities = ["EC2"]
  container_definitions = jsonencode([
    {
      name      = "edge-container"
      image     = "${var.image_repository.repository_url}:latest"
      essential = true
      cpu       = var.container_cpu
      memory    = var.container_memory

      environment = toset(values(merge({
        NODE_ENV = {
          name  = "NODE_ENV"
          value = var.environment
        }

        HTTP_PORT = {
          name  = "HTTP_PORT"
          value = local.container_tcp_port
        }

        HTTPS_PORT = {
          name  = "HTTPS_PORT"
          value = local.container_tls_port
        }
      }, var.container_vars)))

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region = var.region
          awslogs-group  = aws_cloudwatch_log_group.edge_task.name
        }
      }

      portMappings = [
        {
          containerPort = local.container_tcp_port
          protocol      = "tcp"
        },
        {
          containerPort = local.container_tls_port
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

resource "aws_ecs_service" "edge" {
  name            = "edge-team-${var.region}-svc"
  cluster         = aws_ecs_cluster.edge.id
  task_definition = aws_ecs_task_definition.edge.arn
  desired_count   = 1
  launch_type     = "EC2"

  ordered_placement_strategy {
    field = "attribute:ecs.availability-zone"
    type  = "spread"
  }

  ordered_placement_strategy {
    field = "instanceId"
    type  = "spread"
  }

  network_configuration {
    subnets          = aws_subnet.edge.*.id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.edge_tcp.arn
    container_name   = "edge-container"
    container_port   = local.container_tcp_port
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.edge_tls.arn
    container_name   = "edge-container"
    container_port   = local.container_tls_port
  }

  depends_on = [
    aws_lb_listener.edge_tcp_forward,
    aws_lb_listener.edge_tls_forward,
    var.ecs_task_execution_role,
  ]
}

resource "aws_appautoscaling_target" "edge_ecs" {
  max_capacity       = var.auto_scale_max
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.edge.name}/${aws_ecs_service.edge.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "edge_ecs_memory" {
  name               = "edge-team-${var.region}-mem"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.edge_ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.edge_ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.edge_ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value = 60
  }
}

resource "aws_appautoscaling_policy" "edge_ecs_cpu" {
  name               = "edge-team-${var.region}-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.edge_ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.edge_ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.edge_ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 60
  }
}
