const puppeteer = require('puppeteer');
const {waitForElement, delay} = require("./commons");
const {switchTo} = require("./switch_to"); // v20.7.4 or later

(async () => {
    const browser = await puppeteer.launch({headless: 'new', userDataDir: './user-data', slowMo: 10});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1920,
            height: 1080,
        });
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://selfcare.dev.platform.pagopa.it/ui');
        await Promise.all(promises);
    }

    await switchTo(page, timeout, "EC Signed Direct");
    await createOperationTableTest(page, timeout);

    await browser.close();
    console.log('Operation table created/updated');
})().catch((err) => {
    console.error(err);
    process.exit(1);
});

const createOperationTableTest = async (page, timeout) => {
    let i = 0;
    console.log(`createOperationTableTest ${i++}`);
    const targetPage = page;
    {
        await targetPage.waitForNetworkIdle();
        await delay(5000);
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiGrid-root div:nth-of-type(3) button'),
            targetPage.locator('::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[2]/div/div[2]/div/div[2]/div[3]/div/div[2]/div[5]/button)'),
            targetPage.locator(':scope >>> div.MuiGrid-root div:nth-of-type(3) button')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 50.5,
                    y: 20.203125,
                },
            });
    }
    console.log(`createOperationTableTest ${i++}`);
    {
        await targetPage.waitForNetworkIdle();
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(E-mail)'),
            targetPage.locator("[data-testid='email-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"email-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='email-test']")
        ])
            .setTimeout(timeout)
            .click({
                count: 3,
                offset: {
                    x: 94,
                    y: 18.578125,
                },
            });
    }
    console.log(`createOperationTableTest ${i++}`);
    {
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(E-mail)'),
            targetPage.locator("[data-testid='email-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"email-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='email-test']")
        ])
            .setTimeout(timeout)
            .fill('mail@test.com');
    }
    console.log(`createOperationTableTest ${i++}`);
    {
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Telefono)'),
            targetPage.locator("[data-testid='phone-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"phone-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='phone-test']")
        ])
            .setTimeout(timeout)
            .click({
                count: 3,
                offset: {
                    x: 33.015625,
                    y: 21.578125,
                },
            });
    }
    console.log(`createOperationTableTest ${i++}`);
    {
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Telefono)'),
            targetPage.locator("[data-testid='phone-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"phone-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='phone-test']"),
            targetPage.locator('::-p-text(1234324234)')
        ])
            .setTimeout(timeout)
            .fill('1234567');
    }
    console.log(`createOperationTableTest ${i++}`);
    await puppeteer.Locator.race([
        targetPage.locator('::-p-aria(Conferma)'),
        targetPage.locator("[data-testid='submit-button-test']"),
        targetPage.locator('::-p-xpath(//*[@data-testid=\\"submit-button-test\\"])'),
        targetPage.locator(":scope >>> [data-testid='submit-button-test']"),
    ])
        .setTimeout(timeout)
        .click({
            offset: {
                x: 56.484375,
                y: 18.703125,
            },
        });
    console.log(`createOperationTableTest ${i++}`);
};
