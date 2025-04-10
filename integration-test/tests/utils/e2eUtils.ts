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
};

export async function login(
  page: Page,
  org: ORG_TYPE = ORG.EC_DEMO_DIRECT,
  isOperator?: boolean
) {
  const feURL: string = process.env.FE_URL ?? DEV_URL;
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

export async function isOperator(page: Page) {
  await page.getByText('Operatore PagoPA');
}

export async function checkReturnHomepage(page: Page) {
  await page.waitForTimeout(2000);
  await page.getByTestId('commission-bundles-test').click();
}

export async function changeToEcUser(page: Page, isOperator?: boolean) {
  await login(page, ORG.EC_DEMO_DIRECT, isOperator);
}

export async function changeToPspUser(page: Page, isOperator?: boolean) {
  await login(page, ORG.PSP_DEMO_DIRECT, isOperator);
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