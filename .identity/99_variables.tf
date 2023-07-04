locals {
  github = {
    org        = "pagopa"
    repository = "pagopa-selfcare-frontend"
  }

  prefix          = "pagopa"
  domain          = "selfcare"
  location_short  = "weu"
  product         = "${var.prefix}-${var.env_short}"
}

variable "env" {
  type = string
}

variable "env_short" {
  type = string
}

variable "prefix" {
  type    = string
  default = "pagopa"
  validation {
    condition = (
    length(var.prefix) <= 6
    )
    error_message = "Max length is 6 chars."
  }
}

variable "github_repository_environment" {
  type = object({
    protected_branches     = bool
    custom_branch_policies = bool
    reviewers_teams        = list(string)
  })
  description = "GitHub Continuous Integration roles"
  default = {
    protected_branches     = false
    custom_branch_policies = true
    reviewers_teams        = ["pagopa-team-backoffice"]
  }
}
