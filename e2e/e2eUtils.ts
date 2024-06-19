import { Page } from '@playwright/test';

export const DEV_URL = 'https://selfcare.dev.platform.pagopa.it/ui';
export const BACKOFFICE_BE_URL = 'https://api.dev.platform.pagopa.it/backoffice/v1';
export const PSP_DEMO_DIRECT = '99999000011';

export async function login(page: Page, local?: boolean) {
  await page.goto('https://dev.selfcare.pagopa.it/dashboard');
  await page.getByRole('button', { name: 'Chiudi' }).click();
  await page.getByRole('button', { name: 'Entra con SPID' }).click();
  await page.getByLabel('test').click();
  await page.getByLabel('Username').fill('test');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByRole('button', { name: 'Invia' }).click();
  await page.getByLabel('Cerca ente').click();
  await page.getByLabel('Cerca ente').fill('Comune di fr');
  await page.getByRole('button', { name: 'Comune di Frosinone' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await page.locator('#forward_prod-pagopa').click();
  await page.getByText('Ambiente di Collaudo').click();
  await page.getByRole('button', { name: 'Entra' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  if (process.env.FE_URL) {
    await page.goto(process.env.FE_URL);
    await page.waitForTimeout(3000);
    if (await page.getByRole('button', { name: 'Chiudi' }).isVisible()) {
      await page.getByRole('button', { name: 'Chiudi' }).click();
    }
    if (await page.getByRole('button', { name: 'Accedi' }).isVisible()) {
      await page.getByRole('button', { name: 'Accedi' }).click();
    }
  }
}

export async function changeToEcUser(page: Page){
    await page.getByRole('button', { name: 'Comune di Frosinone Referente' }).click();
    await page.getByLabel('Cerca ente').click();
    await page.getByLabel('Cerca ente').fill('EC demo');
    await page.getByRole('button', { name: 'EC DEMO DIRECT Referente dei' }).click();
}

export async function changeToPspUser(page: Page){
    await page.getByRole('button', { name: 'Comune di Frosinone Referente' }).click();
    await page.getByLabel('Cerca ente').click();
    await page.getByLabel('Cerca ente').fill('PSP');
    await page.getByRole('button', { name: 'PSP DEMO DIRECT Responsabile' }).click();
}

export function getTodayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return dd + '/' + mm + '/' + String(yyyy);
}

export function getTomorrowDate() {
  const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
  const yyyy = currentDate.getFullYear();

  return dd + '/' + mm + '/' + String(yyyy);
}
