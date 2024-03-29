const puppeteer = require('puppeteer'); // v13.0.0 or later
const fs = require('fs');
const {
    waitForSelectors, scrollIntoViewIfNeeded, waitForSelector,
    waitForElement, changeSelectElement, changeElementValue,
    typeIntoElement
} = require('./commons.js');

const login = (async () => {
    const browser = await puppeteer.launch({headless: 'new', userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);
    let cookie = [
        {
            name: 'OptanonAlertBoxClosed',
            value: new Date().toUTCString(),
            domain: 'dev.selfcare.pagopa.it',
        },
    ];
    await page.setCookie(...cookie);

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
        await targetPage.goto('https://dev.selfcare.pagopa.it/auth/login');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Entra con SPID) >>>> ::-p-aria([role=\\"paragraph\\"])'),
            targetPage.locator('#root > div > div.MuiGrid-root > div.MuiGrid-grid-xs-6 p'),
            targetPage.locator('::-p-xpath(//*[@id=\\"spidButton\\"]/p)'),
            targetPage.locator(':scope >>> #root > div > div.MuiGrid-root > div.MuiGrid-grid-xs-6 p'),
            targetPage.locator('::-p-text(Entra con SPID)')
        ])
            .setTimeout(timeout)
            .click();
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(test[role=\\"image\\"])'),
            targetPage.locator('div:nth-of-type(13) img'),
            targetPage.locator('::-p-xpath(//*[@id=\\"xx_testenv2\\"]/span[1]/img)'),
            targetPage.locator(':scope >>> div:nth-of-type(13) img')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
            .click({
                offset: {
                    x: 65.5,
                    y: 18,
                },
            });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [['aria/Username'], ['#username'], ['xpath///*[@id="username"]'], ['pierce/#username']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['aria/Username'], ['#username'], ['xpath///*[@id="username"]'], ['pierce/#username']],
            targetPage,
            {timeout, visible: true}
        );
        const inputType = await element.evaluate((el) => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'test');
        } else if (
            ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
                inputType
            )
        ) {
            await typeIntoElement(element, 'test');
        } else {
            await changeElementValue(element, 'test');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [['aria/Password'], ['#password'], ['xpath///*[@id="password"]'], ['pierce/#password']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['aria/Password'], ['#password'], ['xpath///*[@id="password"]'], ['pierce/#password']],
            targetPage,
            {timeout, visible: true}
        );
        const inputType = await element.evaluate((el) => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'test');
        } else if (
            ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
                inputType
            )
        ) {
            await typeIntoElement(element, 'test');
        } else {
            await changeElementValue(element, 'test');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [['section'], ['xpath//html/body/section'], ['pierce/section']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['section'], ['xpath//html/body/section'], ['pierce/section']],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            delay: 650.4000000059605,
            offset: {
                x: 370,
                y: 284,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/Username'],
                ['#username'],
                ['xpath///*[@id="username"]'],
                ['pierce/#username'],
                ['text/test'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Username'],
                ['#username'],
                ['xpath///*[@id="username"]'],
                ['pierce/#username'],
                ['text/test'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        const inputType = await element.evaluate((el) => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'test');
        } else if (
            ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
                inputType
            )
        ) {
            await typeIntoElement(element, 'test');
        } else {
            await changeElementValue(element, 'test');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/[role="main"]', 'aria/[role="article"]'],
                ['article'],
                ['xpath//html/body/section/main/article'],
                ['pierce/article'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/[role="main"]', 'aria/[role="article"]'],
                ['article'],
                ['xpath//html/body/section/main/article'],
                ['pierce/article'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            delay: 496.70000000298023,
            offset: {
                x: 0,
                y: 239.109375,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [['aria/Password'], ['#password'], ['xpath///*[@id="password"]'], ['pierce/#password']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['aria/Password'], ['#password'], ['xpath///*[@id="password"]'], ['pierce/#password']],
            targetPage,
            {timeout, visible: true}
        );
        const inputType = await element.evaluate((el) => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'test');
        } else if (
            ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
                inputType
            )
        ) {
            await typeIntoElement(element, 'test');
        } else {
            await changeElementValue(element, 'test');
        }
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await scrollIntoViewIfNeeded(
            [
                ['aria/Invia'],
                ['button.u-btn-primary'],
                ['xpath//html/body/section/main/article/form/div[3]/button[1]'],
                ['pierce/button.u-btn-primary'],
                ['text/Invia'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Invia'],
                ['button.u-btn-primary'],
                ['xpath//html/body/section/main/article/form/div[3]/button[1]'],
                ['pierce/button.u-btn-primary'],
                ['text/Invia'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 217,
                y: 19.7109375,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await scrollIntoViewIfNeeded(
            [
                ['aria/Invia'],
                ['button.u-btn-primary'],
                ['xpath//html/body/section/main/article/form/div/button[1]'],
                ['pierce/button.u-btn-primary'],
                ['text/Invia'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Invia'],
                ['button.u-btn-primary'],
                ['xpath//html/body/section/main/article/form/div/button[1]'],
                ['pierce/button.u-btn-primary'],
                ['text/Invia'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 366,
                y: 27.921875,
            },
        });
        await Promise.all(promises);
        await page.waitForNavigation();
    }
    {
        const targetPage = page;
        // await targetPage.goto('https://dev.selfcare.pagopa.it/dashboard');
        await scrollIntoViewIfNeeded(
            [['aria/Cerca ente'], ['#search'], ['xpath///*[@id="search"]'], ['pierce/#search']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['aria/Cerca ente'], ['#search'], ['xpath///*[@id="search"]'], ['pierce/#search']],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 144.078125,
                y: 30.7734375,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [['aria/Cerca ente'], ['#search'], ['xpath///*[@id="search"]'], ['pierce/#search']],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [['aria/Cerca ente'], ['#search'], ['xpath///*[@id="search"]'], ['pierce/#search']],
            targetPage,
            {timeout, visible: true}
        );
        const inputType = await element.evaluate((el) => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'EC Signed Direct');
        } else if (
            ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
                inputType
            )
        ) {
            await typeIntoElement(element, 'EC Signed Direct');
        } else {
            await changeElementValue(element, 'EC Signed Direct');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/EC Signed Direct'],
                ['h6'],
                ['xpath///*[@data-testid="PartyItemContainer: EC Signed Direct"]/div/div/div[2]/h6'],
                ['pierce/h6'],
                ['text/EC Signed Direct'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/EC Signed Direct'],
                ['h6'],
                ['xpath///*[@data-testid="PartyItemContainer: EC Signed Direct"]/div/div/div[2]/h6'],
                ['pierce/h6'],
                ['text/EC Signed Direct'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 94.5,
                y: 15.3828125,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/Accedi'],
                ['div.css-1h6e12d button'],
                ['xpath///*[@id="root"]/div/div[2]/div[2]/div/div[3]/div/button'],
                ['pierce/div.css-1h6e12d button'],
                ['text/Accedi'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Accedi'],
                ['div.css-1h6e12d button'],
                ['xpath///*[@id="root"]/div/div[2]/div[2]/div/div[3]/div/button'],
                ['pierce/div.css-1h6e12d button'],
                ['text/Accedi'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 43.5625,
                y: 28.3359375,
            },
        });
    }
    {
        const targetPage = page;

        await waitForElement(
            {
                type: 'waitForElement',
                target: 'main',
                selectors: [
                    'div.css-1jp97fw > div:nth-of-type(2) > div:nth-of-type(1) p',
                    'xpath///*[@id="prod-pagopa"]/div[1]/div/div/div[2]/div/p',
                    'pierce/div.css-1jp97fw > div:nth-of-type(2) > div:nth-of-type(1) p',
                    'text/Piattaforma pagoPA',
                ],
                count: 1,
                visible: true,
            },
            targetPage,
            timeout
        );
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['div.css-1jp97fw path'],
                ['xpath///*[@data-testid="ArrowForwardIcon"]/path'],
                ['pierce/div.css-1jp97fw path'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['div.css-1jp97fw path'],
                ['xpath///*[@data-testid="ArrowForwardIcon"]/path'],
                ['pierce/div.css-1jp97fw path'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        /* await element.click({
                offset: {
                    x: 11.8515625,
                    y: 5.4296875,
                },
            }); */

        const elementBtn = await page.waitForSelector('#prod-pagopa button');
        await elementBtn.click();
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await scrollIntoViewIfNeeded(
            [
                ['aria/Produzione'],
                ['div.css-1tstxez > button'],
                ['xpath//html/body/div[3]/div[3]/div/div/div[2]/div[2]/div[2]/button'],
                ['pierce/div.css-1tstxez > button'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Produzione'],
                ['div.css-1tstxez > button'],
                ['xpath//html/body/div[3]/div[3]/div/div/div[2]/div[2]/div[2]/button'],
                ['pierce/div.css-1tstxez > button'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 69.9453125,
                y: 27.5,
            },
        });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/Accedi'],
                ['div.MuiGrid-root button'],
                ['xpath///*[@id="root"]/div[2]/div[2]/div/div/div/div[3]/button'],
                ['pierce/div.MuiGrid-root button'],
                ['text/Accedi'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Accedi'],
                ['div.MuiGrid-root button'],
                ['xpath///*[@id="root"]/div[2]/div[2]/div/div/div/div[3]/button'],
                ['pierce/div.MuiGrid-root button'],
                ['text/Accedi'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 49.5625,
                y: 29.203125,
            },
        });
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
        await scrollIntoViewIfNeeded(
            [
                ['div.css-1abzdwk span'],
                ['xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[1]/div[2]/span'],
                ['pierce/div.css-1abzdwk span'],
                ['text/Sviluppo'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['div.css-1abzdwk span'],
                ['xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[1]/div[2]/span'],
                ['pierce/div.css-1abzdwk span'],
                ['text/Sviluppo'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 36.78125,
                y: 15.09375,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded(
            [
                ['aria/Accedi'],
                ['div.MuiGrid-root button'],
                ['xpath///*[@id="root"]/div[2]/div[2]/div/div/div/div[3]/button'],
                ['pierce/div.MuiGrid-root button'],
                ['text/Accedi'],
            ],
            targetPage,
            timeout
        );
        const element = await waitForSelectors(
            [
                ['aria/Accedi'],
                ['div.MuiGrid-root button'],
                ['xpath///*[@id="root"]/div[2]/div[2]/div/div/div/div[3]/button'],
                ['pierce/div.MuiGrid-root button'],
                ['text/Accedi'],
            ],
            targetPage,
            {timeout, visible: true}
        );
        await element.click({
            offset: {
                x: 59.5625,
                y: 21.203125,
            },
        });
    }

    await browser.close();

    console.log("logged");

})().catch((err) => {
    console.error(err);
    process.exit(1);
});

module.exports = login;
