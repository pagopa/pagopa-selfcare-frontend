Feature: Pacchetti Globali [PSP]

  Background:
    Given Logged User "test" "test" and selected org "PSP Signed Direct"


  Scenario: Create Bundle
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
#    When the client goes to "http://localhost:3000/ui"
    And clicks on "Pacchetti Commissione Menu"
    And clicks on "Crea Pacchetto"
    Then "Conferma Pacchetto" is disabled
    And clicks on "Globale"
    And fills the form
      | nome pacchetto     | descrizione pacchetto | importo minimo | importo massimo | fee |
      | pacchetto int test | test integrazione     | 1              | 100             | 1   |
    And types "PSP Signed Direct" in "codice intermediario" and selects the value "PSP Signed Direct"
    And types "99999000001_01" in "codice canale" and selects the value "99999000001_01"
    And types "13/01/2025" on "data inizio validità"
    And types "14/01/2025" on "data fine validità"
    And clicks on "Conferma Pacchetto"
    And clicks on "Sfoglia Catalogo"
    And types "0601134AP" in "filtro tassonomie" and selects the value "9/0601134AP/"
    And clicks on "Aggiungi"
    And clicks on "Conferma Pacchetto"
    And clicks on "Conferma"


  Scenario: Delete Bundle
    When the client goes to "https://selfcare.dev.platform.pagopa.it/ui"
#    When the client goes to "http://localhost:3000/ui"
    And clicks on "Pacchetti Commissione Menu"
    And clicks on "Gestisci Pacchetto"
    And clicks on "Elimina"
