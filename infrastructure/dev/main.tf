terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  backend "remote" {
    hostname = "app.terraform.io"
    organization = "getleftfield"

    workspaces {
      name = "dev"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  region                  = "us-east-1"
  profile                 = "default"
}

provider "aws" {
  region                  = "us-west-1"
  alias                   = "us-west-1"
  profile                 = "default"
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
        "${aws_s3_bucket.cdn-us-east-1.arn}"
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
        "${aws_s3_bucket.cdn-us-east-1.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete",
        "s3:ReplicateTags"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.cdn-us-west-1.arn}/*"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "replication" {
  role       = aws_iam_role.cdn-replication.name
  policy_arn = aws_iam_policy.cdn-replication.arn
}

resource "aws_s3_bucket" "cdn-us-west-1" {
  bucket   = "leftfield-development-us-west-1"
  acl      = "private"
  provider = aws.us-west-1

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["Access-Control-Allow-Origin"]
  }

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket" "cdn-us-east-1" {
  bucket   = "leftfield-development-us-east-1"
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

  replication_configuration {
    role = aws_iam_role.cdn-replication.arn

    rules {
      id     = "Copy to us-west-1"
      prefix = ""
      status = "Enabled"

      destination {
        bucket        = aws_s3_bucket.cdn-us-west-1.arn
        storage_class = "STANDARD"
      }
    }
  }
}
