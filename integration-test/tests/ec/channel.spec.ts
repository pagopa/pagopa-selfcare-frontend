import { Page, test, expect } from '@playwright/test';
import { changeToPspUser, checkReturnHomepage } from '../utils/e2eUtils';
import {
  prepareChannelIds,
  isChannelVisibleInSearch,
  createChannelAsPsp,
  prepareChannelSearch,
  findAndClickPsp
} from '../utils/channelUtils';

test.setTimeout(100000);
test.describe.serial('Channel flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let channelId: string;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: ec/channel.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete channel
    await page.close();
  });

  test('PSP creates channel', async () => {
    console.log('🚀 STARTING TEST: PSP creates channel');
    channelId = await createChannelAsPsp(page);
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  test('PSP modify channel', async () => {
    console.log('🚀 STARTING TEST: PSP modify channel');

    await test.step('Navigate to channels as PSP user', async () => {
      await changeToPspUser(page);
      await page.getByTestId('channels-test').click();
      await page.getByTestId('tab-toBeValidated').click();
    });

    const channelIdsToTry = prepareChannelIds(channelId);

    // eslint-disable-next-line functional/no-let
    let channelFound = false;
    // eslint-disable-next-line functional/no-let
    let channelIsEditable = false;

    for (const idToTry of channelIdsToTry) {
      await test.step(`Searching for channel ${idToTry}`, async () => {
        const isFound = await isChannelVisibleInSearch(page, idToTry);
        if (!isFound) {
          return;
        }

        channelFound = true;

        await page.getByLabel('more').click();
        await page.getByRole('link', { name: 'Gestisci canale' }).click();
        await page.waitForTimeout(2000);

        const warningText = "Attenzione il canale ha delle modifiche in corso";
        const hasWarning = await page.evaluate((text) => {
          const pageContent = document.body.textContent?.toLowerCase() || '';
          return pageContent.includes(text.toLowerCase());
        }, warningText).catch(() => false);

        if (hasWarning) {
          await page.getByTestId('back-button-test').click();
          await page.waitForTimeout(1000);
          return;
        }

        const modifyButton = page.getByRole('link', { name: 'Modifica' });
        const isModifyVisible = await modifyButton.isVisible({ timeout: 5000 })
          .catch(() => false);

        if (!isModifyVisible) {
          await page.getByTestId('back-button-test').click();
          await page.waitForTimeout(1000);
          return;
        }

        channelIsEditable = true;

        if (idToTry !== channelId) {
          channelId = idToTry;
        }
      });

      if (channelIsEditable) {
        break;
      }
    }

    expect(channelFound, 'no channel found in any of the attempts').toBe(true);
    expect(channelIsEditable, 'found channels, but none are editable').toBe(true);

    await test.step('Modify the channel', async () => {
      await page.getByRole('link', { name: 'Modifica' }).click();
      await page.getByTestId('target-union-test').click();
      await page.getByTestId('target-union-test').clear();
      await page.getByTestId('target-union-test').fill('https://test.it:81/');
      await page.getByRole('button', { name: 'Conferma' }).click();
      await page.getByTestId('confirm-button-modal-test').click();
      await checkReturnHomepage(page);
    });
  });

  test('PSP associate another PSP to Channel', async () => {
    const result = await prepareChannelSearch(page, channelId);

    expect(result.channelFound, 'no channel found in any of the attempts').toBe(true);

    if (result.targetChannelId !== channelId) {
      channelId = result.targetChannelId;
    }

    await test.step('Associate another PSP to the channel', async () => {
      await page.getByLabel('more').click();
      await page.getByRole('link', { name: 'Gestisci PSP' }).click();
      await page.waitForTimeout(2000);

      await (async () => {
        try {
          const blueButton = page.locator('button, a').filter({ hasText: 'Associa PSP' }).first();
          await blueButton.click({ timeout: 5000 });
          return;
        } catch (error) {
          console.error('First method failed:', error);
        }

        try {
          await page.getByTestId('associate-psp-button').click({ timeout: 3000 });
          return;
        } catch (error) {
          console.error('Second method failed:', error);
        }

        try {
          const associaLink = page.locator('a').filter({ hasText: 'Associa PSP' }).last();
          await associaLink.click({ timeout: 3000 });
          return;
        } catch (error) {
          console.error('Third method failed:', error);
        }

        await page.goto(`/ui/channels/${channelId}/associate-psp`);
      })();

      await page.waitForTimeout(2000);

      const isSearchVisible = await page.getByTestId('psp-selection-search').isVisible({ timeout: 5000 })
        .catch(() => false);

      expect(isSearchVisible, 'PSP search field not visible').toBe(true);

      await page.getByTestId('psp-selection-search').click();
      await page.keyboard.insertText("PSP DEMO");

      await page.waitForTimeout(2000);

      expect(await findAndClickPsp(page), 'no PSP option found').toBe(true);

      await page.getByTestId('confirm-btn-test').click();
      await checkReturnHomepage(page);
    });
  });

  test('PSP dissociate another PSP from Channel', async () => {
    const result = await prepareChannelSearch(page, channelId);

    expect(result.channelFound, 'no channel found in any of the attempts').toBe(true);

    if (result.targetChannelId !== channelId) {
      channelId = result.targetChannelId;
    }

    await test.step('Dissociate PSP from the channel', async () => {
      const moreButton = page.getByLabel('more');
      await moreButton.click();
      const managePspLink = page.getByRole('link', { name: 'Gestisci PSP' });
      await managePspLink.click();
      await page.waitForTimeout(2000);

      const dissociateButton = page.getByTestId('dissociate-99999000011');
      await expect(dissociateButton).toBeVisible({ timeout: 5000 });

      await dissociateButton.click();

      const confirmButton = page.getByRole('button', { name: 'Dissocia PSP' });
      await expect(confirmButton).toBeVisible({ timeout: 5000 });

      await confirmButton.click();
      await checkReturnHomepage(page);
    });
  });
});
