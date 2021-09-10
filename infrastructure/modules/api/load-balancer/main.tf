variable "config" {}

# list(aws_subnet)
variable "public_subnets" {}

# aws_vpc
variable "vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }

    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.9"
    }
  }
}

resource "aws_security_group" "api_alb" {
  name   = "api-security-group"
  vpc_id = var.vpc.id

  ingress {
    protocol         = "tcp"
    from_port        = var.config.global.api.http_port
    to_port          = var.config.global.api.http_port
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol         = "tcp"
    from_port        = var.config.global.api.https_port
    to_port          = var.config.global.api.https_port
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    protocol         = "-1"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_lb" "api" {
  name                       = "api-lb"
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.api_alb.id]
  subnets                    = var.public_subnets.*.id
  internal                   = false
  enable_deletion_protection = var.config.variables.ENVIRONMENT == "production" ? true : false
  enable_http2               = true
}

resource "dnsimple_zone_record" "root_domain_ip_1" {
  zone_name = var.config.variables.DNS_ZONE
  name      = var.config.variables.API_DNS_SUBDOMAIN
  value     = aws_lb.api.dns_name
  type      = "CNAME"
  ttl       = var.config.environment.default_dns_ttl
}

resource "aws_lb_target_group" "api" {
  name                 = "api-target-group"
  port                 = var.config.global.api.http_port
  protocol             = "HTTP"
  vpc_id               = var.vpc.id
  target_type          = "ip"
  deregistration_delay = 5

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTP"
    timeout             = 6
    path                = var.config.global.api.health_check_path
    unhealthy_threshold = 2
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_alb_listener" "api_http" {
  load_balancer_arn = aws_lb.api.id
  port              = var.config.global.api.http_port
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_acm_certificate" "api" {
  domain_name       = "${var.config.variables.API_DNS_SUBDOMAIN}.${var.config.variables.DNS_ZONE}"
  validation_method = "DNS"
}

resource "dnsimple_zone_record" "https_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = replace(dvo.resource_record_name, ".${var.config.variables.DNS_ZONE}.", "")
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_name = var.config.variables.DNS_ZONE
  name      = each.value.name
  value     = each.value.record
  type      = each.value.type
  ttl       = var.config.environment.default_dns_ttl
}

resource "aws_acm_certificate_validation" "api" {
  certificate_arn = aws_acm_certificate.api.arn
  validation_record_fqdns = [
    for record in dnsimple_zone_record.https_validation : "${record.name}.${var.config.variables.DNS_ZONE}"
  ]
}

resource "aws_lb_listener" "api_https" {
  load_balancer_arn = aws_lb.api.arn
  port              = var.config.global.api.https_port
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate_validation.api.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

output "target_group" {
  value = aws_lb_target_group.api
}
