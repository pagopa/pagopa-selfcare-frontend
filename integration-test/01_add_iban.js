const puppeteer = require('puppeteer'); // v13.0.0 or later

(async () => {
    const browser = await puppeteer.launch({headless: "new", userDataDir: './user-data'});
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
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 54,
                y: 35.385406494140625,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Aggiungi IBAN'
            ],
            [
                '#StationsSearchTableBox > div > div:nth-of-type(1) > div > div > button'
            ],
            [
                'xpath///*[@id="StationsSearchTableBox"]/div/div[1]/div/div/button'
            ],
            [
                'pierce/#StationsSearchTableBox > div > div:nth-of-type(1) > div > div > button'
            ],
            [
                'text/Aggiungi IBAN'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Aggiungi IBAN'
            ],
            [
                '#StationsSearchTableBox > div > div:nth-of-type(1) > div > div > button'
            ],
            [
                'xpath///*[@id="StationsSearchTableBox"]/div/div[1]/div/div/button'
            ],
            [
                'pierce/#StationsSearchTableBox > div > div:nth-of-type(1) > div > div > button'
            ],
            [
                'text/Aggiungi IBAN'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 1176,
                y: 394.6666717529297,
            },
        });
        await element.click({
            clickCount: 2,
            offset: {
                x: 1176,
                y: 394.6666717529297,
            },
        });
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
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 276.78125,
                y: 16.822906494140625,
            },
        });
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
        ], targetPage, { timeout, visible: true });
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'IT60X0542811101000000123456')
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
            await typeIntoElement(element, 'IT60X0542811101000000123456');
        } else {
            await changeElementValue(element, 'IT60X0542811101000000123456');
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
        ], targetPage, { timeout, visible: true });
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
        ], targetPage, { timeout, visible: true });
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'Servizio di tesoreria comunale')
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
            await typeIntoElement(element, 'Servizio di tesoreria comunale');
        } else {
            await changeElementValue(element, 'Servizio di tesoreria comunale');
        }
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Data inizio'
            ],
            [
                '#validityDate'
            ],
            [
                'xpath///*[@id="validityDate"]'
            ],
            [
                'pierce/#validityDate'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Data inizio'
            ],
            [
                '#validityDate'
            ],
            [
                'xpath///*[@id="validityDate"]'
            ],
            [
                'pierce/#validityDate'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 101.78125,
                y: 17.1875,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                "div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) [data-testid='CalendarIcon']"
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]'
            ],
            [
                "pierce/div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) [data-testid='CalendarIcon']"
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                "div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) [data-testid='CalendarIcon']"
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]'
            ],
            [
                "pierce/div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) [data-testid='CalendarIcon']"
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 10.98956298828125,
                y: 9.46875,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/11'
            ],
            [
                'button.MuiPickersDay-today'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[3]/button[3]'
            ],
            [
                'pierce/button.MuiPickersDay-today'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/11'
            ],
            [
                'button.MuiPickersDay-today'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[3]/button[3]'
            ],
            [
                'pierce/button.MuiPickersDay-today'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 25.666656494140625,
                y: 13,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Choose date, selected date is Jul 11, 2023',
                'aria/[role="graphics-symbol"]'
            ],
            [
                'div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) path'
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]/path'
            ],
            [
                'pierce/div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) path'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Choose date, selected date is Jul 11, 2023',
                'aria/[role="graphics-symbol"]'
            ],
            [
                'div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) path'
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]/path'
            ],
            [
                'pierce/div.MuiPaper-root > div > div:nth-of-type(2) > div.MuiGrid-root > div:nth-of-type(1) path'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 7.561187744140625,
                y: 21.325958251953125,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/15'
            ],
            [
                'div:nth-of-type(3) > button:nth-of-type(7)'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[3]/button[7]'
            ],
            [
                'pierce/div:nth-of-type(3) > button:nth-of-type(7)'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/15'
            ],
            [
                'div:nth-of-type(3) > button:nth-of-type(7)'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[3]/button[7]'
            ],
            [
                'pierce/div:nth-of-type(3) > button:nth-of-type(7)'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 22.666656494140625,
                y: 14,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Choose date',
                'aria/[role="graphics-symbol"]'
            ],
            [
                'div.MuiGrid-root > div:nth-of-type(2) path'
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]/path'
            ],
            [
                'pierce/div.MuiGrid-root > div:nth-of-type(2) path'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Choose date',
                'aria/[role="graphics-symbol"]'
            ],
            [
                'div.MuiGrid-root > div:nth-of-type(2) path'
            ],
            [
                'xpath///*[@data-testid="CalendarIcon"]/path'
            ],
            [
                'pierce/div.MuiGrid-root > div:nth-of-type(2) path'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 10.3424072265625,
                y: 7.6592864990234375,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                '#mui-21-grid-label'
            ],
            [
                'xpath///*[@id="mui-21-grid-label"]'
            ],
            [
                'pierce/#mui-21-grid-label'
            ],
            [
                'text/July 2023'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                '#mui-21-grid-label'
            ],
            [
                'xpath///*[@id="mui-21-grid-label"]'
            ],
            [
                'pierce/#mui-21-grid-label'
            ],
            [
                'text/July 2023'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 54,
                y: 20.833328247070312,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/2025'
            ],
            [
                'div:nth-of-type(126) > button'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[126]/button'
            ],
            [
                'pierce/div:nth-of-type(126) > button'
            ],
            [
                'text/2025'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/2025'
            ],
            [
                'div:nth-of-type(126) > button'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[126]/button'
            ],
            [
                'pierce/div:nth-of-type(126) > button'
            ],
            [
                'text/2025'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 27.25,
                y: 24,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/4'
            ],
            [
                'div:nth-of-type(1) > button:nth-of-type(4)'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[1]/button[4]'
            ],
            [
                'pierce/div:nth-of-type(1) > button:nth-of-type(4)'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/4'
            ],
            [
                'div:nth-of-type(1) > button:nth-of-type(4)'
            ],
            [
                'xpath//html/body/div[2]/div[2]/div/div/div/div[2]/div/div/div[2]/div/div[1]/button[4]'
            ],
            [
                'pierce/div:nth-of-type(1) > button:nth-of-type(4)'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 11,
                y: 16,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Altro soggetto'
            ],
            [
                'div.MuiPaper-root label.css-pd0fjv input'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div/div[4]/div/div[3]/div[2]/div[1]/div/div/label[2]/span[1]/input'
            ],
            [
                'pierce/div.MuiPaper-root label.css-pd0fjv input'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Altro soggetto'
            ],
            [
                'div.MuiPaper-root label.css-pd0fjv input'
            ],
            [
                'xpath///*[@id="root"]/div[2]/div[2]/div/div/div[4]/div/div[3]/div[2]/div[1]/div/div/label[2]/span[1]/input'
            ],
            [
                'pierce/div.MuiPaper-root label.css-pd0fjv input'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 36.510406494140625,
                y: 17.552078247070312,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Codice Fiscale Intestatario'
            ],
            [
                '#creditorInstitutionCode'
            ],
            [
                'xpath///*[@id="creditorInstitutionCode"]'
            ],
            [
                'pierce/#creditorInstitutionCode'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Codice Fiscale Intestatario'
            ],
            [
                '#creditorInstitutionCode'
            ],
            [
                'xpath///*[@id="creditorInstitutionCode"]'
            ],
            [
                'pierce/#creditorInstitutionCode'
            ]
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 180.78125,
                y: 27.125,
            },
        });
    }
    {
        const targetPage = page;
        await scrollIntoViewIfNeeded([
            [
                'aria/Codice Fiscale Intestatario'
            ],
            [
                '#creditorInstitutionCode'
            ],
            [
                'xpath///*[@id="creditorInstitutionCode"]'
            ],
            [
                'pierce/#creditorInstitutionCode'
            ]
        ], targetPage, timeout);
        const element = await waitForSelectors([
            [
                'aria/Codice Fiscale Intestatario'
            ],
            [
                '#creditorInstitutionCode'
            ],
            [
                'xpath///*[@id="creditorInstitutionCode"]'
            ],
            [
                'pierce/#creditorInstitutionCode'
            ]
        ], targetPage, { timeout, visible: true });
        const inputType = await element.evaluate(el => el.type);
        if (inputType === 'select-one') {
            await changeSelectElement(element, 'CRLBDT94H48F839K')
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
            await typeIntoElement(element, 'CRLBDT94H48F839K');
        } else {
            await changeElementValue(element, 'CRLBDT94H48F839K');
        }
    }
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
        ], targetPage, { timeout, visible: true });
        await element.click({
            offset: {
                x: 44.875,
                y: 21.583328247070312,
            },
        });
    }

    await browser.close();

    async function waitForSelectors(selectors, frame, options) {
        for (const selector of selectors) {
            try {
                return await waitForSelector(selector, frame, options);
            } catch (err) {
                console.error(err);
            }
        }
        throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(selectors, frame, timeout) {
        const element = await waitForSelectors(selectors, frame, { visible: false, timeout });
        if (!element) {
            throw new Error(
                'The element could not be found.'
            );
        }
        await waitForConnected(element, timeout);
        const isInViewport = await element.isIntersectingViewport({threshold: 0});
        if (isInViewport) {
            return;
        }
        await element.evaluate(element => {
            element.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'auto',
            });
        });
        await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
        await waitForFunction(async () => {
            return await element.getProperty('isConnected');
        }, timeout);
    }

    async function waitForInViewport(element, timeout) {
        await waitForFunction(async () => {
            return await element.isIntersectingViewport({threshold: 0});
        }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        if (!selector.length) {
            throw new Error('Empty selector provided to waitForSelector');
        }
        let element = null;
        for (let i = 0; i < selector.length; i++) {
            const part = selector[i];
            if (element) {
                element = await element.waitForSelector(part, options);
            } else {
                element = await frame.waitForSelector(part, options);
            }
            if (!element) {
                throw new Error('Could not find element: ' + selector.join('>>'));
            }
            if (i < selector.length - 1) {
                element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            }
        }
        if (!element) {
            throw new Error('Could not find element: ' + selector.join('|'));
        }
        return element;
    }

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

    async function changeSelectElement(element, value) {
        await element.select(value);
        await element.evaluateHandle((e) => {
            e.blur();
            e.focus();
        });
    }

    async function changeElementValue(element, value) {
        await element.focus();
        await element.evaluate((input, value) => {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
    }

    async function typeIntoElement(element, value) {
        const textToType = await element.evaluate((input, newValue) => {
            if (
                newValue.length <= input.value.length ||
                !newValue.startsWith(input.value)
            ) {
                input.value = '';
                return newValue;
            }
            const originalValue = input.value;
            input.value = '';
            input.value = originalValue;
            return newValue.substring(originalValue.length);
        }, value);
        await element.type(textToType);
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});
