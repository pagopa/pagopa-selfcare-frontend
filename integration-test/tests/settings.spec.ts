import { Page, test, expect } from '@playwright/test';
import { changeToEcIPAUser, ORG } from './utils/e2eUtils';

const INSTITUTION_ID = ORG.EC_IPA.id;
const GET_SERVICES_URL = `**/institutions/${INSTITUTION_ID}/services/consents`;

test.describe('Settings Page - Service Consents', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: settings.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test('should render the list of services correctly', async () => {
    await changeToEcIPAUser(page);
    await acceptCookieBanner(page);

    console.log('🚀 STARTING TEST: Render the list of services');
    await page.getByTestId('settings-nav-test').click();
    await expect(page.getByRole('heading', { name: /Impostazioni/i })).toBeVisible();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { name: /SEPA Request to Pay/})).toBeVisible();
  });

  test('should open dialog, enable service (Opt-In) and disable service (Opt-in) or vice versa', async ({ page }) => {
    await changeToEcIPAUser(page);
    await acceptCookieBanner(page);
    
    await page.getByTestId('settings-nav-test').click();

    const btnEnable = page.getByTestId('settingCard-RTP-enableButton');
    const btnDisable = page.getByTestId('settingCard-RTP-disableButton');
    const eitherButton = btnEnable.or(btnDisable);
    await eitherButton.waitFor({ state: 'visible', timeout: 5000 });

    if (await btnEnable.isVisible()) {
      console.log('🚀 STATE DETECTED: Service is OFF. Testing ENABLE flow.');
      await enableServiceFlow(page, "RTP");

      console.log('🚀 Testing DISABLE flow.');
      await disableServiceFlow(page, "RTP");
    } else {
      console.log('🚀 STATE DETECTED: Service is ON. Testing DISABLE flow.');
      await disableServiceFlow(page, "RTP");

      console.log('🚀 Testing ENABLE flow.');
      await enableServiceFlow(page, "RTP");
    }
  });

  test('should close dialog when clicking cancel', async ({ page }) => {
    console.log('🚀 STARTING TEST: Should close dialog when clicking cancel.');
    await changeToEcIPAUser(page);
    await acceptCookieBanner(page);

    await page.getByTestId('settings-nav-test').click();

    const btnEnable = page.getByTestId('settingCard-RTP-enableButton');
    const btnDisable = page.getByTestId('settingCard-RTP-disableButton');
    const eitherButton = btnEnable.or(btnDisable);
    await eitherButton.waitFor({ state: 'visible', timeout: 5000 });

    if (await btnEnable.isVisible()) {
      await btnEnable.click();
    } else {
      await btnDisable.click();
    }

    const dialog = page.getByTestId('settingCard-RTP-dialog-message');
    await expect(dialog).toBeVisible();

    // Click Cancel
    await page.getByTestId('settingCard-RTP-dialog-cancelButton').click();

    await expect(dialog).toBeHidden();
  });

  test('should show empty state if list is empty', async ({ page }) => {
    console.log('🚀 STARTING TEST: Should close dialog when clicking cancel.');
    await changeToEcIPAUser(page);
    await acceptCookieBanner(page);

    await page.route(GET_SERVICES_URL, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ services: [] }),
      });
    });

    await page.getByTestId('settings-nav-test').click();

    await expect(page.getByTestId("settingsPage.emptyListError")).toBeVisible();
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

/**
 * Utility method that performs the "Enable Service" flow.
 * It handles the modal confirmation and asserts that the disabling button becomes visible afterwards.
 * @param page - The Playwright Page object
 * @param serviceId - The service id under test
 */
export const enableServiceFlow = async (page: Page, serviceId: string) => {
  const btnEnable = page.getByTestId(`settingCard-${serviceId}-enableButton`);
  const btnDisable = page.getByTestId(`settingCard-${serviceId}-disableButton`);
  const dialogBtnEnable = page.getByTestId(`settingCard-${serviceId}-dialog-enableButton`);

  await btnEnable.click();
  await dialogBtnEnable.click();

  await expect(page.getByText('In attivazione')).toBeVisible();
  await expect(btnDisable).toBeVisible();
};

/**
 * Utility method that performs the "Disable Service" flow.
 * It handles the modal confirmation and asserts that the enabling button becomes visible afterwards.
 * @param page - The Playwright Page object
 * @param serviceId - The service id under test
 */
export const disableServiceFlow = async (page: Page, serviceId: string) => {
  const btnEnable = page.getByTestId(`settingCard-${serviceId}-enableButton`);
  const btnDisable = page.getByTestId(`settingCard-${serviceId}-disableButton`);
  const dialogBtnDisable = page.getByTestId(`settingCard-${serviceId}-dialog-disableButton`);

  await btnDisable.click();
  await dialogBtnDisable.click();

  await expect(page.getByText('In disattivazione')).toBeVisible();
  await expect(btnEnable).toBeVisible();
};