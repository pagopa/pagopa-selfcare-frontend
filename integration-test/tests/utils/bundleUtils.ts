/* eslint-disable functional/no-let */
import { expect, Page } from '@playwright/test';
import * as it from '../../../src/locale/it.json';
import {
  BundleTypes,
  MARKETPLACE_BE_URL,
  PSP_DEMO_DIRECT_CODE,
} from './e2eUtils';

export const bundleNameGlobal = 'Integration test global';
export const bundleNamePublic = 'Integration test public';
export const bundleNamePrivate = 'Integration test private';

export const ciBundleStates = {
  ENABLED: it.commissionBundlesPage.list.states.expiring, // Enabled bundles during the e2e tests are always expiring
  ON_REMOVAL: it.commissionBundlesPage.list.states.deactivated,
  REQUESTED: it.commissionBundlesPage.list.states.requestInProgress,
  AVAILABLE: it.commissionBundlesPage.list.states.toBeActivated,
};

export async function getToBundleDetail(
  page: Page,
  bundleName: string
): Promise<boolean> {
  let resultsFound = true;
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill(bundleName);
  await page.getByTestId('button-search').click();
  await page.waitForTimeout(2000);
  
  try {
    await page.getByText('Non sono ancora presenti').waitFor({ timeout: 3000 });
    resultsFound = false;
    return resultsFound;
  } catch {
    await page.getByTestId('page-limit-select').getByLabel('5').click();
    await page.getByRole('option', { name: '20' }).click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Gestisci pacchetto').first().click();
    return resultsFound;
  }
}

export async function validateBundle(bundleName: string, bundleType: string): Promise<boolean> {
  try {
    // Retrieve bundle list
    const response = await fetch(
      `${MARKETPLACE_BE_URL}/bundles?limit=200&types=${bundleType}&name=${bundleName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.SUBKEY,
        } as HeadersInit,
      }
    );
    
    if (!response.ok) {
      console.log(`Failed to get bundles: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const bundleList = await response.json();
    
    // Check if we have any bundles
    if (!bundleList?.bundles?.length) {
      console.log(`No bundles found with name ${bundleName} and type ${bundleType}`);
      return false;
    }
    
    const dateToday = new Date().getTime();

    // Update bundle
    const bundle = bundleList.bundles.find(
      (el: any) =>
        new Date(el.validityDateFrom).getTime() > dateToday &&
        new Date(el.validityDateTo).getTime() > dateToday
    );
    
    if (!bundle || !bundle.validityDateFrom || !bundle.validityDateTo) {
      console.log('No valid bundle with future validity dates found');
      return false;
    }
    
    const responseUpdate = await fetch(
      `${MARKETPLACE_BE_URL}/psps/${PSP_DEMO_DIRECT_CODE}/bundles/${bundle.idBundle}?forceUpdate=true`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.SUBKEY,
        } as HeadersInit,
        body: JSON.stringify({
          ...bundle,
          validityDateFrom: new Date(),
          abi: PSP_DEMO_DIRECT_CODE.replace('ABI', ''),
        }),
      }
    );
    
    if (!responseUpdate.ok) {
      try {
        const responseText = await responseUpdate.text();
        console.log('Validate bundle update error: ', responseText);
      } catch (error) {
        console.log('Error reading response body:', error);
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Error in validateBundle:', error);
    return false;
  }
}

export async function invalidateAllBundles(bundleName: string, bundleType: BundleTypes): Promise<boolean> {
  console.log("Invalidanting all expired bundles");
  try {
    // Retrieve bundle list
    const response = await fetch(
      `${MARKETPLACE_BE_URL}/bundles?limit=200&name=${bundleName}&types=${bundleType}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.SUBKEY ?? '',
        },
      }
    );

    if (!response.ok) {
      console.log('Invalidate bundle get bundle error', await response.text());
      return false;
    }

    const bundleList = await response.json();
    if (!bundleList?.bundles?.length) {
      console.log(`No bundles found with name ${bundleName} to invalidate`);
      return false;
    }

    // Update bundle
    let allSucceeded = true;
    for (let i = 0; i < bundleList.bundles.length; i++) {
      const bundle = bundleList.bundles[i];

      try {
        const responseDelete = await fetch(
          `${MARKETPLACE_BE_URL}/psps/${PSP_DEMO_DIRECT_CODE}/bundles/${bundle.idBundle}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': process.env.SUBKEY ?? '',
            },
          }
        );

        if (!responseDelete.ok) {
          const responseText = await responseDelete.text();
          console.log(`Invalidate bundle delete error for bundle ${bundle.idBundle}: ${responseText}`);
        }
      } catch (error) {
        console.log(`Exception during bundle deletion: ${error}`);
      }

      try {
        const responseUpdate = await fetch(
          `${MARKETPLACE_BE_URL}/psps/${PSP_DEMO_DIRECT_CODE}/bundles/${bundle.idBundle}?forceUpdate=true`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': process.env.SUBKEY ?? '',
            },
            body: JSON.stringify({
              ...bundle,
              validityDateFrom: '2024-01-01',
              validityDateTo: '2024-01-01',
              abi: PSP_DEMO_DIRECT_CODE.replace('ABI', ''),
            }),
          }
        );

        if (!responseUpdate.ok) {
          const responseText = await responseUpdate.text();
          console.log(`Invalidate bundle update error for bundle ${bundle.idBundle}: ${responseText}`);
          allSucceeded = false;
        }
      } catch (error) {
        console.log(`Exception during bundle update: ${error}`);
        allSucceeded = false;
      }
    }

    return allSucceeded;
  } catch (error) {
    console.log(`Exception in invalidateAllBundles: ${error}`);
    return false;
  }
}

export async function deleteAllExpiredBundles(bundleName: string, bundleType: BundleTypes): Promise<boolean> {
  console.log("Deleting all expired bundles");
  const invalidateSuccess = await invalidateAllBundles(bundleName, bundleType);
  if (!invalidateSuccess) {
    console.log(`Warning: Failed to invalidate all bundles for ${bundleName} (${bundleType})`);
  }

  try {
    const response = await fetch(`${MARKETPLACE_BE_URL}/configuration`, {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.SUBKEY ?? '',
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log(`Warning: Failed to refresh configuration: ${response.status} ${response.statusText} - ${responseText}`);
      return false;
    }

    console.log('Successfully refreshed configuration');
    return true;
  } catch (error) {
    console.log(`Exception refreshing configuration: ${error}`);
    return false;
  }
}

export async function getToNotDeletedBundleDetail(
  page: Page,
  bundleName: string
) {
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill(bundleName);
  await page.getByTestId('state-filter').click();
  await page.getByRole('option', { name: 'In attivazione' }).click();
  await page.getByTestId('button-search').click();
  await page.waitForTimeout(2000);
  await page.getByTestId('button-search').click();
  await page.getByLabel('Gestisci pacchetto').first().click();
}

export function getRandomMinImport() {
  return Math.floor(Math.random() * (50000 - 49000 + 1)) + 49000;
}

export function getRandomMaxImport() {
  return Math.floor(Math.random() * (100000 - 99000 + 1)) + 99000;
}

export function getRandomPaymentAmount() {
  return Math.floor(Math.random() * 5) + 1;
}
