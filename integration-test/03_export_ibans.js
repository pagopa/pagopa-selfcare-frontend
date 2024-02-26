const puppeteer = require('puppeteer'); // v20.7.4 or later
const {waitForElement} = require('./commons.js');

(async () => {
    const browser = await puppeteer.launch({headless: 'new', userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1904,
            height: 934
        })
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        startWaitingForEvents();
        await targetPage.goto('https://selfcare.dev.platform.pagopa.it/ui');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'aria/EC Signed Direct',
                'div.css-1ye32zt h6',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6',
                'pierce/div.css-1ye32zt h6'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'aria/EC Signed Direct',
                'div.css-1ye32zt h6',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6',
                'pierce/div.css-1ye32zt h6'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'aria/Sezione download',
                'div.MuiGrid-root div:nth-of-type(2) > h6',
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/h6',
                'pierce/div.MuiGrid-root div:nth-of-type(2) > h6',
                'text/Sezione download'
            ],
            visible: true
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Scarica lista IBAN)'),
            targetPage.locator("[data-testid='export-iban-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"export-iban-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='export-iban-test']"),
            targetPage.locator('::-p-text(Scarica lista)')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 86,
                    y: 14.640625,
                },
            });
    }
    {
        const targetPage = page;
        await waitUntilDownload(targetPage)
    }

    await browser.close();
    console.log("export ibans");

})().catch(err => {
    console.error(err);
    process.exit(1);
});

async function waitUntilDownload(page) {
    return new Promise((resolve, reject) => {
        page._client().on('Page.downloadProgress', e => { // or 'Browser.downloadProgress'
            if (e.state === 'completed') {
                resolve('file');
            } else if (e.state === 'canceled') {
                reject();
                console.error(e);
                process.exit(1);
            }
        });
    });
}
