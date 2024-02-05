const puppeteer = require('puppeteer'); // v20.7.4 or later

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 10, userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1804,
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
                "[data-testid='stations-test'] span",
                'xpath///*[@data-testid="stations-test"]/div[2]/span',
                "pierce/[data-testid='stations-test'] span",
                'text/Stazioni'
            ],
            visible: true
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='stations-test'] span"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"stations-test\\"]/div[2]/span)'),
            targetPage.locator(":scope >>> [data-testid='stations-test'] span"),
            targetPage.locator('::-p-text(Stazioni)')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 35.578125,
                    y: 23.9453125,
                },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                [
                    'aria/99999000004_02',
                    'aria/[role="paragraph"]'
                ],
                'div.MuiDataGrid-row--lastVisible p',
                'xpath///*[@id="StationsSearchTableBox"]/div/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div/div/div/p',
                'pierce/div.MuiDataGrid-row--lastVisible p',
                'text/99999000004_02'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("div.MuiDataGrid-row--lastVisible [data-testid='MoreVertIcon']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"MoreVertIcon\\"])'),
            targetPage.locator(":scope >>> div.MuiDataGrid-row--lastVisible [data-testid='MoreVertIcon']")
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 8.9296875,
                    y: 11.4296875,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Gestisci EC[role=\\"menuitem\\"])'),
            targetPage.locator('a:nth-of-type(2) > li'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mui-18\\"]/a[2]/li)'),
            targetPage.locator(':scope >>> a:nth-of-type(2) > li'),
            targetPage.locator('::-p-text(Gestisci EC)')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 84.7890625,
                    y: 20.5,
                },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'aria/Associa EC',
                'div.css-1age63q > a',
                'xpath///*[@id="StationsSearchTableBox"]/div[1]/a',
                'pierce/div.css-1age63q > a'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Associa EC)'),
            targetPage.locator('div.css-1age63q > a'),
            targetPage.locator('::-p-xpath(//*[@id=\\"StationsSearchTableBox\\"]/div[1]/a)'),
            targetPage.locator(':scope >>> div.css-1age63q > a')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 67.09375,
                    y: 31,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Cerca EC)'),
            targetPage.locator("[data-testid='ec-selection-search']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"ec-selection-search\\"])'),
            targetPage.locator(":scope >>> [data-testid='ec-selection-search']")
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 147.078125,
                    y: 21.7109375,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Cerca EC)'),
            targetPage.locator("[data-testid='ec-selection-search']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"ec-selection-search\\"])'),
            targetPage.locator(":scope >>> [data-testid='ec-selection-search']")
        ])
            .setTimeout(timeout)
            .fill('ec signed direct');
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='PartyItemContainer\\:\\ EC\\ Signed\\ Direct'] > div > div"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"PartyItemContainer: EC Signed Direct\\"]/div/div)'),
            targetPage.locator(":scope >>> [data-testid='PartyItemContainer\\:\\ EC\\ Signed\\ Direct'] > div > div")
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 231,
                    y: 34.203125,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('body'),
            targetPage.locator('::-p-xpath(/html/body)'),
            targetPage.locator(':scope >>> body')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 663,
                    y: 511,
                },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.MuiGrid-root h6',
                'xpath///*[@data-testid="grid-item"]/div/div[1]/div/div/div[2]/h6',
                'pierce/div.MuiGrid-root h6'
            ],
            visible: true
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                [
                    'aria/removeSelectionIcon',
                    'aria/[role="graphics-symbol"]'
                ],
                'div.css-70qvj9 path',
                'xpath///*[@data-testid="ClearOutlinedIcon"]/path',
                'pierce/div.css-70qvj9 path'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(3)'),
            targetPage.locator('#menu-auxDigit li'),
            targetPage.locator('::-p-xpath(//*[@id=\\"menu-auxDigit\\"]/div[3]/ul/li)'),
            targetPage.locator(':scope >>> #menu-auxDigit li')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 92,
                    y: 19,
                },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'aria/*',
                '#segregationCode',
                'xpath///*[@id="segregationCode"]',
                'pierce/#segregationCode'
            ],
            visible: true
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(*)'),
            targetPage.locator('#segregationCode'),
            targetPage.locator('::-p-xpath(//*[@id=\\"segregationCode\\"])'),
            targetPage.locator(':scope >>> #segregationCode')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 200.5,
                    y: 22.203125,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(00)'),
            targetPage.locator('#menu-segregationCode li:nth-of-type(1)'),
            targetPage.locator('::-p-xpath(//*[@id=\\"menu-segregationCode\\"]/div[3]/ul/li[1])'),
            targetPage.locator(':scope >>> #menu-segregationCode li:nth-of-type(1)')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 133,
                    y: 22,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Conferma)'),
            targetPage.locator("[data-testid='confirm-btn-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"confirm-btn-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='confirm-btn-test']")
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 85.84375,
                    y: 25.3984375,
                },
            });
    }
    {
        await delay(2000);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiDataGrid-main > div:nth-of-type(2) path'),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"RemoveCircleIcon\\"]/path)'),
            targetPage.locator(':scope >>> div.MuiDataGrid-main > div:nth-of-type(2) path')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 9.03125,
                    y: 12,
                },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Dissocia EC)'),
            targetPage.locator('div.css-1cv3pxx > button'),
            targetPage.locator('::-p-xpath(/html/body/div[3]/div[3]/div/div/div[2]/div[2]/div/div[2]/button)'),
            targetPage.locator(':scope >>> div.css-1cv3pxx > button')
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 50.421875,
                    y: 25.5,
                },
            });
    }

    await browser.close();
    console.log("associate station");

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

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
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
