# aws_elasticache_replication_group
variable "cache_redis" {}

# aws_elasticache_user
variable "cache_user" {}

variable "config" {}

# aws_lb_target_group
variable "http_target_group" {}

# aws_lb_target_group
variable "https_target_group" {}

# aws_ecr_repository
variable "image_repository" {}

variable "region" {
  type = string
}

# list(aws_subnet)
variable "private_subnets" {}

# aws_vpc
variable "vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

locals {
  container_secrets = [
    {
      name  = "AWS_ACCESS_KEY_ID"
      path  = "/edge/AWS_ACCESS_KEY_ID"
      value = var.config.variables.AWS_ACCESS_KEY_ID
    },
    {
      name  = "AWS_SECRET_ACCESS_KEY"
      path  = "/edge/AWS_SECRET_ACCESS_KEY"
      value = var.config.variables.AWS_SECRET_ACCESS_KEY
    },
    {
      name  = "SSL_AT_REST_KEY"
      path  = "/edge/SSL_AT_REST_KEY"
      value = var.config.variables.SSL_AT_REST_KEY
    },
    {
      name  = "EMAIL_API_KEY"
      path  = "/edge/EMAIL_API_KEY"
      value = var.config.variables.EMAIL_API_KEY
    }
  ]

  storage_vars = concat([
    for region in var.config.environment.edge.regions : {
      "name" : "STORAGE_ENDPOINT_${upper(replace(region, "-", "_"))}",
      "value" : "https://s3.${region}.amazonaws.com"
    }
  ], [
    for region in var.config.environment.edge.regions : {
      "name" : "STORAGE_BUCKET_${upper(replace(region, "-", "_"))}",
      "value" : "leftfield-${var.config.variables.ENVIRONMENT}-${var.region}"
    }
  ])
}

resource "aws_cloudwatch_log_group" "edge_task" {
  name = "team-${var.region}-container-logs"
}

resource "aws_ssm_parameter" "edge_container_secret" {
  count = length(local.container_secrets)

  name      = local.container_secrets[count.index].path
  value     = local.container_secrets[count.index].value
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

resource "aws_iam_role" "edge_ecs_execution" {
  name               = "team-${var.region}-ecs-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

data "aws_iam_policy_document" "edge_ecs_read_ssm_secrets" {
  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameters"]
    resources = ["arn:aws:ssm:*:${var.config.variables.AWS_ACCOUNT_ID}:parameter/*"]
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
      "arn:aws:kms:*:${var.config.variables.AWS_ACCOUNT_ID}:key/*",
      "arn:aws:secretsmanager:*:${var.config.variables.AWS_ACCOUNT_ID}:secret:*"
    ]
  }
}

resource "aws_iam_role_policy" "edge_ecs_read_secrets" {
  name   = "SecretsReadOnly"
  role   = aws_iam_role.edge_ecs_execution.name
  policy = data.aws_iam_policy_document.edge_ecs_read_ssm_secrets.json
}

resource "aws_iam_role_policy_attachment" "edge_ecs_execution" {
  role       = aws_iam_role.edge_ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "edge" {
  family                   = "team-${var.region}-task"
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.edge_ecs_execution.arn
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.config.environment.edge.container_cpu
  memory                   = var.config.environment.edge.container_memory

  container_definitions = jsonencode([
    {
      name      = "edge-container"
      image     = "${image_repository.repository_url}:latest"
      essential = true

      secrets = [
        for secret in local.container_secrets : {
          "name" : secret.name,
          "valueFrom" : "arn:aws:ssm:${var.region}:${var.config.variables.AWS_ACCOUNT_ID}:parameter${secret.path}"
        }
      ]

      environment = concat(local.storage_vars, [
        {
          name  = "DEFAULT_MAX_AGE"
          value = tostring(86400)
        },
        {
          name  = "DNS_ZONE"
          value = var.config.variables.DNS_ZONE
        },
        {
          name  = "EMAIL_DOMAIN"
          value = var.config.variables.EMAIL_DOMAIN
        },
        {
          name  = "EDGE_DOMAIN"
          value = "https://${join(".", compact([var.config.variables.DNS_SUBDOMAIN, var.config.variables.DNS_ZONE]))}"
        },
        {
          name  = "HTTP_PORT"
          value = tostring(var.config.global.edge.http_port)
        },
        {
          name  = "HTTPS_PORT"
          value = tostring(var.config.global.edge.https_port)
        },
        {
          name  = "NODE_ENV"
          value = var.config.variables.ENVIRONMENT
        },
        {
          name  = "REDIS_CACHE_URL"
          value = "redis://${var.cache_user.user_name}:${tolist(var.cache_user.passwords)[0]}@${var.cache_redis.primary_endpoint_address}:${var.cache_redis.port}"
        },
        {
          name  = "REGION"
          value = var.region
        },
        {
          name  = "STORAGE_MAIN_REGION"
          value = var.config.environment.edge.primary_region
        },
        {
          name  = "STORAGE_REGIONS"
          value = replace(upper(join(",", var.config.environment.edge.regions)), "-", "_")
        }
      ])

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = var.region
          awslogs-group         = aws_cloudwatch_log_group.edge_task.name
          awslogs-stream-prefix = "awslogs-edge-team-${var.region}"
        }
      }

      portMappings = [
        {
          containerPort = var.config.global.edge.http_port
          protocol      = "tcp"
        },
        {
          containerPort = var.config.global.edge.https_port
          protocol      = "tcp"
        }
      ]

      ulimits = [
        {
          name      = "nofile"
          softLimit = 65536
          hardLimit = 65536
        }
      ]
    }
  ])
}

data "aws_ecs_task_definition" "edge" {
  task_definition = aws_ecs_task_definition.edge.family
}

resource "aws_security_group" "edge_aws" {
  # AWS enforces a maxiumum amount of rules per security group,
  # this is a hacky workaround.
  count = ceil(length(var.config.edge_data.container_firewall_aws_ip_ranges) / 50)

  name   = "team-${var.region}-aws-${count.index}"
  vpc_id = var.vpc.id

  ingress = [
    {
      description      = "AWS Services"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = slice(var.config.edge_data.container_firewall_aws_ip_ranges, count.index * 50, min((count.index * 50) + 50, length(var.config.edge_data.container_firewall_aws_ip_ranges)))
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]
}

resource "aws_security_group" "edge_ecs" {
  name   = "team-${var.region}-ecs"
  vpc_id = var.vpc.id

  ingress = [
    {
      description      = "TCP from VPC"
      from_port        = 0
      to_port          = 0
      protocol         = -1
      cidr_blocks      = [var.vpc.cidr_block]
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]

  egress = [
    {
      description      = "Outbound"
      from_port        = 0
      to_port          = 0
      protocol         = -1
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]
}

locals {
  security_groups = flatten([
    [aws_security_group.edge_ecs.id],
    aws_security_group.edge_aws.*.id
  ])
}

resource "aws_ecs_cluster" "edge" {
  name = "team-${var.region}-cls"
}

resource "aws_ecs_service" "edge" {
  name                 = "team-${var.region}-svc"
  cluster              = aws_ecs_cluster.edge.id
  task_definition      = "${aws_ecs_task_definition.edge.family}:${max(aws_ecs_task_definition.edge.revision, data.aws_ecs_task_definition.edge.revision)}"
  desired_count        = var.config.environment.edge.autoscale_min
  launch_type          = "FARGATE"
  force_new_deployment = true

  network_configuration {
    subnets         = var.private_subnets.*.id
    security_groups = local.security_groups
  }

  load_balancer {
    target_group_arn = var.http_target_group.arn
    container_name   = "edge-container"
    container_port   = var.config.global.edge.http_port
  }

  load_balancer {
    target_group_arn = var.https_target_group.arn
    container_name   = "edge-container"
    container_port   = var.config.global.edge.https_port
  }

  depends_on = [
    aws_iam_role.edge_ecs_execution,
  ]
}
