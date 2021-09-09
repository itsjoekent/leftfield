variable "config" {}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"

      configuration_aliases = [
        aws.primary,
        aws.us_east_1,
        aws.us_west_1,
      ]
    }

    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }

    dnsimple = {
      source  = "dnsimple/dnsimple"
      version = "~> 0.9"
    }
  }
}

module "edge" {
  source = "../edge"
  config = var.config

  providers = {
    aws.primary   = aws.primary
    aws.us_east_1 = aws.us_east_1
    aws.us_west_1 = aws.us_west_1

    dnsimple = dnsimple
  }
}

module "api" {
  source = "../api"
  config = var.config

  providers = {
    digitalocean = digitalocean
    dnsimple     = dnsimple
  }
}
