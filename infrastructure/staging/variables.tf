variable "AWS_ACCOUNT_ID" {
  sensitive = true
  type      = string
}

variable "AWS_ACCESS_KEY_ID" {
  sensitive = true
  type      = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  sensitive = true
  type      = string
}

variable "DNSIMPLE_API_TOKEN" {
  sensitive = true
  type      = string
}

variable "DNSIMPLE_ACCOUNT_ID" {
  sensitive = true
  type      = string
}

variable "EMAIL_API_KEY" {
  sensitive = true
  type      = string
}

variable "EMAIL_DOMAIN" {
  type = string
}

variable "ENVIRONMENT" {
  type = string
}

variable "PRODUCT_DOMAIN" {
  type = string
}

variable "SSL_AT_REST_KEY" {
  sensitive = true
  type      = string
}
