resource "github_repository_environment" "github_repository_environment" {
  environment = var.env
  repository  = local.github.repository
  # filter teams reviewers from github_organization_teams
  # if reviewers_teams is null no reviewers will be configured for environment
  dynamic "reviewers" {
    for_each = (var.github_repository_environment.reviewers_teams == null || var.env_short != "p" ? [] : [1])
    content {
      teams = matchkeys(
        data.github_organization_teams.all.teams.*.id,
        data.github_organization_teams.all.teams.*.name,
        var.github_repository_environment.reviewers_teams
      )
    }
  }
  deployment_branch_policy {
    protected_branches     = var.github_repository_environment.protected_branches
    custom_branch_policies = var.github_repository_environment.custom_branch_policies
  }
}

locals {
  env_secrets = {
    "CLIENT_ID" : module.github_runner_app.application_id,
    "TENANT_ID" : data.azurerm_client_config.current.tenant_id,
    "SUBSCRIPTION_ID" : data.azurerm_subscription.current.subscription_id,

    "REACT_APP_MIXPANEL_TOKEN" : data.azurerm_key_vault_secret.key_vault_mixpanel_token.value
    "REACT_APP_ONETRUST_DOMAIN_ID" : data.azurerm_key_vault_secret.key_vault_onetrust_domain.value
    "BLOB_CONNECTION_STRING" : data.azurerm_key_vault_secret.key_vault_blob_connection_string.value
  }
  env_variables = {
    "CONTAINER_APP_ENVIRONMENT_NAME" : local.container_app_environment.name,
    "CONTAINER_APP_ENVIRONMENT_RESOURCE_GROUP_NAME" : local.container_app_environment.resource_group,
    "STORAGE_ACCOUNT" : "pagopa${var.env_short}selfcaresa",
    "CDN_RESOURCE_GROUP" : "pagopa-${var.env_short}-fe-rg",
    "CDN_ENDPOINT" : "pagopa-${var.env_short}-selfcare-cdn-endpoint",
    "CDN_PROFILE" : "pagopa-${var.env_short}-selfcare-cdn-profile",
    "SELFCARE_HOST_FE" : var.env == "prod" || var.env == "uat" ? "https://selfcare.pagopa.it" : "https://${var.env}.selfcare.pagopa.it",
    "SELFCARE_API_BE" : var.env == "prod" ? "https://api.platform.pagopa.it" : "https://api.${var.env}.platform.pagopa.it",
    "REACT_APP_URL_STORAGE" : "https://pagopa${var.env_short}selfcaresa.z6.web.core.windows.net",
  }
}

###############
# ENV Secrets #
###############

resource "github_actions_environment_secret" "github_environment_runner_secrets" {
  for_each        = local.env_secrets
  repository      = local.github.repository
  environment     = var.env
  secret_name     = each.key
  plaintext_value = each.value
}

#################
# ENV Variables #
#################


resource "github_actions_environment_variable" "github_environment_runner_variables" {
  for_each      = local.env_variables
  repository    = local.github.repository
  environment   = var.env
  variable_name = each.key
  value         = each.value
}

#############################
# Secrets of the Repository #
#############################

#tfsec:ignore:github-actions-no-plain-text-action-secrets # not real secret
resource "github_actions_secret" "secret_sonar_token" {
  repository      = local.github.repository
  secret_name     = "SONAR_TOKEN"
  plaintext_value = data.azurerm_key_vault_secret.key_vault_sonar.value
}

#tfsec:ignore:github-actions-no-plain-text-action-secrets # not real secret
resource "github_actions_secret" "secret_bot_token" {
  repository      = local.github.repository
  secret_name     = "BOT_TOKEN_GITHUB"
  plaintext_value = data.azurerm_key_vault_secret.key_vault_bot_token.value
}

#tfsec:ignore:github-actions-no-plain-text-action-secrets # not real secret
resource "github_actions_secret" "secret_cucumber_token" {
  repository      = local.github.repository
  secret_name     = "CUCUMBER_PUBLISH_TOKEN"
  plaintext_value = data.azurerm_key_vault_secret.key_vault_cucumber_token.value
}

#tfsec:ignore:github-actions-no-plain-text-action-secrets # not real secret
resource "github_actions_secret" "secret_key_pem" {
  repository      = local.github.repository
  secret_name     = "KEY_PEM"
  plaintext_value =  var.env == "dev" ? data.azurerm_key_vault_secret.key_vault_key_pem[0].value : ""
}
