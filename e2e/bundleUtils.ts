/* eslint-disable functional/no-let */
import { Page } from '@playwright/test';
import { BACKOFFICE_BE_URL, getTodayDate, getTomorrowDate, PSP_DEMO_DIRECT } from './e2eUtils';

export const bundleNameGlobal = 'Integration test global';
export const bundleNamePublic = 'Integration test public';

export async function getToBundleDetail(page: Page, bundleName: string, validityDayToday?: boolean) {
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill(bundleName);
  await page.getByTestId('page-limit-select').getByLabel('5').click();
  await page.getByRole('option', { name: '20' }).click();
  const tomorrowDate = getTomorrowDate();
  const todayDate = getTodayDate();
  const rowName = `${bundleName} ${validityDayToday ? todayDate : tomorrowDate} ${tomorrowDate} Touchpoint REMOVEME Status`;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await page.waitForTimeout(2000);
    const isVisible = await page
      .getByRole('row', {
        name: rowName,
      })
      .isVisible();
    if (isVisible) {
      await page
        .getByRole('row', {
          name: rowName,
        })
        .getByLabel('Gestisci pacchetto')
        .click();
      break;
    } else {
      await page.getByLabel('Go to next page').click();
    }
  }
}

export async function validateBundle(bundleName: string, bundleType: string, jwt: string) {
  const response = await fetch(
    `${BACKOFFICE_BE_URL}/bundles/payment-service-providers/${PSP_DEMO_DIRECT}?limit=200&bundle-type=${bundleType}&name=${bundleName}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const bundleList = await response.json();
  for (let i = 0; i < bundleList.bundles.length; i++) {
    const bundle = bundleList.bundles[i];
    if (new Date(bundle.validityDateFrom).getTime() > new Date().getTime()) {
      const responseUpdate = await fetch(
        `${BACKOFFICE_BE_URL}/bundles/${bundle.idBundle}/payment-service-providers/${PSP_DEMO_DIRECT}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            ...bundle,
            validityDateFrom: new Date(),
            abi: "50004",
            pspBusinessName: "PSP DEMO DIRECT"
          }),
        }
      );
      expect(responseUpdate.ok).toBeTruthy();
      break;
    }
  }
}
