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

variable "replication_policy_arn" {
  type = string
}

variable "destination_buckets" {}

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

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["Access-Control-Allow-Origin"]
  }

  versioning {
    enabled = true
  }

  dynamic "replication_configuration" {
    for_each = var.destination_buckets

    content {
      role = var.replication_policy_arn

      rules {
        id     = "Copy to ${replication_configuration.value.region}"
        prefix = ""
        status = "Enabled"

        destination {
          bucket        = replication_configuration.value.arn
          storage_class = "STANDARD"
        }
      }
    }
  }
}

output "arn" {
  value = aws_s3_bucket.bucket.arn
}

output "region" {
  value = var.region
}
