variable "config" {}

variable "region" {
  type = string
}

# list(aws_s3_bucket)
variable "secondary_buckets" {}

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

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["Access-Control-Allow-Origin"]
  }

  versioning {
    enabled = true
  }

  lifecycle_rule {
    id      = "Move to Intelligent-Tiering"
    enabled = true

    transition {
      storage_class = "INTELLIGENT_TIERING"
    }
  }

  lifecycle_rule {
    id      = "Delete ACME challenge tokens"
    prefix  = "acme-challenge/"
    enabled = true

    expiration {
      days = 7
    }
  }

  dynamic "replication_configuration" {
    for_each = var.secondary_buckets

    content {
      role = aws_iam_role.cdn-replication.arn

      rules {
        id     = "Copy to ${replication_configuration.value.id}"
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

resource "aws_s3_bucket_public_access_block" "block_cdn_public_access" {
  bucket = aws_s3_bucket.edge.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_iam_role" "cdn-replication" {
  name = "cdn-storage-replication-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "cdn-replication" {
  name = "cdn-storage-replication-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetReplicationConfiguration",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.edge.arn}"
      ]
    },
    {
      "Action": [
        "s3:GetObjectVersionForReplication",
        "s3:GetObjectVersionAcl",
         "s3:GetObjectVersionTagging"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.edge.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete",
        "s3:ReplicateTags"
      ],
      "Effect": "Allow",
      "Resource": [
        %{for bucket in var.secondary_buckets}
        "${bucket.arn}/*"
        %{endfor}
      ]
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "replication" {
  role       = aws_iam_role.cdn-replication.name
  policy_arn = aws_iam_policy.cdn-replication.arn
}

output "bucket" {
  value = aws_s3_bucket.edge
}
