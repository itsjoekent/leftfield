variable "prefix" {
  type = string
  default = "leftfield"
}

variable "environment" {
  type = string
}

variable "region" {
  type = string
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

resource "aws_s3_bucket" "bucket" {
  bucket   = "${var.prefix}-${var.environment}-${var.region}"
  acl      = "private"

  versioning {
    enabled = true
  }
}

output "arn" {
  value = aws_s3_bucket.bucket.arn
}

output "region" {
  value = var.region
}
