variable "config" {}

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

resource "mongodbatlas_project" "api" {
  name   = "leftfield-api-${var.config.variables.ENVIRONMENT}"
  org_id = var.config.variables.MONGO_ATLAS_ORGANIZATION_ID
}

resource "mongodbatlas_cluster" "api" {
  name = "leftfield-api"
  project_id = mongodbatlas_project.api.id
  cluster_type = "REPLICASET"
  cloud_backup = var.config.variables.ENVIRONMENT == "production"
  auto_scaling_disk_gb_enabled = var.config.variables.ENVIRONMENT == "production"
  mongo_db_major_version = "4.4"
  provider_name = "AWS"
  disk_size_gb = var.config.environment.api.mongo_disk_size
  provider_instance_size_name = var.config.environment.api.mongo_instance_size

  replication_specs {
    num_shards = var.config.environment.api.mongo_shards

    regions_config {
      region_name = upper(replace(var.config.environment.primary_region, "-", "_"))
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
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

resource "aws_vpc_peering_connection_accepter" "peer" {
  vpc_peering_connection_id = mongodbatlas_network_peering.api.connection_id
  auto_accept = true
}

output "cluster" {
  value = mongodbatlas_cluster.api
}
