const puppeteer = require('puppeteer'); // v13.0.0 or later
const {
    waitForSelectors, scrollIntoViewIfNeeded, waitForSelector
} = require('./commons.js');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        userDataDir: './user-data',
        // slowMo: 50,
        // dumpio: true,
        // devtools: true
    });
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);


    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1263,
            height: 907
        })
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://selfcare.dev.platform.pagopa.it/ui');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/IBAN'
            ],
            [
                'div.MuiGrid-grid-xs-2 div:nth-of-type(4)'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[1]/div/div/div/ul/div[4]'
            ],
            [
                'pierce/div.MuiGrid-grid-xs-2 div:nth-of-type(4)'
            ]
        ], targetPage, timeout);
        await targetPage.waitForNetworkIdle();
        const element = await waitForSelectors([
            [
                'aria/IBAN'
            ],
            [
                'div.MuiGrid-grid-xs-2 div:nth-of-type(4)'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[1]/div/div/div/ul/div[4]'
            ],
            [
                'pierce/div.MuiGrid-grid-xs-2 div:nth-of-type(4)'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 54,
                y: 35.385406494140625,
            },
        });
    }
    {
        const targetPage = page;
        await targetPage.waitForNetworkIdle();
    }


    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'button[data-testid="open-IT60X0542811101000000123457"]'
            ]

        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'button[data-testid="open-IT60X0542811101000000123457"]'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 10.953125,
                y: 13.8125,
            },
        });
    }
    {
        const targetPage = page;
        await targetPage.waitForNetworkIdle();
    }
    {
        const targetPage = page;
        await page.evaluate(() => {
            window.scroll(0, 0);
        });
        await scrollIntoViewIfNeeded([
            [
                'aria/Elimina'
            ],
            [
                "[data-testid='delete-button-test']"
            ],
            [
                'xpath///*[@data-testid="delete-button-test"]'
            ],
            [
                "pierce/[data-testid='delete-button-test']"
            ],
            [
                'text/Elimina'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Elimina'
            ],
            [
                "[data-testid='delete-button-test']"
            ],
            [
                'xpath///*[@data-testid="delete-button-test"]'
            ],
            [
                "pierce/[data-testid='delete-button-test']"
            ],
            [
                'text/Elimina'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 49.4375,
                y: 24,
            },
        });
        {
            const targetPage = page;
            await targetPage.waitForNetworkIdle();
        }
        {
            const targetPage = page;
            await puppeteer.Locator.race([
                targetPage.locator('::-p-aria(Elimina IBAN[role=\\"button\\"])'),
                targetPage.locator("[data-testid='confirm-button-test']"),
                targetPage.locator('::-p-xpath(//*[@data-testid=\\"confirm-button-test\\"])'),
                targetPage.locator(":scope >>> [data-testid='confirm-button-test']")
            ])
                .setTimeout(timeout)
                .click({
                    offset: {
                        x: 65,
                        y: 34.703125,
                    },
                });
        }

    }
    {
        const targetPage = page;
        await targetPage.waitForNetworkIdle();
    }

    await browser.close();
    console.log("iban deleted");

})().catch(err => {
    console.error(err);
    process.exit(1);
});
