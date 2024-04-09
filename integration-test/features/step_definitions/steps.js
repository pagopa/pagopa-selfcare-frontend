const {login} = require("./login");
const {checkXPath, clickXPath, typeXPath, check, click, type, exist} = require("./user_event");
const {Given, After, When, Then, Before} = require('@cucumber/cucumber')
const puppeteer = require('puppeteer');
const {setDefaultTimeout} = require('@cucumber/cucumber');
const assert = require("assert");
const idMapper = require(`./alias.json`);
const {
    scrollIntoViewIfNeeded,
    waitForSelectors,
    waitForSelector,
    changeSelectElement,
    typeIntoElement,
    changeElementValue
} = require("../../commons");
const {create_jwt} = require("./create_jwt");


let page;
let browser;
let jwt = '';
const defaultTimeout = 30000;
setDefaultTimeout(defaultTimeout);

Before(function () {

});

Given('Logged User and selected org {string}', async (org) => {
    browser = await puppeteer.launch({headless: 'new'});
    // browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    page.setDefaultTimeout(defaultTimeout);
    let cookie = [
        {
            name: 'OptanonAlertBoxClosed',
            value: new Date().toUTCString(),
            domain: 'dev.selfcare.pagopa.it',
        },
    ];
    await page.setCookie(...cookie);
    await page.setViewport({
        width: 1800,
        height: 900,
    });
    org = idMapper[org] ?? org;

    jwt = await create_jwt(org);
});

When('the client goes to {string}', async function (url) {
    await page.goto(url+'#logged=forced');
    await page.evaluate((jwt) => {
        let user = {
            "uid": "5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8",
            "name": "Anselmo",
            "surname": "Sartori",
            "email": "furiovitale@martino.it"
        };
        let tos = {"id": "5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8", "timestamp": "2024-02-20T14:28:10.041Z"};
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('acceptTOS', JSON.stringify(tos));
        window.localStorage.setItem('token', jwt);
    }, jwt);
    await delay(1000);
    await page.goto(url, {'waitUntil':'load'});
});

When('types {string} on {string}', async function (value, selector) {
    // await type(page, elem, value);
    selector = idMapper[selector] ?? selector;
    await puppeteer.Locator.race([
        page.locator(selector),
    ])
        .setTimeout(defaultTimeout)
        .click({count: 2});
    await puppeteer.Locator.race([
        page.locator(selector),
    ])
        .setTimeout(defaultTimeout)
        .fill(value);
});
When('clicks on {string}', async function (elem) {
    await click(page, elem);
});

When(/^fills the form$/, async function (dataTable) {
    for (const key of dataTable.raw()[0]) {
        console.log(`typing on ${key} the value`)
        await type(page, key, dataTable.hashes()[0][key]);
    }
});
When('selects for {string} the value {string}', async function (selector, valueSelector) {
    await click(page, selector);
    await click(page, valueSelector);
    await delay(500);
});

When('types {string} in {string} and selects the value {string}', async function (text, selector, valueSelector) {
    await click(page, selector);
    await type(page, selector, text)
    await delay(1000);

    valueSelector = idMapper[valueSelector] ?? selector;
    console.log(`searching for ${valueSelector}`);
    await puppeteer.Locator.race([
        page.locator(valueSelector),
    ])
        .setTimeout(defaultTimeout)
        .click();
    await delay(1000);
});

Then('element {string} has {string} as value', async function (elem, expectedValue) {
    await check(page, elem, expectedValue);
});
Then('element {string} exists', async function (elem) {
    await exist(page, elem);
});
Then('text {string} exists in the page', async function (text) {
    await page.waitForXPath(`//*[contains(text(), "${text}")]`);
});
Then('{string} is disabled', async function (selector) {
    selector = idMapper[selector] ?? selector;
    selector += '[disabled]';

    await page.waitForSelector(selector, {timeout: defaultTimeout});
    const element = await page.$(selector);

    assert.notEqual(element, null);
});


After(async function () {
    await browser.close();
});


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


/* EXTRA STEPS */

When(/^adds the iban$/, async function () {
    const timeout = defaultTimeout;
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
            await changeSelectElement(element, 'IT12R0300203280489943937131')
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
            await typeIntoElement(element, 'IT12R0300203280489943937131');
        } else {
            await changeElementValue(element, 'IT12R0300203280489943937131');
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
                'div[data-id="IT12R0300203280489943937131"]'
            ],
            [
                'text/IT12R0300203280489943937131'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'div[data-id="IT12R0300203280489943937131"]'
            ],
            [
                'text/IT12R0300203280489943937131'
            ]
        ], targetPage, {timeout, visible: true});
    }


});
When(/^deletes the iban$/, async function () {
    const timeout = defaultTimeout;

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
                'button[data-testid="open-IT12R0300203280489943937131"]'
            ]

        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'button[data-testid="open-IT12R0300203280489943937131"]'
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

});


module.exports = {delay}
