variable "auto_scale_max" {
  type = number
}
variable "aws_account_id" {
  type = string
}
variable "cache_node_type" {
  type = string
}
variable "cache_nodes" {
  type = number
}
variable "container_vars" {}
variable "container_secrets" {}
variable "container_cpu" {
  type = number
}
variable "container_memory" {
  type = number
}
variable "environment" {
  type = string
}
variable "globalaccelerator" {}
variable "image_repository" {}
variable "instance_type" {
  type = string
}
variable "region" {
  type = string
}
variable "storage_bucket" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  container_tcp_port = 80
  container_tls_port = 443

  vpc_cidr_block = "10.0.0.0/16"

  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)
}

resource "aws_vpc" "edge" {
  cidr_block = local.vpc_cidr_block

  enable_dns_support   = true
  enable_dns_hostnames = false

  tags = {
    name = "team-${var.region}-vpc"
  }
}

resource "aws_internet_gateway" "edge" {
  vpc_id = aws_vpc.edge.id
}

resource "aws_subnet" "edge_public" {
  count = length(local.availability_zones)

  vpc_id                  = aws_vpc.edge.id
  availability_zone       = local.availability_zones[count.index]
  cidr_block              = cidrsubnet(local.vpc_cidr_block, 6, count.index)
  map_public_ip_on_launch = true

  tags = {
    name = "team-${local.availability_zones[count.index]}-public-subnet"
  }

  depends_on = [
    aws_internet_gateway.edge
  ]
}

resource "aws_subnet" "edge_private" {
  count = length(local.availability_zones)

  vpc_id                  = aws_vpc.edge.id
  availability_zone       = local.availability_zones[count.index]
  cidr_block              = cidrsubnet(local.vpc_cidr_block, 4, count.index + length(local.availability_zones))
  map_public_ip_on_launch = false

  tags = {
    name = "team-${local.availability_zones[count.index]}-private-subnet"
  }
}

resource "aws_route_table" "edge_public" {
  vpc_id = aws_vpc.edge.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.edge.id
  }

  tags = {
    name = "team-${var.region}-public-route-table"
  }
}

resource "aws_route_table_association" "edge_public" {
  count = length(local.availability_zones)

  subnet_id      = aws_subnet.edge_public[count.index].id
  route_table_id = aws_route_table.edge_public.id
}

resource "aws_eip" "edge" {
  count = length(local.availability_zones)

  vpc = true

  depends_on = [aws_internet_gateway.edge]

  tags = {
    name = "team-${local.availability_zones[count.index]}-eip"
  }
}

resource "aws_nat_gateway" "edge_public" {
  count = length(local.availability_zones)

  allocation_id = aws_eip.edge[count.index].id
  subnet_id     = aws_subnet.edge_public[count.index].id

  tags = {
    name = "team-${local.availability_zones[count.index]}-nat-gateway"
  }

  depends_on = [aws_internet_gateway.edge]
}

resource "aws_route_table" "edge_private" {
  count = length(local.availability_zones)

  vpc_id = aws_vpc.edge.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.edge_public[count.index].id
  }

  tags = {
    name = "team-${local.availability_zones[count.index]}-private-route-table"
  }
}

resource "aws_route_table_association" "edge_private" {
  count = length(local.availability_zones)

  subnet_id      = aws_subnet.edge_private[count.index].id
  route_table_id = aws_route_table.edge_private[count.index].id
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.edge.id
  service_name      = "com.amazonaws.${var.storage_bucket.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = aws_route_table.edge_private.*.id

  tags = {
    name = "team-${var.region}-s3-endpoint"
  }
}

resource "aws_elasticache_subnet_group" "edge_cache_subnet" {
  name       = "team-${var.region}-ch-net"
  subnet_ids = aws_subnet.edge_private.*.id
}

resource "aws_elasticache_parameter_group" "edge_cache" {
  name   = "team-${var.region}-param"
  family = "redis6.x"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lfu"
  }
}

resource "aws_elasticache_replication_group" "edge_cache" {
  automatic_failover_enabled    = true
  availability_zones            = local.availability_zones
  replication_group_id          = "edge-${var.region}-cache"
  replication_group_description = "Edge cache"
  node_type                     = var.cache_node_type
  number_cache_clusters         = var.cache_nodes
  parameter_group_name          = aws_elasticache_parameter_group.edge_cache.id
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.edge_cache_subnet.name
}

resource "aws_ecs_cluster" "edge" {
  name = "team-${var.region}-cls"
}

resource "aws_lb" "edge" {
  name                             = "team-${var.region}-lb"
  load_balancer_type               = "network"
  subnets                          = aws_subnet.edge_private.*.id
  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = var.environment == "production" ? true : false
}

resource "aws_lb_target_group" "edge_tcp" {
  name               = "team-${var.region}-tcp-tg"
  port               = local.container_tcp_port
  protocol           = "TCP"
  vpc_id             = aws_vpc.edge.id
  target_type        = "ip"
  preserve_client_ip = false

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTP"
    timeout             = 6
    path                = "/_lf/health-check"
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "edge_tls" {
  name               = "team-${var.region}-tls-tg"
  port               = local.container_tls_port
  protocol           = "TCP"
  vpc_id             = aws_vpc.edge.id
  target_type        = "ip"
  preserve_client_ip = false

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 10
    protocol            = "HTTPS"
    timeout             = 10
    path                = "/_lf/health-check"
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "edge_tcp_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = local.container_tcp_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tcp.arn
  }
}

resource "aws_lb_listener" "edge_tls_forward" {
  load_balancer_arn = aws_lb.edge.arn
  port              = local.container_tls_port
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.edge_tls.arn
  }
}

resource "aws_globalaccelerator_listener" "edge" {
  accelerator_arn = var.globalaccelerator.id
  client_affinity = "NONE"
  protocol        = "TCP"

  port_range {
    from_port = local.container_tcp_port
    to_port   = local.container_tcp_port
  }

  port_range {
    from_port = local.container_tls_port
    to_port   = local.container_tls_port
  }
}

resource "aws_globalaccelerator_endpoint_group" "edge" {
  listener_arn = aws_globalaccelerator_listener.edge.id

  endpoint_configuration {
    endpoint_id = aws_lb.edge.arn
    weight      = 100
  }
}

resource "aws_cloudwatch_log_group" "edge_task" {
  name = "team-${var.region}-logs"
}

resource "aws_ssm_parameter" "edge_container_secret" {
  count = length(var.container_secrets)

  name      = var.container_secrets[count.index].path
  value     = var.container_secrets[count.index].value
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
  name                = "team-${var.region}-ecs-role"
  assume_role_policy  = data.aws_iam_policy_document.ecs_assume_role.json
}

data "aws_iam_policy_document" "edge_ecs_read_ssm_secrets" {
  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameters"]
    resources = ["arn:aws:ssm:*:${var.aws_account_id}:parameter/*"]
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
      "arn:aws:kms:*:${var.aws_account_id}:key/*",
      "arn:aws:secretsmanager:*:${var.aws_account_id}:secret:*"
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
  requires_compatibilities = ["EC2"]
  container_definitions = jsonencode([
    {
      name      = "edge-container"
      image     = "${var.image_repository.repository_url}:deployed"
      essential = true
      cpu       = var.container_cpu
      memory    = var.container_memory

      secrets = [
        for secret in var.container_secrets : {
          "name" : secret.name,
          "valueFrom" : "arn:aws:ssm:${var.region}:${var.aws_account_id}:parameter${secret.path}"
        }
      ]

      environment = toset(values(merge({
        NODE_ENV = {
          name  = "NODE_ENV"
          value = var.environment
        }

        HTTP_PORT = {
          name  = "HTTP_PORT"
          value = local.container_tcp_port
        }

        HTTPS_PORT = {
          name  = "HTTPS_PORT"
          value = local.container_tls_port
        }

        REDIS_CACHE_URL = {
          name  = "REDIS_CACHE_URL"
          value = aws_elasticache_replication_group.edge_cache.primary_endpoint_address
        }

        REGION = {
          name  = "REGION"
          value = var.region
        }
      }, var.container_vars)))

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region = var.region
          awslogs-group  = aws_cloudwatch_log_group.edge_task.name
        }
      }

      portMappings = [
        {
          containerPort = local.container_tcp_port
          protocol      = "tcp"
        },
        {
          containerPort = local.container_tls_port
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

data "aws_ip_ranges" "all" {
  services = ["globalaccelerator", "route53_healthchecks"]
}

resource "aws_security_group" "edge_aws" {
  # AWS enforces a maxiumum amount of rules per security group,
  # this is a hacky workaround.
  count = ceil(length(data.aws_ip_ranges.all.cidr_blocks) / 50)

  name   = "team-${var.region}-aws-${count.index}"
  vpc_id = aws_vpc.edge.id

  ingress = [
    {
      description      = "AWS Services"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = slice(data.aws_ip_ranges.all.cidr_blocks, count.index * 50, min((count.index * 50) + 50, length(data.aws_ip_ranges.all.cidr_blocks)))
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    }
  ]
}

resource "aws_security_group" "edge_ecs" {
  name   = "team-${var.region}-ecs"
  vpc_id = aws_vpc.edge.id

  ingress = [
    {
      description      = "TCP from VPC"
      from_port        = local.container_tcp_port
      to_port          = local.container_tcp_port
      protocol         = "tcp"
      cidr_blocks      = [aws_vpc.edge.cidr_block]
      ipv6_cidr_blocks = null
      prefix_list_ids  = null
      security_groups  = null
      self             = null
    },
    {
      description      = "TLS from VPC"
      from_port        = local.container_tls_port
      to_port          = local.container_tls_port
      protocol         = "tcp"
      cidr_blocks      = [aws_vpc.edge.cidr_block]
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
      protocol         = "-1"
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

resource "aws_ecs_service" "edge" {
  name            = "team-${var.region}-svc"
  cluster         = aws_ecs_cluster.edge.id
  task_definition = aws_ecs_task_definition.edge.arn
  desired_count   = 1
  launch_type     = "EC2"

  ordered_placement_strategy {
    field = "attribute:ecs.availability-zone"
    type  = "spread"
  }

  ordered_placement_strategy {
    field = "instanceId"
    type  = "spread"
  }

  network_configuration {
    subnets         = aws_subnet.edge_private.*.id
    security_groups = local.security_groups
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.edge_tcp.arn
    container_name   = "edge-container"
    container_port   = local.container_tcp_port
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.edge_tls.arn
    container_name   = "edge-container"
    container_port   = local.container_tls_port
  }

  depends_on = [
    aws_lb_listener.edge_tcp_forward,
    aws_lb_listener.edge_tls_forward,
    aws_iam_role.edge_ecs_execution,
  ]
}

data "aws_iam_policy_document" "ecs_agent" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "edge_ec2" {
  name               = "team-${var.region}-ec2"
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json
}

resource "aws_iam_role_policy_attachment" "edge_ec2" {
  role       = aws_iam_role.edge_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "edge_ec2" {
  name = "team-${var.region}-ec2"
  role = aws_iam_role_policy_attachment.edge_ec2.role
}

data "aws_ami" "aws_optimized_ecs" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn-ami*amazon-ecs-optimized"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

resource "aws_launch_configuration" "ecs_launch_config" {
  name_prefix          = "team-${var.region}-elc-"
  image_id             = data.aws_ami.aws_optimized_ecs.id
  iam_instance_profile = aws_iam_instance_profile.edge_ec2.name
  security_groups      = local.security_groups
  user_data            = "#!/bin/bash\necho ECS_CLUSTER=${aws_ecs_cluster.edge.name} >> /etc/ecs/ecs.config"
  instance_type        = var.instance_type

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "edge" {
  name                      = "team-${var.region}-asg"
  vpc_zone_identifier       = aws_subnet.edge_private.*.id
  launch_configuration      = aws_launch_configuration.ecs_launch_config.name
  min_size                  = 1
  max_size                  = var.auto_scale_max
  health_check_grace_period = 300
  health_check_type         = "EC2"

  lifecycle {
    create_before_destroy = true
  }
}

# TODO
#  - autoscale policies
#  - deploying should keep the containers running & drain them

# resource "aws_appautoscaling_target" "edge_ecs" {
#   max_capacity       = var.auto_scale_max
#   min_capacity       = 1
#   resource_id        = "service/${aws_ecs_cluster.edge.name}/${aws_ecs_service.edge.name}"
#   scalable_dimension = "ecs:service:DesiredCount"
#   service_namespace  = "ecs"
# }
#
# resource "aws_appautoscaling_policy" "edge_ecs_memory" {
#   name               = "team-${var.region}-mem"
#   policy_type        = "TargetTrackingScaling"
#   resource_id        = aws_appautoscaling_target.edge_ecs.resource_id
#   scalable_dimension = aws_appautoscaling_target.edge_ecs.scalable_dimension
#   service_namespace  = aws_appautoscaling_target.edge_ecs.service_namespace
#
#   target_tracking_scaling_policy_configuration {
#     predefined_metric_specification {
#       predefined_metric_type = "ECSServiceAverageMemoryUtilization"
#     }
#
#     target_value = 60
#   }
# }
#
# resource "aws_appautoscaling_policy" "edge_ecs_cpu" {
#   name               = "team-${var.region}-cpu"
#   policy_type        = "TargetTrackingScaling"
#   resource_id        = aws_appautoscaling_target.edge_ecs.resource_id
#   scalable_dimension = aws_appautoscaling_target.edge_ecs.scalable_dimension
#   service_namespace  = aws_appautoscaling_target.edge_ecs.service_namespace
#
#   target_tracking_scaling_policy_configuration {
#     predefined_metric_specification {
#       predefined_metric_type = "ECSServiceAverageCPUUtilization"
#     }
#
#     target_value = 60
#   }
# }

# --- from guide VVV https://www.scavasoft.com/terraform-aws-ecs-cluster-provision/
# resource "aws_autoscaling_policy" "ecs_cluster_scale_policy" {
#   name = "${var.cluster_name}_ecs_cluster_spot_scale_policy"
#   policy_type = "TargetTrackingScaling"
#   adjustment_type = "ChangeInCapacity"
#   lifecycle {
#     ignore_changes = [
#       adjustment_type
#     ]
#   }
#   autoscaling_group_name = aws_autoscaling_group.ecs_cluster_spot.name
#
#   target_tracking_configuration {
#     customized_metric_specification {
#       metric_dimension {
#         name = "ClusterName"
#         value = var.cluster_name
#       }
#       metric_name = "MemoryReservation"
#       namespace = "AWS/ECS"
#       statistic = "Average"
#     }
#     target_value = 70.0
#   }
# }
