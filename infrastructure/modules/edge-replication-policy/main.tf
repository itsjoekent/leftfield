variable "source_bucket_arn" {
  type = string
}

variable "destination_buckets" {}

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
        "${var.source_bucket_arn}"
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
        "${var.source_bucket_arn}/*"
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
        %{ for bucket in var.destination_buckets }
        "${bucket.arn}/*"
        %{ endfor }
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

output "name" {
  value = aws_iam_role.cdn-replication.name
}

output "arn" {
  value = aws_iam_policy.cdn-replication.arn
}
