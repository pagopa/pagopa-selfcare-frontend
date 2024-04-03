Feature: Api Key

  Background:
    Given Logged User "test" "test" and selected org "Comune di Frosinone"


  Scenario: Api Key for GPD Exists
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
    And clicks on "Menu API Key"
    Then text "GPD - Posizioni Debitorie" exists in the page
