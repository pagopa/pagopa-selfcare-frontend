const puppeteer = require('puppeteer'); // v20.7.4 or later

(async () => {
    const browser = await puppeteer.launch({headless: false, userDataDir: './user-data'});
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

    async function waitForElement(step, frame, timeout) {
        const {
            count = 1,
            operator = '>=',
            visible = true,
            properties,
            attributes,
        } = step;
        const compFn = {
            '==': (a, b) => a === b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
        }[operator];
        await waitForFunction(async () => {
            const elements = await querySelectorsAll(step.selectors, frame);
            let result = compFn(elements.length, count);
            const elementsHandle = await frame.evaluateHandle((...elements) => {
                return elements;
            }, ...elements);
            await Promise.all(elements.map((element) => element.dispose()));
            if (result && (properties || attributes)) {
                result = await elementsHandle.evaluate(
                    (elements, properties, attributes) => {
                        for (const element of elements) {
                            if (attributes) {
                                for (const [name, value] of Object.entries(attributes)) {
                                    if (element.getAttribute(name) !== value) {
                                        return false;
                                    }
                                }
                            }
                            if (properties) {
                                if (!isDeepMatch(properties, element)) {
                                    return false;
                                }
                            }
                        }
                        return true;

                        function isDeepMatch(a, b) {
                            if (a === b) {
                                return true;
                            }
                            if ((a && !b) || (!a && b)) {
                                return false;
                            }
                            if (!(a instanceof Object) || !(b instanceof Object)) {
                                return false;
                            }
                            for (const [key, value] of Object.entries(a)) {
                                if (!isDeepMatch(value, b[key])) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    properties,
                    attributes
                );
            }
            await elementsHandle.dispose();
            return result === visible;
        }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
        for (const selector of selectors) {
            const result = await querySelectorAll(selector, frame);
            if (result.length) {
                return result;
            }
        }
        return [];
    }

    async function querySelectorAll(selector, frame) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        if (!selector.length) {
            throw new Error('Empty selector provided to querySelectorAll');
        }
        let elements = [];
        for (let i = 0; i < selector.length; i++) {
            const part = selector[i];
            if (i === 0) {
                elements = await frame.$$(part);
            } else {
                const tmpElements = elements;
                elements = [];
                for (const el of tmpElements) {
                    elements.push(...(await el.$$(part)));
                }
            }
            if (elements.length === 0) {
                return [];
            }
            if (i < selector.length - 1) {
                const tmpElements = [];
                for (const el of elements) {
                    const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
                    if (newEl) {
                        tmpElements.push(newEl);
                    }
                }
                elements = tmpElements;
            }
        }
        return elements;
    }

    async function waitForFunction(fn, timeout) {
        let isActive = true;
        const timeoutId = setTimeout(() => {
            isActive = false;
        }, timeout);
        while (isActive) {
            const result = await fn();
            if (result) {
                clearTimeout(timeoutId);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw new Error('Timed out');
    }
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
