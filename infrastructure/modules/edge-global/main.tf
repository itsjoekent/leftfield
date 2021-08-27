variable "environment" {
  type = string
}

variable "product_domain" {
  type = string
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

resource "dnsimple_record" "root_domain" {
  domain = var.product_domain
  value  = aws_globalaccelerator_accelerator.ip_sets.ip_addresses[0]
  type   = "A"
  ttl    = 3600
  name   = "product-${var.environment}"
}

resource "dnsimple_record" "root_domain" {
  count  = length(split(".", var.product_domain)) < 3 ? 1 : 0
  domain = "www.${var.product_domain}"
  value  = aws_globalaccelerator_accelerator.ip_sets.ip_addresses[0]
  type   = "A"
  ttl    = 3600
  name   = "product-${var.environment}"
}

output "image_repository" {
  value = aws_ecr_repository.image_repository
}

output "globalaccelerator" {
  value = aws_globalaccelerator_accelerator.edge
}
