const {login} = require("./login");
const {checkXPath, clickXPath, typeXPath, check, click, type, exist} = require("./user_event");
const {Given, After, When, Then, Before} = require('@cucumber/cucumber')
const puppeteer = require('puppeteer');
const {setDefaultTimeout} = require('@cucumber/cucumber');
const assert = require("assert");
const idMapper = require(`./alias.json`);


let page;
let browser;
const defaultTimeout = 30000;
setDefaultTimeout(defaultTimeout);

Before(function () {

});

Given('Logged User {string} {string} and selected org {string}', async (username, password, org) => {
    browser = await puppeteer.launch({headless: false});
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
    await page.goto("https://dev.selfcare.pagopa.it/auth/login");
    // await login(page, username, password, org);
});

When('the client goes to {string}', async function (url) {
    await page.goto(url);
    if (url.includes('localhost')) {
        console.log(url);
        await clickXPath(page, "/html/body/div[2]/div[2]/div/div[1]/div/div[2]/div/button[3]");
        await delay(3000);
        await clickXPath(page, "/html/body/div[1]/div[2]/div[2]/div/div/div/div[3]/button");
    }
});
When('types {string} on {string}', async function (value, elem) {
    await type(page, elem, value);
});
When('clicks on {string}', async function (elem) {
    await click(page, elem);
});

When(/^fills the form$/, async function (dataTable) {
    dataTable.raw();
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

When('types and selects for {string} the value {string}', async function (selector, valueSelector) {
    await click(page, selector);
    await type(page, selector, valueSelector)
    await puppeteer.Locator.race([
        page.locator(selector),
    ])
        .setTimeout(defaultTimeout)
        .fill(value);
    await delay(1000);
    await click(page, valueSelector);
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
    // await browser.close();
});


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

