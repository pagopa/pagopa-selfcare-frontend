import { Page } from "@playwright/test";

export const DEV_URL = 'https://selfcare.dev.platform.pagopa.it/ui';

export async function login(page: Page){
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
    if(process.env.FE_URL){
        await page.goto(process.env.FE_URL);
        await page.waitForTimeout(3000);
        if(await page.getByRole('button', { name: 'Chiudi' }).isVisible()){
            await page.getByRole('button', { name: 'Chiudi' }).click();
        }
        if(await page.getByRole('button', { name: 'Accedi' }).isVisible()){
            await page.getByRole('button', { name: 'Accedi' }).click();
        }
    }
}


export function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return (Number(dd) < 10 ? `0${dd}`: dd) + '/' + (Number(mm) < 10 ? `0${mm}`: mm) + '/' + String(yyyy);
}

export function getTomorrowDate() {
    const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const dd = currentDate.getDate();
    const mm = currentDate.getMonth() + 1;
    const yyyy = currentDate.getFullYear();

    return (dd < 10 ? `0${dd}`: String(dd)) + '/' + (mm < 10 ? `0${mm}`: String(mm)) + '/' + String(yyyy);
}