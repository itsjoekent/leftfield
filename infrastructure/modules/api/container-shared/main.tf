# aws_elasticache_replication_group
variable "redis_replication_group" {}

# aws_elasticache_user
variable "redis_user" {}

variable "config" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

locals {
  secrets_data = [
    {
      name  = "AUTH_TOKEN_SECRET"
      path  = "/api/AUTH_TOKEN_SECRET"
      value = var.config.variables.AUTH_TOKEN_SECRET
    },
    {
      name  = "AWS_ACCESS_KEY_ID"
      path  = "/api/AWS_ACCESS_KEY_ID"
      value = var.config.variables.AWS_ACCESS_KEY_ID
    },
    {
      name  = "AWS_SECRET_ACCESS_KEY"
      path  = "/api/AWS_SECRET_ACCESS_KEY"
      value = var.config.variables.AWS_SECRET_ACCESS_KEY
    },
    {
      name  = "EMAIL_API_KEY"
      path  = "/api/EMAIL_API_KEY"
      value = var.config.variables.EMAIL_API_KEY
    },
    {
      name  = "SSL_AT_REST_KEY"
      path  = "/api/SSL_AT_REST_KEY"
      value = var.config.variables.SSL_AT_REST_KEY
    }
  ]

  storage_vars = concat(
    [
      for region in var.config.environment.regions : {
        name  = "STORAGE_ENDPOINT_${upper(replace(region, "-", "_"))}",
        value = "https://s3.${region}.amazonaws.com"
      }
    ],
    [
      for region in var.config.environment.regions : {
        name  = "STORAGE_BUCKET_${upper(replace(region, "-", "_"))}",
        value = "leftfield-${var.config.variables.ENVIRONMENT}-${region}"
      }
    ]
  )

  container_secrets = [
    for secret in local.secrets_data : {
      name      = secret.name
      valueFrom = "arn:aws:ssm:${var.config.environment.primary_region}:${var.config.variables.AWS_ACCOUNT_ID}:parameter${secret.path}"
    }
  ]

  container_environment = concat(local.storage_vars, [
    {
      name  = "DOMAIN"
      value = join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))
    },
    {
      name  = "EDGE_DNS_CNAME"
      value = join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))
    },
    {
      name  = "EMAIL_DOMAIN"
      value = var.config.variables.EMAIL_DOMAIN
    },
    {
      name  = "FRONTEND_URL"
      value = "https://${join(".", compact([var.config.variables.EDGE_DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))}"
    },
    {
      name  = "NODE_ENV"
      value = var.config.variables.ENVIRONMENT
    },
    {
      name  = "PORT"
      value = tostring(var.config.global.api.http_port)
    },
    {
      name  = "REDIS_URL"
      value = "redis://${var.redis_user.user_name}:${tolist(var.redis_user.passwords)[0]}@${var.redis_replication_group.primary_endpoint_address}:${var.redis_replication_group.port}"
    },
    {
      name  = "STORAGE_MAIN_REGION"
      value = var.config.environment.primary_region
    },
    {
      name  = "STORAGE_REGIONS"
      value = replace(upper(join(",", var.config.environment.regions)), "-", "_")
    }
  ])
}

resource "aws_ssm_parameter" "api_container_secret" {
  count = length(local.secrets_data)

  name      = local.secrets_data[count.index].path
  value     = local.secrets_data[count.index].value
  type      = "SecureString"
  overwrite = true
}

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "api_ecs_execution" {
  name               = "api-ecs-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

data "aws_iam_policy_document" "api_ecs_read_ssm_secrets" {
  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameters"]
    resources = ["arn:aws:ssm:${var.config.environment.primary_region}:${var.config.variables.AWS_ACCOUNT_ID}:parameter/*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["ssm:DescribeParameters"]
    resources = ["*"]
  }

  statement {
    effect  = "Allow"
    actions = ["kms:Decrypt", "secretsmanager:GetSecretValue"]
    resources = [
      "arn:aws:kms:${var.config.environment.primary_region}:${var.config.variables.AWS_ACCOUNT_ID}:key/*",
      "arn:aws:secretsmanager:${var.config.environment.primary_region}:${var.config.variables.AWS_ACCOUNT_ID}:secret:*"
    ]
  }
}

resource "aws_iam_role_policy" "api_ecs_read_secrets" {
  name   = "SecretsReadOnly"
  role   = aws_iam_role.api_ecs_execution.name
  policy = data.aws_iam_policy_document.api_ecs_read_ssm_secrets.json
}

resource "aws_iam_role_policy_attachment" "api_ecs_execution" {
  role       = aws_iam_role.api_ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

output "secrets" {
  value = local.container_secrets
}

output "environment" {
  value = local.container_environment
}

output "ssm_parameters" {
  value = aws_ssm_parameter.api_container_secret
}

output "iam_role" {
  value = aws_iam_role.api_ecs_execution
}
