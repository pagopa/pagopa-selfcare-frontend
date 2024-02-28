const {waitForElement, delay} = require("./commons");
const puppeteer = require("puppeteer");

const switchTo = async (page, timeout, actor) => {
    let i = 0;
    await delay(2000);
    console.log(`switchTo ${i++}`);
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.css-1ye32zt h6',
                'xpath///*[@id="root"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6',
                'pierce/div.css-1ye32zt h6',
            ]
        }, targetPage, timeout);
    }
    console.log(`switchTo ${i++}`);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('div.css-1ye32zt h6'),
            targetPage.locator('::-p-xpath(//*[@id=\\"root\\"]/div[2]/div[1]/nav/div/div/div/div[2]/div/div/div/div[2]/h6)'),
            targetPage.locator(':scope >>> div.css-1ye32zt h6'),
        ])
            .setTimeout(timeout)
            .click({
                offset: {
                    x: 55.1953125,
                    y: 9.046875,
                },
            });
    }
    console.log(`switchTo ${i++}`);
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
    console.log(`switchTo ${i++}`);
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('#mui-2'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mui-2\\"])'),
            targetPage.locator(':scope >>> #mui-2'),
            targetPage.locator('::-p-aria(Cerca ente)')
        ])
            .setTimeout(timeout)
            .fill(actor);
    }
    console.log(`switchTo ${i++}`);
    {
        const targetPage = page;
        await waitForElement({
            type: 'waitForElement',
            target: 'main',
            selectors: [
                'div.MuiModal-root h6',
                'xpath//html/body/div[2]/div[3]/div[3]/div/div[2]/h6',
                'pierce/div.MuiModal-root h6',
                `aria/${actor}`
            ]
        }, targetPage, timeout);
    }
    console.log(`switchTo ${i++}`);
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
            targetPage.locator(`::-p-aria(${actor})`)
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
    console.log(`switched to ${actor}`);
};

module.exports = {
    switchTo
}
