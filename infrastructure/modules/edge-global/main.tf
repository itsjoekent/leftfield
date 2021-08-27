variable "environment" {
  type = string
}

variable "product_domain" {
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

resource "aws_globalaccelerator_accelerator" "edge" {
  name            = "team-${var.environment}-gacl"
  ip_address_type = "IPV4"
  enabled         = true

  attributes {
    flow_logs_enabled = false
  }
}

locals {
  domain_name            = replace(replace(var.product_domain, "getleftfield.com", ""), ".", "")
  accelerator_ip_address = flatten(aws_globalaccelerator_accelerator.edge.ip_sets[*].ip_addresses)
}

resource "dnsimple_record" "root_domain_ip_1" {
  domain = "getleftfield.com"
  name   = local.domain_name
  value  = local.accelerator_ip_address[0]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "root_domain_ip_2" {
  domain = "getleftfield.com"
  name   = local.domain_name
  value  = local.accelerator_ip_address[1]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "www_domain_ip_1" {
  count  = length(local.domain_name) == 0 ? 1 : 0
  domain = "getleftfield.com"
  name   = "www"
  value  = local.accelerator_ip_address[0]
  type   = "A"
  ttl    = 3600
}

resource "dnsimple_record" "www_domain_ip_2" {
  count  = length(local.domain_name) == 0 ? 1 : 0
  domain = "getleftfield.com"
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
