const puppeteer = require('puppeteer'); // v20.7.4 or later

(async () => {
  const browser = await puppeteer.launch({ headless: false, userDataDir: './user-data' });
  const page = await browser.newPage();
  const timeout = 30000;
  page.setDefaultTimeout(timeout);

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
    await targetPage.goto('https://selfcare.dev.platform.pagopa.it/ui');
    await Promise.all(promises);
  }

  // Start test Ec Signed direct
  {
    const targetPage = page;
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(EC Signed Direct)'),
      targetPage.locator('div.css-1ye32zt h6'),
      targetPage.locator(
        '::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6)'
      ),
      targetPage.locator(':scope >>> div.css-1ye32zt h6'),
    ])
      .setTimeout(timeout)
      .click({
        offset: {
          x: 45.203125,
          y: 3.046875,
        },
      });
  }
  {
    const targetPage = page;
    const promises = [];
    const startWaitingForEvents = () => {
      promises.push(targetPage.waitForNavigation());
    };
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(EC Signed Direct)'),
      targetPage.locator('div:nth-of-type(12) h6'),
      targetPage.locator('::-p-xpath(/html/body/div[2]/div[3]/div[12]/div/div[2]/h6)'),
      targetPage.locator(':scope >>> div:nth-of-type(12) h6'),
      targetPage.locator('::-p-text(EC Signed Direct)'),
    ])
      .setTimeout(timeout)
      .on('action', () => startWaitingForEvents())
      .click({
        offset: {
          x: 17,
          y: 12.171875,
        },
      });
    await Promise.all(promises);
  }

  await createOperationTableTest(page, timeout);

  // End test Ec Signed direct
  // Start test PSP Signed direct
  {
    const targetPage = page;
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(EC Signed Direct)'),
      targetPage.locator('div.css-1ye32zt h6'),
      targetPage.locator(
        '::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6)'
      ),
      targetPage.locator(':scope >>> div.css-1ye32zt h6'),
    ])
      .setTimeout(timeout)
      .click({
        offset: {
          x: 66.203125,
          y: 20.046875,
        },
      });
  }
  {
    const targetPage = page;
    const promises = [];
    const startWaitingForEvents = () => {
      promises.push(targetPage.waitForNavigation());
    };
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(PSP Signed Direct)'),
      targetPage.locator('div.MuiPaper-root > div:nth-of-type(3) h6'),
      targetPage.locator('::-p-xpath(/html/body/div[2]/div[3]/div[3]/div/div[2]/h6)'),
      targetPage.locator(':scope >>> div.MuiPaper-root > div:nth-of-type(3) h6'),
      targetPage.locator('::-p-text(PSP Signed Direct)'),
    ])
      .setTimeout(timeout)
      .on('action', () => startWaitingForEvents())
      .click({
        offset: {
          x: 90,
          y: 17.171875,
        },
      });
    await Promise.all(promises);
  }

  await createOperationTableTest(page, timeout);

  // End test PSP Signed direct
  // Start test PT EC

  {
    const targetPage = page;
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(PSP Signed Direct)'),
      targetPage.locator('div.css-1ye32zt h6'),
      targetPage.locator(
        '::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6)'
      ),
      targetPage.locator(':scope >>> div.css-1ye32zt h6'),
    ])
      .setTimeout(timeout)
      .click({
        offset: {
          x: 42.796875,
          y: 6.046875,
        },
      });
  }
  {
    const targetPage = page;
    const promises = [];
    const startWaitingForEvents = () => {
      promises.push(targetPage.waitForNavigation());
    };
    await targetPage.waitForNetworkIdle();
    await puppeteer.Locator.race([
      targetPage.locator('::-p-aria(PT Ente Test)'),
      targetPage.locator('div:nth-of-type(7) h6'),
      targetPage.locator('::-p-xpath(/html/body/div[2]/div[3]/div[7]/div/div[2]/h6)'),
      targetPage.locator(':scope >>> div:nth-of-type(7) h6'),
      targetPage.locator('::-p-text(PT Ente Test)'),
    ])
      .setTimeout(timeout)
      .on('action', () => startWaitingForEvents())
      .click({
        offset: {
          x: 63,
          y: 11.171875,
        },
      });
    await Promise.all(promises);
  }

  await createOperationTableTest(page, timeout);

  await browser.close();
  console.log('Operation table created/updated');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

const createOperationTableTest = async (page, timeout) => {
  const targetPage = page;
  await targetPage.waitForNetworkIdle();
  await puppeteer.Locator.race([
    targetPage.locator('div.MuiGrid-root div:nth-of-type(3) button'),
    targetPage.locator(
      '::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[2]/div/div[2]/div/div[2]/div[3]/div/div[2]/div[5]/button)'
    ),
    targetPage.locator(':scope >>> div.MuiGrid-root div:nth-of-type(3) button'),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 45.171875,
        y: 14.75,
      },
    });

  await targetPage.waitForNetworkIdle();
  const inputMail = await targetPage.$('#email');
  await inputMail.click({ clickCount: 3 });
  await inputMail.type('mail@test.com');

  const inputPhone = await targetPage.$('#phone');
  await inputPhone.click({ clickCount: 3 });
  await inputPhone.type('1234324234');

  await puppeteer.Locator.race([
    targetPage.locator('::-p-aria(Conferma)'),
    targetPage.locator("[data-testid='submit-button-test']"),
    targetPage.locator('::-p-xpath(//*[@data-testid=\\"submit-button-test\\"])'),
    targetPage.locator(":scope >>> [data-testid='submit-button-test']"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 56.484375,
        y: 18.703125,
      },
    });
};
