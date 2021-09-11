variable "config" {}

# aws_route_table
variable "private_route_table" {}

# aws_vpc
variable "vpc" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.0.1"
    }
  }
}

locals {
  region = upper(replace(var.config.environment.primary_region, "-", "_"))
}

resource "mongodbatlas_project" "api" {
  name   = "leftfield-api-${var.config.variables.ENVIRONMENT}"
  org_id = var.config.variables.MONGO_ATLAS_ORGANIZATION_ID
}

resource "mongodbatlas_cluster" "api" {
  name                         = "leftfield-api"
  project_id                   = mongodbatlas_project.api.id
  cluster_type                 = "REPLICASET"
  cloud_backup                 = var.config.variables.ENVIRONMENT == "production"
  auto_scaling_disk_gb_enabled = var.config.variables.ENVIRONMENT == "production"
  mongo_db_major_version       = "4.4"
  provider_name                = "AWS"
  disk_size_gb                 = var.config.environment.api.mongo_disk_size
  provider_instance_size_name  = var.config.environment.api.mongo_instance_size

  replication_specs {
    num_shards = var.config.environment.api.mongo_shards

    regions_config {
      region_name     = local.region
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }
}

resource "random_password" "mongo" {
  length  = 16
  special = false
}

resource "mongodbatlas_database_user" "api" {
  username           = "leftfield"
  password           = random_password.mongo
  project_id         = mongodbatlas_project.api.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }

  scopes {
    name = mongodbatlas_cluster.api.name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_network_peering" "api" {
  accepter_region_name   = var.config.environment.primary_region
  project_id             = mongodbatlas_project.api.id
  container_id           = mongodbatlas_cluster.api.container_id
  provider_name          = "AWS"
  route_table_cidr_block = var.vpc.cidr_block
  vpc_id                 = var.vpc.id
  aws_account_id         = var.config.variables.AWS_ACCOUNT_ID
}

resource "mongodbatlas_project_ip_whitelist" "api" {
  project_id = mongodbatlas_project.api.id
  cidr_block = var.vpc.cidr_block
  comment    = "CIDR block for AWS API VPC"
}

resource "aws_vpc_peering_connection_accepter" "peer" {
  vpc_peering_connection_id = mongodbatlas_network_peering.api.connection_id
  auto_accept = true
}

data "mongodbatlas_network_container" "api" {
  project_id   = mongodbatlas_project.api.id
  container_id = mongodbatlas_cluster.container_id
}

data "aws_vpc_peering_connection" "atlas" {
  vpc_id           = data.mongodbatlas_network_container.vpc_id
  cidr_block       = data.mongodbatlas_network_container.api.atlas_cidr_block
  peer_region      = local.region
}

resource "aws_route" "aws_peer_to_atlas" {
  route_table_id            = var.private_route_table.id
  destination_cidr_block    = data.mongodbatlas_network_container.api.atlas_cidr_block
  vpc_peering_connection_id = data.aws_vpc_peering_connection.atlas.id
}

output "cluster" {
  value = mongodbatlas_cluster.api
}

output "user" {
  value = mongodbatlas_database_user.api
}
