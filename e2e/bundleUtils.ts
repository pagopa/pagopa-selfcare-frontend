import { Page } from "@playwright/test";
import { getTomorrowDate } from "./e2eUtils";

export const bundleNameGlobal = "Integration test global";
export const bundleNamePublic = "Integration test public";

export async function getToBundleDetail(page: Page, bundleName: string) {
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(bundleName);
    await page.getByTestId('page-limit-select').getByLabel('5').click();
    await page.getByRole('option', { name: '20' }).click();
    const tomorrowDate = getTomorrowDate();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await page.waitForTimeout(2000);
      const isVisible = await page
        .getByRole('row', {
          name: `${bundleName} ${tomorrowDate} ${tomorrowDate} CHECKOUT REMOVEME Status`,
        })
        .isVisible();
      if (isVisible) {
        await page
          .getByRole('row', {
            name: `${bundleName} ${tomorrowDate} ${tomorrowDate} CHECKOUT REMOVEME Status`,
          })
          .getByLabel('Gestisci pacchetto')
          .click();
        break;
      } else {
        await page.getByLabel('Go to next page').click();
      }
    }
  }