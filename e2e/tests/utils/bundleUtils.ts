/* eslint-disable functional/no-let */
import {expect, Page} from '@playwright/test';
import * as it from '../../../src/locale/it.json';
import {BundleTypes, getDateAfterThreeDays, getTodayDate, MARKETPLACE_BE_URL, PSP_DEMO_DIRECT_CODE,} from './e2eUtils';

export const bundleNameGlobal = 'Integration test global';
export const bundleNamePublic = 'Integration test public';
export const bundleNamePrivate = 'Integration test private';

export const ciBundleStates = {
    ENABLED: it.commissionBundlesPage.list.states.expiring, // Enabled bundles during the e2e tests are always expiring
    ON_REMOVAL: it.commissionBundlesPage.list.states.deactivated,
    REQUESTED: it.commissionBundlesPage.list.states.requestInProgress,
    AVAILABLE: it.commissionBundlesPage.list.states.toBeActivated,
};

export async function getToBundleDetailPsp(
    page: Page,
    bundleName: string,
    validityDayToday?: boolean
) {
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(bundleName);
    await page.getByTestId('page-limit-select').getByLabel('5').click();
    await page.getByRole('option', {name: '20'}).click();
    const dateAfterThreeDays = getDateAfterThreeDays();
    const todayDate = getTodayDate();
    const rowName = `${bundleName} ${validityDayToday ? todayDate : dateAfterThreeDays} ${dateAfterThreeDays} Touchpoint REMOVEME Status`;
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

export async function getToBundleDetailEc(page: Page, bundleName: string, bundleState: string) {
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(bundleName);
    await page.waitForTimeout(2000);
    await page.getByTestId('page-limit-select').getByLabel('5').click();
    await page.getByRole('option', {name: '20'}).click();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await page.waitForTimeout(2000);
        const isVisibleRowLocator = await page.getByLabel('Gestisci pacchetto').isVisible();
        if (isVisibleRowLocator) {
            await page.getByLabel('Gestisci pacchetto').click();
            break;
        }
        await page.getByLabel('Go to next page').click();
    }
}

export async function validateBundle(bundleName: string, bundleType: string) {
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
    const bundleList = await response.json();
    expect(bundleList?.bundles?.length).toBeTruthy();
    const dateToday = new Date().getTime();

    // Update bundle
    const bundle = bundleList.bundles.find(
        (el: any) =>
            new Date(el.validityDateFrom).getTime() > dateToday &&
            new Date(el.validityDateTo).getTime() > dateToday
    );
    expect(bundle.validityDateFrom).toBeTruthy();
    expect(bundle.validityDateTo).toBeTruthy();
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
    try {
        console.log('Validate bundle update error', await responseUpdate.text());
    } finally {
        expect(responseUpdate.ok).toBeTruthy();
    }
}

export async function invalidateAllBundles(bundleName: string, bundleType: BundleTypes) {
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
        console.log("Invalidate bundle get bundle error", await response.text());
    } else {
        const bundleList = await response.json();
        expect(bundleList?.bundles?.length).toBeTruthy();
        // Update bundle
        for (let i = 0; i < bundleList.bundles.length; i++) {
            const bundle = bundleList.bundles[i];
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
                console.log('Invalidate bundle delete error', await responseDelete.text());
            }
            expect(responseDelete.status === 200 || responseDelete.status === 400).toBeTruthy();

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
                console.log('Invalidate bundle update error', await responseUpdate.text());
            }
            expect(responseUpdate.ok).toBeTruthy();
        }
    }
}

export async function deleteAllExpiredBundles(bundleName: string, bundleType: BundleTypes) {
    await invalidateAllBundles(bundleName, bundleType);
    const response = await fetch(`${MARKETPLACE_BE_URL}/configuration`, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SUBKEY ?? '',
        },
    });
    try {
        console.log('Delete all expired bundles response', await response.text());
    } finally {
        expect(response.ok).toBeTruthy();
    }
}
