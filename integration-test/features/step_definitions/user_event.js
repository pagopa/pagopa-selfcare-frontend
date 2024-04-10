const assert = require("assert");
const defaultTimeout = 30000;

const idMapper = require('./alias.json');
const {delay} = require("../../commons");

async function typeXPath(page, selector, value) {
    selector = idMapper[selector] ?? selector;

    // wait for element defined by XPath appear in page
    await page.waitForXPath(selector, {timeout: defaultTimeout});
    // evaluate XPath expression of the target selector (it return array of ElementHandle)
    let elements = await page.$x(selector);

    await elements[0].type(value);
}

async function checkXPath(page, selector, expectedValue) {
    selector = idMapper[selector] ?? selector;

    // wait for element defined by XPath appear in page
    await page.waitForXPath(selector, {timeout: defaultTimeout});
    // evaluate XPath expression of the target selector (it return array of ElementHandle)
    let elements = await page.$x(selector);

    const currentVal = await page.evaluate(e => e.innerText, elements[0]);
    assert.strictEqual(expectedValue, currentVal);
}

async function clickXPath(page, selector) {
    selector = idMapper[selector] ?? selector;
    console.log(`searching for ${selector}`);

    // wait for element defined by XPath appear in page
    await page.waitForXPath(selector, {timeout: defaultTimeout});
    // evaluate XPath expression of the target selector (it return array of ElementHandle)
    let elements = await page.$x(selector);

    const selectorSpinner = 'span[role="loadingSpinner"]';

    await page.waitForFunction((selectorSpinner) => {
            let isLoading = false;
            const node = document.querySelectorAll(selectorSpinner);
            if (node.length !== 0) {
                isLoading = true;
            }
            return !isLoading;
        },
        {}, // empty options object
        selectorSpinner
    );
    await elements[0].click()
}


async function type(page, selector, value) {
    selector = idMapper[selector] ?? selector;

    await page.waitForSelector(selector, {timeout: defaultTimeout});
    let element = await page.$(selector);

    await element.type(value);
}

async function check(page, selector, expectedValue) {
    selector = idMapper[selector] ?? selector;

    await page.waitForSelector(selector, {timeout: defaultTimeout});
    let element = await page.$(selector);

    const currentVal = await page.evaluate(e => e.innerText, element);
    assert.strictEqual(expectedValue, currentVal);
}

async function exist(page, selector) {
    selector = idMapper[selector] ?? selector;

    await page.waitForSelector(selector, {timeout: defaultTimeout});
    const element = await page.$(selector);

    assert.notEqual(element, null);
}

async function click(page, selector) {
    selector = idMapper[selector] ?? selector;
    selector += ':not([disabled])'

    console.log(`searching for ${selector}`);

    await page.waitForSelector(selector, {timeout: defaultTimeout});
    let element = await page.$(selector);

    const selectorSpinner = 'span[role="loadingSpinner"]';
    await page.waitForFunction((selectorSpinner) => {
            let isLoading = false;
            const node = document.querySelectorAll(selectorSpinner);
            console.log(node);
            console.log(node.length !== 0);
            if (node.length !== 0) {
                isLoading = true;
            }
            return !isLoading;
        },
        {}, // empty options object
        selectorSpinner
    );
    await element.click()
}


module.exports = {type, click, check, exist, typeXPath, clickXPath, checkXPath};
