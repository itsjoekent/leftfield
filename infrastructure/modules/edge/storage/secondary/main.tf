variable "config" {}

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

resource "aws_s3_bucket" "edge" {
  bucket = "leftfield-${var.config.variables.ENVIRONMENT}-${var.region}"
  acl    = "private"

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "block_cdn_public_access" {
  bucket = aws_s3_bucket.edge.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket" {
  value = aws_s3_bucket.edge
}
