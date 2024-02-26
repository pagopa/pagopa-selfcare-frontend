const puppeteer = require('puppeteer'); // v20.7.4 or later
const { waitForElement } = require('./commons.js');

(async () => {
    const browser = await puppeteer.launch({headless: 'new', userDataDir: './user-data'});
    const page = await browser.newPage();
    const timeout = 5000;
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
                'div.css-1ye32zt h6',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6',
                'pierce/div.css-1ye32zt h6',
                'aria/EC Signed Direct'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.css-1ye32zt h6'),
            targetPage.locator('::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6)'),
            targetPage.locator(':scope >>> div.css-1ye32zt h6'),
            targetPage.locator('::-p-aria(EC Signed Direct)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 55.1953125,
                y: 9.046875,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#mui-2'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mui-2\\"])'),
            targetPage.locator(':scope >>> #mui-2'),
            targetPage.locator('::-p-aria(Cerca ente)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 109.171875,
                y: 23,
              },
            });
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#mui-2'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mui-2\\"])'),
            targetPage.locator(':scope >>> #mui-2'),
            targetPage.locator('::-p-aria(Cerca ente)')
        ])
            .setTimeout(timeout)
            .fill('PSP DEMO DIRECT');
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.MuiModal-root h6',
                'xpath//html/body/div[2]/div[3]/div[3]/div/div[2]/h6',
                'pierce/div.MuiModal-root h6',
                'aria/PSP DEMO DIRECT'
            ]
        }, targetPage, timeout);
    }
    {
        const targetPage = page;
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await puppeteer.Locator.race([
            targetPage.locator('div.MuiModal-root h6'),
            targetPage.locator('::-p-xpath(/html/body/div[2]/div[3]/div[3]/div/div[2]/h6)'),
            targetPage.locator(':scope >>> div.MuiModal-root h6'),
            targetPage.locator('::-p-aria(PSP DEMO DIRECT)')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
            .click({
              offset: {
                x: 109.59375,
                y: 19.171875,
              },
            });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.css-1ye32zt h6',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6',
                'pierce/div.css-1ye32zt h6',
                'aria/PSP DEMO DIRECT'
            ]
        }, targetPage, timeout);
    }

    console.log("switch to PSP Signed DEMO");
    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
