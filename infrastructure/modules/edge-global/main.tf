variable "environment" {
  type = string
}

variable "dns_subdomain" {
  type    = string
  default = ""
}

variable "dns_zone" {
  type = string
}

terraform {
  required_providers {
    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.6"
    }
  }
}

resource "aws_ecr_repository" "image_repository" {
  name = "edge/${var.environment}"
}

resource "aws_s3_bucket" "edge_logs" {
  bucket = "leftfield-${var.environment}-accelerator-logs"
  acl    = "private"

  versioning {
    enabled = true
  }
}

resource "aws_globalaccelerator_accelerator" "edge" {
  name            = "team-${var.environment}-gacl"
  ip_address_type = "IPV4"
  enabled         = true

  attributes {
    flow_logs_enabled   = true
    flow_logs_s3_bucket = aws_s3_bucket.edge_logs.name
    flow_logs_s3_prefix = "accelerator-flow-logs/"
  }
}

locals {
  accelerator_ip_address = flatten(aws_globalaccelerator_accelerator.edge.ip_sets[*].ip_addresses)
}

resource "dnsimple_record" "root_domain_ip_1" {
  domain = var.dns_zone
  name   = var.dns_subdomain
  value  = local.accelerator_ip_address[0]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "root_domain_ip_2" {
  domain = var.dns_zone
  name   = var.dns_subdomain
  value  = local.accelerator_ip_address[1]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "www_domain_ip_1" {
  count = length(var.dns_subdomain) == 0 ? 1 : 0

  domain = var.dns_zone
  name   = "www"
  value  = local.accelerator_ip_address[0]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "www_domain_ip_2" {
  count = length(var.dns_subdomain) == 0 ? 1 : 0

  domain = var.dns_zone
  name   = "www"
  value  = local.accelerator_ip_address[1]
  type   = "A"
  ttl    = 3600
}

output "image_repository" {
  value = aws_ecr_repository.image_repository
}

output "globalaccelerator" {
  value = aws_globalaccelerator_accelerator.edge
}
