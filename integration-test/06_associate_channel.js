const puppeteer = require('puppeteer'); // v20.7.4 or later

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 100, userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 30000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 1102,
            height: 868
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
                'div.css-1ye32zt div > div > div > div.MuiBox-root span',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/span',
                'pierce/div.css-1ye32zt div > div > div > div.MuiBox-root span',
                'text/Responsabile'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                "[data-testid='channels-test'] span",
                'xpath///*[@data-testid="channels-test"]/div[2]/span',
                "pierce/[data-testid='channels-test'] span",
                'text/Canali'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='channels-test'] span"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"channels-test\\"]/div[2]/span)'),
            targetPage.locator(":scope >>> [data-testid='channels-test'] span"),
            targetPage.locator('::-p-text(Canali)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 38.578125,
                y: 16.9453125,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("div.MuiDataGrid-main > div:nth-of-type(2) > div > div > div > div:nth-of-type(1) [data-testid='MoreVertIcon']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"MoreVertIcon\\"])'),
            targetPage.locator(":scope >>> div.MuiDataGrid-main > div:nth-of-type(2) > div > div > div > div:nth-of-type(1) [data-testid='MoreVertIcon']")
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 3.765625,
                y: 10.6640625,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('a:nth-of-type(2) > li'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mui-42\\"]/a[2]/li)'),
            targetPage.locator(':scope >>> a:nth-of-type(2) > li'),
            targetPage.locator('::-p-aria(Gestisci PSP[role=\\"menuitem\\"])'),
            targetPage.locator('::-p-text(Gestisci PSP)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 81.1875,
                y: 9,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiGrid-root strong'),
            targetPage.locator('::-p-xpath(//*[@id=\\"ChannelsSearchTableBox\\"]/div/div/p/a/strong)'),
            targetPage.locator(':scope >>> div.MuiGrid-root strong'),
            targetPage.locator('::-p-aria( Associa PSP) >>>> ::-p-aria([role=\\"strong\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 45.8984375,
                y: 8,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='psp-selection-search']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"psp-selection-search\\"])'),
            targetPage.locator(":scope >>> [data-testid='psp-selection-search']"),
            targetPage.locator('::-p-aria(Cerca PSP)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 294.578125,
                y: 27.7734375,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='psp-selection-search']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"psp-selection-search\\"])'),
            targetPage.locator(":scope >>> [data-testid='psp-selection-search']"),
            targetPage.locator('::-p-aria(Cerca PSP)')
        ])
            .setTimeout(timeout)
            .fill('psp');
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.MuiGrid-root h6',
                'xpath///*[@data-testid="PartyItemContainer: PSP DEMO DIRECT"]/div/div/div[2]/h6',
                'pierce/div.MuiGrid-root h6',
                [
                    'aria/PSP DEMO DIRECT[role="button"]',
                    'aria/[role="heading"]'
                ]
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiGrid-root h6'),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"PartyItemContainer: PSP DEMO DIRECT\\"]/div/div/div[2]/h6)'),
            targetPage.locator(':scope >>> div.MuiGrid-root h6'),
            targetPage.locator('::-p-aria(PSP DEMO DIRECT[role=\\"button\\"]) >>>> ::-p-aria([role=\\"heading\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 12,
                y: 18.5859375,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-testid='confirm-btn-test']"),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"confirm-btn-test\\"])'),
            targetPage.locator(":scope >>> [data-testid='confirm-btn-test']"),
            targetPage.locator('::-p-aria(Conferma)'),
            targetPage.locator('::-p-text(Conferma)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 76.34375,
                y: 39.3359375,
              },
            });
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.MuiDataGrid-main > div:nth-of-type(2) div:nth-of-type(3) > div',
                'xpath///*[@id="ChannelsSearchTableBox"]/div/div[2]/div[2]/div/div/div/div/div[3]/div',
                'pierce/div.MuiDataGrid-main > div:nth-of-type(2) div:nth-of-type(3) > div'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiDataGrid-main > div:nth-of-type(2) path'),
            targetPage.locator('::-p-xpath(//*[@data-testid=\\"RemoveCircleIcon\\"]/path)'),
            targetPage.locator(':scope >>> div.MuiDataGrid-main > div:nth-of-type(2) path'),
            targetPage.locator('::-p-aria([role=\\"grid\\"]) >>>> ::-p-aria([role=\\"graphics-symbol\\"])')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 11.96875,
                y: 4.6015625,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.css-1cv3pxx > button'),
            targetPage.locator('::-p-xpath(/html/body/div[2]/div[3]/div/div/div[2]/div[2]/div/div[2]/button)'),
            targetPage.locator(':scope >>> div.css-1cv3pxx > button'),
            targetPage.locator('::-p-aria(Dissocia PSP)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 86.0703125,
                y: 28.5,
              },
            });
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
