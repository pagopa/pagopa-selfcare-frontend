Feature: Api Key

  Background:
    Given Logged User and selected org "Comune di Frosinone"


  Scenario: Api Key for GPD Exists
#    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
    When the client goes to "http://localhost:3000/ui#logged=forced"
    And clicks on "Menu API Key"
    Then text "GPD - Posizioni Debitorie" exists in the page
