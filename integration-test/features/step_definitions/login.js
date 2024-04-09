const {clickXPath, typeXPath, click, type} = require("./user_event");


const login = async (page, username, password, org) => {
    await click(page, "login con spid");
    await click(page, "spid test")
    await type(page, "username", username)
    await type(page, "password", password)
    await click(page, "invia")
    await click(page, "invia")
    await typeXPath(page, "selfcare cerca enti", org)
    await clickXPath(page, "selfcare ente selezionato")
    await clickXPath(page, "accedi su selfcare")
    await clickXPath(page, "Panoramica selfcare")
    await page.waitForNetworkIdle();
    await delay(500);
    await click(page, "Piattaforma pagoPA")
    await delay(500);
    await clickXPath(page, "Ambiente Collaudo")
    await delay(2000);
    await clickXPath(page, "Accedi a Backoffice")
    await page.waitForNetworkIdle();
    await delay(1000);
    await clickXPath(page, "Accetta Privacy")
}

module.exports = {login};


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
