const puppeteer = require('puppeteer'); // v13.0.0 or later
const {
    waitForSelectors, scrollIntoViewIfNeeded, waitForSelector
} = require('./commons.js');


(async () => {
    const browser = await puppeteer.launch({headless: "new", userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1684,
            height: 448
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
                'div.MuiGrid-root div:nth-of-type(3) span'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[1]/div/div/div/ul/div[3]/div[2]/span'
            ],
            [
                'pierce/div.MuiGrid-root div:nth-of-type(3) span'
            ],
            [
                'text/Stazioni'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'div.MuiGrid-root div:nth-of-type(3) span'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[1]/div/div/div/ul/div[3]/div[2]/span'
            ],
            [
                'pierce/div.MuiGrid-root div:nth-of-type(3) span'
            ],
            [
                'text/Stazioni'
            ]
        ], targetPage, {timeout, visible: true});


        await page.waitForSelector('.MuiBackdrop-root', {hidden: true});

        await element.click({
            offset: {
                x: 17.583332061767578,
                y: 20.291656494140625,
            },
        });
    }

    {
        const targetPage = page;
        await page.waitForNetworkIdle();

        await scrollIntoViewIfNeeded([
            [
                'aria/Crea stazione'
            ],
            [
                'div.MuiGrid-root a'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[2]/div[2]/a'
            ],
            [
                'pierce/div.MuiGrid-root a'
            ],
            [
                'text/Crea stazione'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Crea stazione'
            ],
            [
                'div.MuiGrid-root a'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div[2]/div[2]/a'
            ],
            [
                'pierce/div.MuiGrid-root a'
            ],
            [
                'text/Crea stazione'
            ]
        ], targetPage, {timeout, visible: true});

        await element.click({
            offset: {
                x: 70.5555419921875,
                y: 9.333343505859375,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Conferma'
            ],
            [
                "[data-testid='confirm-button-test']"
            ],
            [
                'xpath///*[@data-testid="confirm-button-test"]'
            ],
            [
                "pierce/[data-testid='confirm-button-test']"
            ],
            [
                'text/Conferma'
            ]
        ], targetPage, timeout);
        await page.waitForSelector('.MuiBackdrop-root', {hidden: true});
        const element = await waitForSelectors([
            [
                'aria/Conferma'
            ],
            [
                "[data-testid='confirm-button-test']"
            ],
            [
                'xpath///*[@data-testid="confirm-button-test"]'
            ],
            [
                "pierce/[data-testid='confirm-button-test']"
            ],
            [
                'text/Conferma'
            ]
        ], targetPage, {timeout, visible: true});
        await page.waitForSelector('.MuiBackdrop-root', {hidden: true});
        await element.click({
            offset: {
                x: 54.9583740234375,
                y: 25.986114501953125,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Invia'
            ],
            [
                "div.MuiModal-root [data-testid='confirm-button-test']"
            ],
            [
                'xpath///*[@data-testid="confirm-button-test"]'
            ],
            [
                "pierce/div.MuiModal-root [data-testid='confirm-button-test']"
            ],
            [
                'text/Invia'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Invia'
            ],
            [
                "div.MuiModal-root [data-testid='confirm-button-test']"
            ],
            [
                'xpath///*[@data-testid="confirm-button-test"]'
            ],
            [
                "pierce/div.MuiModal-root [data-testid='confirm-button-test']"
            ],
            [
                'text/Invia'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 30.4583740234375,
                y: 23.201385498046875,
            },
        });
    }
    await page.waitForNetworkIdle();
    await browser.close();
    console.log("create station");

})().catch(err => {
    console.error(err);
    process.exit(1);
});
