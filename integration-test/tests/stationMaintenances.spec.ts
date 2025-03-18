import { test, Page } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('Station Maintenances flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: stationMaintenances.spec.ts');
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('EC creates new station maintenance', async () => {
    console.log('🚀 STARTING TEST: EC creates new station maintenance');
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByRole('button', { name: 'Nuova manutenzione' }).click();
    await page.getByRole('combobox', { name: 'Cerca stazione' }).click();
    await page.getByRole('option', { name: '99999000013_01' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Dalle ore$/ })
      .getByLabel('Choose time')
      .click();

    await page.locator('.MuiClock-squareMask').first().click();
    await page.locator('.MuiClock-squareMask').first().click();

    await page.getByRole('button', { name: 'Choose time', exact: true }).click();

    await page.locator('.MuiClock-squareMask').first().click();
    await page.locator('.MuiClock-squareMask').first().click();

    const datePickers = await page.locator('button[aria-label^="Choose date"]').all();

    if (datePickers.length >= 2) {
      const today = new Date();
      const fourDaysFromNow = new Date(today);
      fourDaysFromNow.setDate(today.getDate() + 4);

      const targetMonth = fourDaysFromNow.getMonth();
      const targetDay = fourDaysFromNow.getDate();
      const targetYear = fourDaysFromNow.getFullYear();

      console.log(`Will select date: ${targetDay}/${targetMonth + 1}/${targetYear}`);

      await datePickers[1].click();

      const calendarHeader = await page.locator('.MuiPickersCalendarHeader-label').textContent();
      console.log(`Calendar shows: ${calendarHeader}`);

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let currentMonth = -1;
      let currentYear = 0;

      for (let i = 0; i < monthNames.length; i++) {
        if (calendarHeader != null && calendarHeader.includes(monthNames[i])) {
          currentMonth = i;
          const yearMatch = calendarHeader.match(/\d{4}/);
          if (yearMatch) {
            currentYear = parseInt(yearMatch[0]);
          }
          break;
        }
      }

      console.log(`Detected current calendar view: Month=${currentMonth + 1}, Year=${currentYear}`);

      while (currentMonth !== targetMonth || currentYear !== targetYear) {
        if (
          (targetYear > currentYear) ||
          (targetYear === currentYear && targetMonth > currentMonth)
        ) {
          await page.locator('button[aria-label="Next month"]').click();
          console.log('Clicked Next month');
        } else {
          await page.locator('button[aria-label="Previous month"]').click();
          console.log('Clicked Previous month');
        }

        const newHeader = await page.locator('.MuiPickersCalendarHeader-label').textContent();
        for (let i = 0; i < monthNames.length; i++) {
          if (newHeader != null && newHeader.includes(monthNames[i])) {
            currentMonth = i;
            const yearMatch = newHeader.match(/\d{4}/);
            if (yearMatch) {
              currentYear = parseInt(yearMatch[0]);
            }
            break;
          }
        }

        console.log(`Calendar now shows: Month=${currentMonth + 1}, Year=${currentYear}`);

        await page.waitForTimeout(500);
      }

      try {
        const targetDaySelector = `button.MuiPickersDay-root:not(.MuiPickersDay-hiddenDaySpacingFiller):text("${targetDay}")`;
        await page.locator(targetDaySelector).click();
        console.log(`Selected day ${targetDay}`);
      } catch (error) {
        console.log(`Error selecting day: ${error.message}`);

        const dayButtons = await page.locator('button.MuiPickersDay-root:not(.MuiPickersDay-hiddenDaySpacingFiller)').all();
        let found = false;

        for (const button of dayButtons) {
          const text = await button.textContent();
          if (text != null && text.trim() === String(targetDay)) {
            await button.click();
            found = true;
            console.log(`Found and clicked day ${targetDay} using fallback method`);
            break;
          }
        }

        if (!found) {
          console.log(`Could not select day ${targetDay}, will proceed with current selection`);
        }
      }
    } else {
      console.log('Could not find the second date picker');
    }

    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station maintenance', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC modify station maintenance');
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('edit-action').click();
    await page
      .locator('div')
      .filter({ hasText: /^Dalle ore$/ })
      .getByLabel('Choose time')
      .click();
    await page.locator('.MuiClock-squareMask').click();
    await page.locator('.MuiClock-squareMask').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC opens station maintenance details', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC opens station maintenance details');
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('detail-action').click();
    await page.getByTestId('back-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC deletes station maintenance', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC deletes station maintenance');
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('delete-action').click();
    await page.getByRole('button', { name: 'Conferma' }).click();
    await checkReturnHomepage(page);
  });
});
