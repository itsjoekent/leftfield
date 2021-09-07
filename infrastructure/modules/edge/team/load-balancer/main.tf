# aws_globalaccelerator_listener
variable "accelerator_listener" {}

variable "config" {}

# list(aws_subnet)
variable "public_subnets" {}

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

resource "aws_lb" "edge" {
  name                             = "team-${var.region}-lb"
  load_balancer_type               = "network"
  subnets                          = var.public_subnets.*.id
  internal                         = false
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = var.config.variables.ENVIRONMENT == "production" ? true : false
}

resource "aws_lb_target_group" "edge_tcp" {
  name                 = "team-${var.region}-tcp-tg"
  port                 = var.config.global.edge.http_port
  protocol             = "TCP"
  vpc_id               = var.vpc.id
  target_type          = "ip"
  preserve_client_ip   = false
  deregistration_delay = 5

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTP"
    timeout             = 6
    path                = var.config.global.edge.health_check_path
    unhealthy_threshold = 2
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group" "edge_tls" {
  name                 = "team-${var.region}-tls-tg"
  port                 = var.config.global.edge.https_port
  protocol             = "TCP"
  vpc_id               = var.vpc.id
  target_type          = "ip"
  preserve_client_ip   = false
  deregistration_delay = 5

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTPS"
    timeout             = 10
    path                = var.config.global.edge.health_check_path
    unhealthy_threshold = 2
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "edge_tcp_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = var.config.global.edge.http_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tcp.arn
  }
}

resource "aws_lb_listener" "edge_tls_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = var.config.global.edge.https_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tls.arn
  }
}

data "aws_globalaccelerator_accelerator" "edge" {
  name = var.config.global.edge.accelerator_name
}

resource "aws_globalaccelerator_endpoint_group" "edge" {
  listener_arn = var.accelerator_listener.id

  endpoint_configuration {
    endpoint_id = aws_lb.edge.arn
    weight      = 100
  }
}

output "http_load_balancer_listener" {
  value = aws_lb_listener.edge_tcp_forward
}

output "https_load_balancer_listener" {
  value = aws_lb_listener.edge_tls_forward
}

output "http_target_group" {
  value = aws_lb_target_group.edge_tcp
}

output "https_target_group" {
  value = aws_lb_target_group.edge_tls
}
