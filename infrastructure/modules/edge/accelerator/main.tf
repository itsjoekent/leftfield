variable "config" {}

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

resource "aws_globalaccelerator_accelerator" "edge" {
  name            = var.config.global.edge.accelerator_name
  ip_address_type = "IPV4"
  enabled         = true

  attributes {
    # TODO: Removing this seems to cause a lifecycle bug...
    flow_logs_s3_bucket = "leftfield-${var.config.variables.ENVIRONMENT}-logs"
    flow_logs_s3_prefix = "accelerator-flow-logs/"
    flow_logs_enabled   = false
  }
}

resource "aws_globalaccelerator_listener" "edge" {
  accelerator_arn = aws_globalaccelerator_accelerator.edge.id
  client_affinity = "NONE"
  protocol        = "TCP"

  port_range {
    from_port = var.config.global.edge.http_port
    to_port   = var.config.global.edge.http_port
  }

  port_range {
    from_port = var.config.global.edge.https_port
    to_port   = var.config.global.edge.https_port
  }
}

locals {
  accelerator_ip_address = flatten(aws_globalaccelerator_accelerator.edge.ip_sets[*].ip_addresses)
}

resource "dnsimple_zone_record" "root_domain_ip_1" {
  zone_name = var.config.variables.DNS_ZONE
  name      = var.config.variables.EDGE_DNS_SUBDOMAIN
  value     = local.accelerator_ip_address[0]
  type      = "A"
  ttl       = 3600
}

resource "dnsimple_zone_record" "root_domain_ip_2" {
  zone_name = var.config.variables.DNS_ZONE
  name      = var.config.variables.EDGE_DNS_SUBDOMAIN
  value     = local.accelerator_ip_address[1]
  type      = "A"
  ttl       = 3600
}

resource "dnsimple_zone_record" "www_domain_ip_1" {
  count = length(var.config.variables.EDGE_DNS_SUBDOMAIN) == 0 ? 1 : 0

  zone_name = var.config.variables.DNS_ZONE
  name      = "www"
  value     = local.accelerator_ip_address[0]
  type      = "A"
  ttl       = 3600
}

resource "dnsimple_zone_record" "www_domain_ip_2" {
  count = length(var.config.variables.EDGE_DNS_SUBDOMAIN) == 0 ? 1 : 0

  zone_name = var.config.variables.DNS_ZONE
  name      = "www"
  value     = local.accelerator_ip_address[1]
  type      = "A"
  ttl       = 3600
}

output "accelerator" {
  value = aws_globalaccelerator_accelerator.edge
}

output "listener" {
  value = aws_globalaccelerator_listener.edge
}
