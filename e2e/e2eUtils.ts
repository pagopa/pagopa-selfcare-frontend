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
    process.env.REACT_APP_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTI1Nzg3MjIsImF1ZCI6ImFwaS5wbGF0Zm9ybS5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL2FwaS5kZXYucGxhdGZvcm0ucGFnb3BhLml0IiwidWlkIjoiNTA5NmU0YzYtMjVhMS00NWQ1LTliZGYtMmZiOTc0YTdjMWM4IiwibmFtZSI6IkFuc2VsbW8iLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJvcmdfaWQiOiI1YjQ2YjFkNS02M2ZhLTQzZmItYWRjNC0yMTA5M2IxZDZjZDYiLCJvcmdfdmF0IjoiMDAyNjQ1NjA2MDgiLCJvcmdfcGFydHlfcm9sZSI6Ik1BTkFHRVIiLCJvcmdfcm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ0MTM2MzIyfQ.osESy4diTmp0aNixufoct7yRm-kwXY84ofWbdm3NePcwzJBGIEBe7b10I7AymPro0QPF2i6rerTk0y5IIEBoTJzq9DJUDDZlM_9F2GAa3nfi3XkZ3Qam0Mdu9uLRZEJuiAx5zyNgziMED2feHg2nusAGmyKIHP45akSP_hyhfCdyO45_WRp6d9V6iKjPnmvaw3y3tCbY-vBpN2MblhKUp-f1AT-Z9Z9J7V6n4Y9yD0u8DyAqIr_jjW5HJ6OuHT7Wo7l8jtjxBlpuhL69rdU9yS2He3unHTMl7BH2mg3JPU2XwN8_qHjwkkEgh5M60wjPYkpJ6mZxIDaXx0pK17vaEA";
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