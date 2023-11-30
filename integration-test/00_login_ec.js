const puppeteer = require('puppeteer'); // v13.0.0 or later
const fs = require('fs');

const login = (async () => {
  const browser = await puppeteer.launch({ headless: 'new', userDataDir: './user-data' });
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
    await scrollIntoViewIfNeeded(
      [
        ['aria/Entra con SPID'],
        ['#spidButton'],
        ['xpath///*[@id="spidButton"]'],
        ['pierce/#spidButton'],
        ['text/Entra con SPID'],
      ],
      targetPage,
      timeout
    );
    const element = await waitForSelectors(
      [
        ['aria/Entra con SPID'],
        ['#spidButton'],
        ['xpath///*[@id="spidButton"]'],
        ['pierce/#spidButton'],
        ['text/Entra con SPID'],
      ],
      targetPage,
      { timeout, visible: true }
    );
    await element.click({
      offset: {
        x: 194,
        y: 29.203125,
      },
    });
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    await scrollIntoViewIfNeeded(
      [
        ['aria/test[role="img"]'],
        ['div:nth-of-type(12) img'],
        ['xpath///*[@id="xx_testenv2"]/span[1]/img'],
        ['pierce/div:nth-of-type(12) img'],
      ],
      targetPage,
      timeout
    );
    const element = await waitForSelectors(
      [
        ['aria/test[role="img"]'],
        ['div:nth-of-type(12) img'],
        ['xpath///*[@id="xx_testenv2"]/span[1]/img'],
        ['pierce/div:nth-of-type(12) img'],
      ],
      targetPage,
      { timeout, visible: true }
    );
    await element.click({
      offset: {
        x: 47.5,
        y: 31,
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
    );
    const inputType = await element.evaluate((el) => el.type);
    if (inputType === 'select-one') {
      await changeSelectElement(element, 'comune di Portoscuso');
    } else if (
      ['textarea', 'text', 'url', 'tel', 'search', 'password', 'number', 'email'].includes(
        inputType
      )
    ) {
      await typeIntoElement(element, 'comune di Portoscuso');
    } else {
      await changeElementValue(element, 'comune di Portoscuso');
    }
  }
  {
    const targetPage = page;
    await scrollIntoViewIfNeeded(
      [
        ['aria/Comune di Portoscuso'],
        ['h6'],
        ['xpath///*[@data-testid="PartyItemContainer: Comune di Portoscuso"]/div/div/div[2]/h6'],
        ['pierce/h6'],
        ['text/Comune di Portoscuso'],
      ],
      targetPage,
      timeout
    );
    const element = await waitForSelectors(
      [
        ['aria/Comune di Portoscuso'],
        ['h6'],
        ['xpath///*[@data-testid="PartyItemContainer: Comune di Portoscuso"]/div/div/div[2]/h6'],
        ['pierce/h6'],
        ['text/Comune di Portoscuso'],
      ],
      targetPage,
      { timeout, visible: true }
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
      { timeout, visible: true }
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
          'text/Piattaforma pagoPa',
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
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
      { timeout, visible: true }
    );
    await element.click({
      offset: {
        x: 59.5625,
        y: 21.203125,
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
      throw new Error('The element could not be found.');
    }
    await waitForConnected(element, timeout);
    const isInViewport = await element.isIntersectingViewport({ threshold: 0 });
    if (isInViewport) {
      return;
    }
    await element.evaluate((element) => {
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
      return await element.isIntersectingViewport({ threshold: 0 });
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
        element = (
          await element.evaluateHandle((el) => (el.shadowRoot ? el.shadowRoot : el))
        ).asElement();
      }
    }
    if (!element) {
      throw new Error('Could not find element: ' + selector.join('|'));
    }
    return element;
  }

  async function waitForElement(step, frame, timeout) {
    const { count = 1, operator = '>=', visible = true, properties, attributes } = step;
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
          const newEl = (
            await el.evaluateHandle((el) => (el.shadowRoot ? el.shadowRoot : el))
          ).asElement();
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
      await new Promise((resolve) => setTimeout(resolve, 100));
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
      if (newValue.length <= input.value.length || !newValue.startsWith(input.value)) {
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
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

module.exports = login;
