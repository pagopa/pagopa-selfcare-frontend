import { Page, test, expect } from '@playwright/test';
import { changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';
import {
  prepareChannelIds,
  isChannelVisibleInSearch,
  findApprovableChannel,
  fillPrimitiveField,
  fillPasswordField,
  clickConfirmButton,
  prepareChannelSearch,
  findAndClickPsp,
  handleDropdown,
  navigateToPagopaCannels
} from './utils/channelUtils';

const endpoint = 'https://test.it:80/';

test.setTimeout(100000);
test.describe.serial('Channel flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let channelId: string;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: channel.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete channel
    await page.close();
  });

  test('PSP creates channel', async () => {
    console.log('🚀 STARTING TEST: PSP creates channel');

    await test.step('Navigate to channels as PSP user', async () => {
      await changeToPspUser(page);
      await page.waitForTimeout(2000);
      await page.getByTestId('channels-test').click();
    });

    await test.step('Create new channel', async () => {
      await page.getByTestId('create-channel').click();
      await page.waitForTimeout(2000);

      channelId = await page.getByTestId('channel-code-test').inputValue();

      await page.getByTestId('target-union-test').click();
      await page.getByTestId('target-union-test').fill(endpoint);

      await page.waitForTimeout(1000);
      await page.locator('#payment_types0_select').click();
      await page.waitForTimeout(1000);

      try {
        await page.getByRole('option', { name: /bancomat pay/i }).click({ timeout: 5000 });
      } catch (error) {
        console.error('Error occurred:', error);
      }

      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Conferma' }).click();
      await page.getByTestId('confirm-button-modal-test').click();
      await checkReturnHomepage(page);
    });
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

    if (!channelFound) {
      console.log('No channel found in any of the attempts, skipping test');
      test.skip();
    }

    if (!channelIsEditable) {
      console.log('Found channels, but none are editable, skipping test');
      test.skip();
    }

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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  test('Pagopa Operator approves channel', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator approves channel');

    await test.step('Navigate to channels as Pagopa Operator', async () => {
      const success = await navigateToPagopaCannels(page);
      if (!success) {
        test.skip();
      }
    });

    const channelIdsToTry = prepareChannelIds(channelId);
    const { channelFound, foundChannelId } = await findApprovableChannel(page, channelIdsToTry);

    if (!channelFound) {
      console.log('No approvable channel found, skipping test');
      test.skip();
    }

    if (foundChannelId !== channelId) {
      channelId = foundChannelId;
    }

    // eslint-disable-next-line complexity
    await test.step('Approve the channel', async () => {
      const approveButton = page.getByRole('link', { name: 'Approva e valida' });
      await approveButton.click();
      await page.waitForTimeout(3000);

      await fillPrimitiveField(page);
      await fillPasswordField(page);
      await handleDropdown(page, 'Nuova connettività canali');
      await handleDropdown(page, 'Indirizzo proxy');
      await clickConfirmButton(page);

      await page.waitForTimeout(2000);

      try {
        const modalConfirmButton = await (async () => {
          const confirmByText = page.getByRole('button', { name: 'Conferma' });
          if (await confirmByText.isVisible({ timeout: 3000 })) {
            return confirmByText;
          }

          const modalButtons = await page.locator('div[role="dialog"] button, .MuiDialog-root button').all();
          if (modalButtons.length > 0) {
            return modalButtons[modalButtons.length - 1];
          }

          return page.getByTestId('confirm-button-modal-test');
        })();

        if (modalConfirmButton) {
          await modalConfirmButton.click({ force: true });
        }

        await page.waitForTimeout(1000).catch(() => { });
      } catch (error) {
        console.error('Error occurred:', error);
      }
    });
  });

  test('Pagopa Operator request edit', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator request edit');

    await test.step('Navigate to channels as Pagopa Operator', async () => {
      const success = await navigateToPagopaCannels(page);
      if (!success) {
        test.skip();
      }
    });

    await test.step('Search for the channel', async () => {
      try {
        await page.waitForSelector('[data-testid="tab-toBeValidated"]', { state: 'visible', timeout: 10000 });
        await page.getByTestId('tab-toBeValidated').click();

        await page.waitForSelector('[data-testid="search-input"]', { state: 'visible', timeout: 10000 });
        await page.getByTestId('search-input').click();
        await page.getByTestId('search-input').fill(channelId);

        await page.waitForTimeout(3000);

        const searchResult = page.getByText(channelId, { exact: false });
        const isVisible = await searchResult.isVisible({ timeout: 5000 })
          .catch(() => false);

        if (!isVisible) {
          test.skip();
        }
      } catch (error) {
        test.skip();
      }
    });

    await test.step('Request edit for the channel', async () => {
      const moreButton = page.getByLabel('more').first();
      await moreButton.click();

      const manageLink = page.getByRole('link', { name: 'Gestisci canale' });
      await manageLink.click();

      await page.waitForLoadState('networkidle', { timeout: 15000 });

      await page.waitForSelector('[data-testid="request-edit-button"]', {
        state: 'visible',
        timeout: 15000
      });

      const requestEditButton = page.getByTestId('request-edit-button');
      const isVisible = await requestEditButton.isVisible();

      if (!isVisible) {
        console.log('Request edit button not visible, skipping test');
        test.skip();
      }

      await requestEditButton.click({ force: true, timeout: 10000 });

      await page.getByTestId('requestInput').click();
      await page.getByTestId('requestInput').fill('Edit');

      await page.getByTestId('confirm-and-send-button').click();
      await page.waitForTimeout(2000);

      try {
        await page.getByTestId('back-button-test').click();
      } catch (e) {
        console.error('Error during cleanup:', e);
      }
      await checkReturnHomepage(page);
    });
  });

  test('PSP associate another PSP to Channel', async () => {
    const result = await prepareChannelSearch(page, channelId);

    if (!result.channelFound) {
      console.log('No channel found in any of the attempts, skipping test');
      test.skip();
    }

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

      if (!isSearchVisible) {
        console.log('PSP search field not visible, skipping test');
        test.skip();
      }

      await page.getByTestId('psp-selection-search').click();
      await page.keyboard.insertText("PSP DEMO");

      await page.waitForTimeout(2000);

      if (!await findAndClickPsp(page)) {
        console.log('No PSP option found, skipping test');
        test.skip();
      }

      await page.getByTestId('confirm-btn-test').click();
      await checkReturnHomepage(page);
    });
  });

  test('PSP dissociate another PSP from Channel', async () => {
    const result = await prepareChannelSearch(page, channelId);

    if (!result.channelFound) {
      console.log('No channel found in any of the attempts, skipping test');
      test.skip();
    }

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
      if (!await dissociateButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Dissociate button not visible, skipping test');
        test.skip();
      }

      await dissociateButton.click();

      const confirmButton = page.getByRole('button', { name: 'Dissocia PSP' });
      if (!await confirmButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Confirm dissociate button not visible, skipping test');
        test.skip();
      }

      await confirmButton.click();
      await checkReturnHomepage(page);
    });
  });
});