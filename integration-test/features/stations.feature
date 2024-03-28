Feature: Stazioni

  Background:
    Given Logged User "test" "test" and selected org "Comune di Frosinone"


  Scenario: Create Station
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
#    When the client goes to "http://localhost:3000/ui"
    And clicks on "Menu Stazioni"
    And clicks on "Crea Stazione"
    And fills the form
      | endpoint-rt    | redirect       | modello unico  |
      | http://test.it | http://test.it | http://test.it |
    And selects for "versione primitive" the value "primitiva 1"
    And waits 1000 ms
    And clicks on "Conferma Stazione"
    And clicks on "Conferma Popup"

