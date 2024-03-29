Feature: Pacchetti Globali [PSP]

  Background:
    Given Logged User "test" "test" and selected org "PSP Demo"


  Scenario: Create Bundle
#    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
    When the client goes to "http://localhost:3000/ui"
    And clicks on "Pacchetti Commissione Menu"
    And clicks on "Crea Pacchetto"
    Then "Conferma Pacchetto" is disabled
    And clicks on "Globale"
    And fills the form
      | nome pacchetto     | descrizione pacchetto | importo minimo | importo massimo | fee |
      | pacchetto int test | test integrazione     | 1              | 100             | 1   |
    And types and selects for "codice intermediario" the value "PSP Admin Signed Direct"
    And types and selects for "codice canale" the value "11111111_01"
    And types "13/01/2025" on "data inizio validità"
    And types "14/01/2025" on "data fine validità"
    And clicks on "Conferma Pacchetto"
    And clicks on "Conferma Tassonomie"

