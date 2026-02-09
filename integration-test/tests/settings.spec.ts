import { Page, test, expect } from '@playwright/test';
import { changeToEcUser } from './utils/e2eUtils';

const INSTITUTION_ID = '89a94a69-7a2d-4fa8-ac16-1f828926c6b2';
const GET_SERVICES_URL = `**/institutions/${INSTITUTION_ID}/services/consents`;

test.describe('Settings Page - Service Consents', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: settings.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test('should render the list of services correctly', async () => {
    await changeToEcUser(page);
    await acceptCookieBanner(page);

    console.log('🚀 STARTING TEST: Render the list of services');
    await page.getByTestId('settings-nav-test').click();
    await expect(page.getByRole('heading', { name: /Impostazioni/i })).toBeVisible();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { name: /SEPA Request to Pay/})).toBeVisible();
  });

  test('should open dialog and enable service (Opt-In)', async ({ page }) => {
    await changeToEcUser(page);
    await acceptCookieBanner(page);
    
    await page.getByTestId('settings-nav-test').click();

    const btnEnable = page.getByTestId('RTP-button-enabling');
    const btnDisable = page.getByTestId('RTP-button-disabling');
    const eitherButton = btnEnable.or(btnDisable);
    await eitherButton.waitFor({ state: 'visible', timeout: 5000 });

    if (await btnEnable.isVisible()) {
      console.log('🚀 STATE DETECTED: Service is OFF. Testing ENABLE flow.');
      await btnEnable.click();
      await page.getByTestId('dialog-button-confirm-enabling').click();

      await expect(page.getByText('In attivazione')).toBeVisible();
      await expect(btnDisable).toBeVisible();

      console.log('🚀 Testing DISABLE flow.');

      await btnDisable.click();
      await page.getByTestId('dialog-button-confirm-disabling').click();

      await expect(page.getByText('In disattivazione')).toBeVisible();
      await expect(btnEnable).toBeVisible();
    } else {
      console.log('🚀 STATE DETECTED: Service is ON. Testing DISABLE flow.');
      await btnDisable.click();
      await page.getByTestId('dialog-button-confirm-disabling').click();

      await expect(page.getByText('In disattivazione')).toBeVisible();
      await expect(btnEnable).toBeVisible();

      console.log('🚀 Testing ENABLE flow.');
      await btnEnable.click();
      await page.getByTestId('dialog-button-confirm-enabling').click();

      await expect(page.getByText('In attivazione')).toBeVisible();
      await expect(btnDisable).toBeVisible();
    }
  });

  test('should close dialog when clicking cancel', async ({ page }) => {
    console.log('🚀 STARTING TEST: Should close dialog when clicking cancel.');
    await changeToEcUser(page);
    await acceptCookieBanner(page);

    await page.getByTestId('settings-nav-test').click();

    const btnEnable = page.getByTestId('RTP-button-enabling');
    const btnDisable = page.getByTestId('RTP-button-disabling');
    const eitherButton = btnEnable.or(btnDisable);
    await eitherButton.waitFor({ state: 'visible', timeout: 5000 });

    if (await btnEnable.isVisible()) {
      await btnEnable.click();
    } else {
      await btnDisable.click();
    }

    const dialog = page.getByTestId('dialog-test');
    await expect(dialog).toBeVisible();

    // Click Cancel
    await page.getByTestId('dialog-button-cancel').click();

    await expect(dialog).toBeHidden();
  });

  test('should show empty state if list is empty', async ({ page }) => {
    console.log('🚀 STARTING TEST: Should close dialog when clicking cancel.');
    await changeToEcUser(page);
    await acceptCookieBanner(page);

    await page.route(GET_SERVICES_URL, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ services: [] }),
      });
    });

    await page.getByTestId('settings-nav-test').click();

    await expect(page.getByTestId("settings-page-empty-message")).toBeVisible();
  });
});

export const acceptCookieBanner = async (page: Page) => {
  const cookieButton = page.getByRole('button', { name: /accetta|accept/i });

  try {
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
    await cookieButton.click();
    console.log('🍪 Cookie banner accepted.');
  } catch (error) {
    console.log('🍪 Cookie banner not found or already accepted (Continuing test...)');
  }
};