variable "environment" {
  type = string
}

resource "aws_ecr_repository" "image_repository" {
  name = "edge/${var.environment}"
}

output "image_repository" {
  value = aws_ecr_repository.image_repository
}
