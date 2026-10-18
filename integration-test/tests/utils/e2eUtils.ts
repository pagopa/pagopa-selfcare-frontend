import { add } from 'date-fns';
import { Page } from '@playwright/test';
import { createJWT } from './createJwt';

export enum BundleTypes {
  'PUBLIC' = 'PUBLIC',
  'PRIVATE' = 'PRIVATE',
  'GLOBAL' = 'GLOBAL',
}

export const DEV_URL = 'https://selfcare.dev.platform.pagopa.it/ui';
export const BASE_BE_URL = 'https://api.dev.platform.pagopa.it';
export const BACKOFFICE_BE_URL = BASE_BE_URL + '/backoffice/v1';
export const MARKETPLACE_BE_URL = BASE_BE_URL + '/afm/marketplace-service/v1';

export const PSP_DEMO_DIRECT = '99999000011';
export const PSP_DEMO_DIRECT_CODE = 'ABI50004';

export type ORG_TYPE = {
  id: string;
  taxCode: string;
};

export const ORG = {
  EC_DEMO_DIRECT: { id: '21079fe3-b5eb-4978-bef0-5588d11ab53f', taxCode: '99999000013' },
  PSP_DEMO_DIRECT: { id: '5b7130fb-dbe1-4e3b-b02b-2a9cfaf54602', taxCode: '99999000011' },
  EC_IPA: { id: '6b920f99-fc0d-4eb4-9f91-719a98ba48db', taxCode: '00067060947' },
};

/**
 * The two identities the integration tests run as. Every test file lives under
 * `tests/ec` or `tests/op` and only ever logs in as the matching persona
 * (`yarn test:ec` / `yarn test:op`):
 *  - `ec`: regular EC/PSP admin, `isOperator` feature flag forced to `false`
 *  - `op`: PagoPA operator, `isOperator` feature flag forced to `true`
 */
export type Persona = 'ec' | 'op';

async function login(page: Page, org: ORG_TYPE, persona: Persona) {
  const feURL: string = process.env.FE_URL ?? DEV_URL;
  const isOperator = persona === 'op';
  const jwt = createJWT(org, isOperator); // id Comune di Frosinone
  await page.goto(feURL + '#logged=forced');
  await page.evaluate(
    ({ jwt, isOperator }) => {
      const user = {
        uid: '5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8',
        name: 'Anselmo',
        surname: 'Sartori',
        email: isOperator ? 'operatorePagopa@test.it' : 'furiovitale@martino.it',
      };
      const tos = {
        id: '5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8',
        timestamp: '2024-02-20T14:28:10.041Z',
      };
      window.localStorage.setItem('acceptTOS', JSON.stringify(tos));
      window.localStorage.setItem('user', JSON.stringify(user));
      window.localStorage.setItem('token', jwt);
    },
    { jwt, isOperator }
  );
  await page.waitForTimeout(1000);
  await page.goto(feURL, { waitUntil: 'load' });
}

/**
 * Pins the `isOperator` feature flag returned by the backend so the persona
 * does not depend on what DEV happens to answer for the test user.
 */
async function forceOperatorFlag(page: Page, value: boolean) {
  await page.unroute('**/flags').catch(() => {});
  await page.route('**/flags', async (route) => {
    const response = await route.fetch();
    const json = await response.json().catch(() => ({}));
    await route.fulfill({
      response,
      json: { ...json, flags: { ...(json.flags ?? {}), isOperator: value } },
    });
  });
}

export async function loginAs(page: Page, persona: Persona, org: ORG_TYPE = ORG.EC_DEMO_DIRECT) {
  await forceOperatorFlag(page, persona === 'op');
  await login(page, org, persona);
}

export async function checkReturnHomepage(page: Page) {
  const feURL: string = process.env.FE_URL ?? DEV_URL;

  // Dismiss any leftover modal/backdrop left by the previous step.
  await page.keyboard.press('Escape').catch(() => {});

  const menu = page.getByTestId('commission-bundles-test');
  try {
    await menu.waitFor({ state: 'visible', timeout: 15000 });
    await menu.click({ timeout: 15000 });
    return;
  } catch {
    // The previous action did not bring us back to a navigable page
    // (stuck on a form, hanging loading overlay, error toast, ...).
    // Fall back to a hard reload so the next test starts from a known state.
  }

  await page.goto(feURL, { waitUntil: 'load' });
  await menu.waitFor({ state: 'visible', timeout: 15000 });
  await menu.click({ timeout: 15000 });
}

/**
 * MUI X v6.19+ `DesktopTimePicker` renders a `MultiSectionDigitalClock`
 * (two `listbox` columns "Select hours" / "Select minutes") instead of the old
 * analog `.MuiClock` face. Call this right after the "Choose time" button
 * opened the popup.
 *
 * The station-maintenance form always passes a `minTime` (it falls back to
 * `minDateFromToday`), and since the picker only has hour/minute views that
 * `minTime` disables every hour before the current wall-clock hour. So instead
 * of asking for a fixed time we pick the LAST still-enabled option in each
 * column, which is always valid regardless of when the run happens.
 */
export async function selectDigitalClockTime(page: Page) {
  for (const listLabel of ['Select hours', 'Select minutes']) {
    const list = page.locator(`ul[role="listbox"][aria-label="${listLabel}"]`);
    await list.waitFor({ state: 'visible', timeout: 10000 });

    const enabled = list.locator('li[role="option"]:not(.Mui-disabled)');
    // the minutes column is rendered lazily after the hour is picked, and its
    // options may all start disabled until minTime is re-evaluated, so poll
    // for a bit instead of giving up after a single fixed wait.
    await enabled.first().waitFor({ state: 'attached', timeout: 10000 }).catch(() => {});
    // eslint-disable-next-line functional/no-let
    let enabledCount = await enabled.count();
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < 10 && enabledCount === 0; i++) {
      await page.waitForTimeout(300);
      enabledCount = await enabled.count();
    }
    if (enabledCount === 0) {
      throw new Error(
        `selectDigitalClockTime: no enabled options in "${listLabel}" column ` +
          `after waiting for minTime to be re-evaluated (possibly running too close to midnight).`
      );
    }
    const option = enabled.last();
    // select via keyboard so the picker's normal close-on-select still fires
    // (a forced mouse click on the clipped <ul> would skip it).
    await option.scrollIntoViewIfNeeded().catch(() => {});
    await option.focus().catch(() => {});
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
  }
  // Make sure the popper is really gone before the caller touches the form.
  const popper = page.locator('.MuiPickersPopper-root');
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < 4 && (await popper.count()) > 0; i++) {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(400);
  }
  if ((await popper.count()) > 0) {
    await page.mouse.click(4, 4).catch(() => {});
    await popper.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
  }
}

/**
 * Navigates an open MUI X `DesktopDatePicker` popup (English locale) to
 * `target` and clicks the day.
 */
export async function selectDatePickerDate(page: Page, target: Date) {
  const header = page.locator('.MuiPickersCalendarHeader-label');
  await header.waitFor({ state: 'visible', timeout: 10000 });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const wantMonth = monthNames[target.getMonth()];
  const wantYear = target.getFullYear();

  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < 24; i++) {
    const label = ((await header.textContent()) ?? '').trim();
    if (label.includes(wantMonth) && label.includes(String(wantYear))) {
      break;
    }
    const labelYear = parseInt(label.match(/\d{4}/)?.[0] ?? '0', 10);
    const labelMonth = monthNames.findIndex((m) => label.includes(m));
    const forward =
      wantYear > labelYear || (wantYear === labelYear && target.getMonth() > labelMonth);
    await page.locator(`button[aria-label="${forward ? 'Next month' : 'Previous month'}"]`).click();
    await page.waitForTimeout(300);
  }

  await page
    .locator('button.MuiPickersDay-root')
    .filter({ hasText: new RegExp(`^${target.getDate()}$`) })
    .first()
    .click();
  await page.waitForTimeout(300);
}

export async function changeToEcUser(page: Page) {
  await loginAs(page, 'ec', ORG.EC_DEMO_DIRECT);
}

export async function changeToPspUser(page: Page) {
  await loginAs(page, 'ec', ORG.PSP_DEMO_DIRECT);
}

export async function changeToEcIPAUser(page: Page) {
  await loginAs(page, 'ec', ORG.EC_IPA);
}

/** PagoPA operator acting on the demo EC (stations). */
export async function changeToOperatorOnEc(page: Page) {
  await loginAs(page, 'op', ORG.EC_DEMO_DIRECT);
}

/** PagoPA operator acting on the demo PSP (channels). */
export async function changeToOperatorOnPsp(page: Page) {
  await loginAs(page, 'op', ORG.PSP_DEMO_DIRECT);
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

export function getDateAfterThreeDays() {
  const currentDate = add(new Date(), { days: 3 });
  currentDate.setHours(0, 0, 0, 0);
  const dd = String(currentDate.getDate()).padStart(2, '0');
  const mm = String((currentDate.getMonth() as number) + 1).padStart(2, '0');
  const yyyy = currentDate.getFullYear();

  return dd + '/' + mm + '/' + String(yyyy);
}