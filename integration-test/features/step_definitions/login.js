const {clickXPath, typeXPath} = require("./user_event");


const login = async (page, username, password, org) => {
    await clickXPath(page, "login con spid");
    await clickXPath(page, "spid test")
    await typeXPath(page, "username", username)
    await typeXPath(page, "password", password)
    await clickXPath(page, "invia")
    await clickXPath(page, "invia2")
    await typeXPath(page, "selfcare cerca enti", org)
    await clickXPath(page, "selfcare ente selezionato")
    await clickXPath(page, "accedi su selfcare")
    await clickXPath(page, "Panoramica selfcare")
    await clickXPath(page, "Piattaforma pagoPA")
    await clickXPath(page, "Ambiente Collaudo")
    await clickXPath(page, "Accedi a Backoffice")
    await page.waitForNetworkIdle();
    await clickXPath(page, "Accetta Privacy")
}

module.exports = {login};
