Feature: IBAN

  Background:
    Given Logged User "test" "test" and selected org "EC Signed Direct"


  Scenario: Iban Add
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
    And adds the iban

  Scenario: Iban Delete
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
    And deletes the iban
