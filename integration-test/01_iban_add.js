const puppeteer = require('puppeteer'); // v13.0.0 or later
const {
    waitForSelectors, scrollIntoViewIfNeeded, waitForSelector,
    changeSelectElement, changeElementValue, typeIntoElement
} = require('./commons.js');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        userDataDir: './user-data',
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
        const element = await waitForSelector('[id="StationsSearchTableBox"] button.MuiButton-root', targetPage, {
            timeout,
            visible: true
        });
        await element.click();
    }
    {
        const targetPage = page;
        await targetPage.waitForNetworkIdle({idleTime: 3000});
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Codice IBAN'
            ],
            [
                '#iban'
            ],
            [
                'xpath///*[@id="iban"]'
            ],
            [
                'pierce/#iban'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Codice IBAN'
            ],
            [
                '#iban'
            ],
            [
                'xpath///*[@id="iban"]'
            ],
            [
                'pierce/#iban'
            ]
        ], targetPage, {timeout, visible: true});
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'IT60X0542811101000000123457')
        } else if ([
            'textarea',
            'text',
            'url',
            'tel',
            'search',
            'password',
            'number',
            'email'
        ].includes(inputType)) {
            await typeIntoElement(element, 'IT60X0542811101000000123457');
        } else {
            await changeElementValue(element, 'IT60X0542811101000000123457');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Descrizione'
            ],
            [
                '#description'
            ],
            [
                'xpath///*[@id="description"]'
            ],
            [
                'pierce/#description'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Descrizione'
            ],
            [
                '#description'
            ],
            [
                'xpath///*[@id="description"]'
            ],
            [
                'pierce/#description'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 202.34375,
                y: 14.822906494140625,
            },
        });
    }

    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Descrizione'
            ],
            [
                '#description'
            ],
            [
                'xpath///*[@id="description"]'
            ],
            [
                'pierce/#description'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Descrizione'
            ],
            [
                '#description'
            ],
            [
                'xpath///*[@id="description"]'
            ],
            [
                'pierce/#description'
            ]
        ], targetPage, {timeout, visible: true});
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'Created by Puppeteer')
        } else if ([
            'textarea',
            'text',
            'url',
            'tel',
            'search',
            'password',
            'number',
            'email'
        ].includes(inputType)) {
            await typeIntoElement(element, 'Created by Puppeteer');
        } else {
            await changeElementValue(element, 'Created by Puppeteer');
        }
    }

    /* datePicking startDate - START */

    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Data inizio'
            ],
            [
                "[data-testid='start-date-test']"
            ],
            [
                'xpath///*[@data-testid="start-date-test"]'
            ],
            [
                "pierce/[data-testid='start-date-test']"
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Data inizio'
            ],
            [
                "[data-testid='start-date-test']"
            ],
            [
                'xpath///*[@data-testid="start-date-test"]'
            ],
            [
                "pierce/[data-testid='start-date-test']"
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 8.5,
                y: 18.875,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Data inizio'
            ],
            [
                "[data-testid='start-date-test']"
            ],
            [
                'xpath///*[@data-testid="start-date-test"]'
            ],
            [
                "pierce/[data-testid='start-date-test']"
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Data inizio'
            ],
            [
                "[data-testid='start-date-test']"
            ],
            [
                'xpath///*[@data-testid="start-date-test"]'
            ],
            [
                "pierce/[data-testid='start-date-test']"
            ]
        ], targetPage, {timeout, visible: true});
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, '10/10/2030')
        } else if ([
            'textarea',
            'text',
            'url',
            'tel',
            'search',
            'password',
            'number',
            'email'
        ].includes(inputType)) {
            await typeIntoElement(element, '10/10/2030');
        } else {
            await changeElementValue(element, '10/10/2030');
        }
    }


    /* datePicking startDate - END */

    /* datePicking endDate - START */
    {
        const targetPage = page;
        await targetPage.keyboard.down('Tab');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('Tab');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down('Tab');
    }
    {
        const targetPage = page;
        await targetPage.keyboard.up('Tab');
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Data fine'
            ],
            [
                "[data-testid='end-date-test']"
            ],
            [
                'xpath///*[@data-testid="end-date-test"]'
            ],
            [
                "pierce/[data-testid='end-date-test']"
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Data fine'
            ],
            [
                "[data-testid='end-date-test']"
            ],
            [
                'xpath///*[@data-testid="end-date-test"]'
            ],
            [
                "pierce/[data-testid='end-date-test']"
            ]
        ], targetPage, {timeout, visible: true});
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, '11/10/2030')
        } else if ([
            'textarea',
            'text',
            'url',
            'tel',
            'search',
            'password',
            'number',
            'email'
        ].includes(inputType)) {
            await typeIntoElement(element, '11/10/2030');
        } else {
            await changeElementValue(element, '11/10/2030');
        }
    }

    /* datePicking endDate - END */

    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Conferma'
            ],
            [
                'div.css-iu3ey5 > button'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div/div[5]/div[2]/button'
            ],
            [
                'pierce/div.css-iu3ey5 > button'
            ],
            [
                'text/Conferma'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Conferma'
            ],
            [
                'div.css-iu3ey5 > button'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div/div[5]/div[2]/button'
            ],
            [
                'pierce/div.css-iu3ey5 > button'
            ],
            [
                'text/Conferma'
            ]
        ], targetPage, {timeout, visible: true});
        await element.click({
            offset: {
                x: 44.875,
                y: 21.583328247070312,
            },
        });
    }

    {
        const targetPage = page;
        await targetPage.waitForNetworkIdle();
        await scrollIntoViewIfNeeded([
            [
                'div[data-id="IT60X0542811101000000123457"]'
            ],
            [
                'text/IT60X0542811101000000123457'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'div[data-id="IT60X0542811101000000123457"]'
            ],
            [
                'text/IT60X0542811101000000123457'
            ]
        ], targetPage, {timeout, visible: true});
    }


    await browser.close();
    console.log("iban added");

})().catch(err => {
    console.error(err);
    process.exit(1);
});
