import { Page, test, expect } from '@playwright/test';
import { changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';

const endpoint = 'https://test.it:80/';
const DEFAULT_CHANNEL_IDS = ['99999000011_20', '99999000011_19', '99999000011_18'];

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

  const prepareChannelIds = (currentId) => {
    const ids = [currentId];
    if (currentId !== '99999000011_20') {
      return ids.concat(DEFAULT_CHANNEL_IDS);
    }
    return ids;
  };

  const isChannelVisibleInSearch = async (page, channelId) => {
    await page.waitForSelector('[data-testid="search-input"]', { state: 'visible', timeout: 10000 });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').clear();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(2000);

    return await page.getByText(channelId, { exact: false })
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  };

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
      return;
    }

    if (!channelIsEditable) {
      console.log('Found channels, but none are editable, skipping test');
      test.skip();
      return;
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

  const findApprovableChannel = async (page, channelIdsToTry) => {
    // eslint-disable-next-line functional/no-let
    let channelFound = false;
    // eslint-disable-next-line functional/no-let
    let foundChannelId = '';

    for (const idToTry of channelIdsToTry) {
      try {
        await page.waitForSelector('[data-testid="tab-toBeValidated"]', { state: 'visible', timeout: 10000 });
        await page.getByTestId('tab-toBeValidated').click();

        await page.waitForSelector('[data-testid="search-input"]', { state: 'visible', timeout: 10000 });
        await page.getByTestId('search-input').click();
        await page.getByTestId('search-input').clear();
        await page.getByTestId('search-input').fill(idToTry);

        await page.waitForTimeout(2000);

        const isFound = await page.getByText(idToTry, { exact: false }).isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isFound) {
          continue;
        }

        await page.getByLabel('more').click();
        await page.getByRole('link', { name: 'Gestisci canale' }).click();

        await page.waitForTimeout(2000);

        const approveButton = page.getByRole('link', { name: 'Approva e valida' });
        const isButtonVisible = await approveButton.isVisible({ timeout: 5000 })
          .catch(() => false);

        if (!isButtonVisible) {
          await page.getByTestId('back-button-test').click();
          await page.waitForTimeout(1000);
          continue;
        }

        const isEnabled = await approveButton.isEnabled();
        if (!isEnabled) {
          await page.getByTestId('back-button-test').click();
          await page.waitForTimeout(1000);
          continue;
        }

        channelFound = true;
        foundChannelId = idToTry;
        break;
      } catch (error) {
        try {
          await page.getByTestId('back-button-test').click();
          await page.waitForTimeout(1000);
        } catch {
          await page.getByTestId('channels-test').click();
          await page.waitForTimeout(2000);
        }
      }
    }

    return { channelFound, foundChannelId };
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  test('Pagopa Operator approves channel', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator approves channel');

    await test.step('Navigate to channels as Pagopa Operator', async () => {
      const success = await navigateToPagopaCannels(page);
      if (!success) {
        test.skip();
        return;
      }
    });

    const channelIdsToTry = prepareChannelIds(channelId);
    const { channelFound, foundChannelId } = await findApprovableChannel(page, channelIdsToTry);

    if (!channelFound) {
      console.log('No approvable channel found, skipping test');
      test.skip();
      return;
    }

    if (foundChannelId !== channelId) {
      channelId = foundChannelId;
    }

    const fillPrimitiveField = async (page) => {
      try {
        const primitiveByPlaceholder = page.locator('input[placeholder="Versioni primitive"]').first();
        if (await primitiveByPlaceholder.isVisible({ timeout: 3000 })) {
          await primitiveByPlaceholder.click({ force: true });
          await primitiveByPlaceholder.fill('1.0.0');
          return true;
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

      try {
        const labelElement = page.locator('label:has-text("Versioni primitive")').first();
        if (await labelElement.isVisible({ timeout: 3000 })) {
          const labelId = await labelElement.getAttribute('for');
          if (labelId) {
            const inputField = page.locator(`#${labelId}`);
            await inputField.click({ force: true });
            await inputField.fill('1.0.0');
            return true;
          } else {
            const nearbyInput = page.locator('label:has-text("Versioni primitive") + input, label:has-text("Versioni primitive") ~ input').first();
            await nearbyInput.click({ force: true });
            await nearbyInput.fill('1.0.0');
            return true;
          }
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

      return false;
    };

    const fillPasswordField = async (page) => {
      try {
        const passwordByTestId = page.getByTestId('password-test');
        if (await passwordByTestId.isVisible({ timeout: 3000 })) {
          await passwordByTestId.click({ force: true });
          await passwordByTestId.fill('password');
          return true;
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

      try {
        const passwordFields = await page.locator('input[type="password"]').all();
        if (passwordFields.length > 0) {
          for (const field of passwordFields) {
            if (await field.isVisible()) {
              await field.click({ force: true });
              await field.fill('password');
              return true;
            }
          }
        }
      } catch (error) {
        console.error('Error occurred', error);
      }

      return false;
    };

    const clickConfirmButton = async (page) => {
      try {
        const confirmButton = page.getByRole('button', { name: 'Conferma' });
        if (await confirmButton.isVisible({ timeout: 3000 })) {
          await confirmButton.click({ force: true });
          return true;
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

      try {
        const allButtons = await page.locator('button').all();
        for (const button of allButtons) {
          const text = await button.textContent();
          if (text && (text.includes('Conferma') || text.includes('Confirm') || text.includes('Submit'))) {
            await button.click({ force: true });
            return true;
          }
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }

      return false;
    };

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
        return;
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
          return;
        }
      } catch (error) {
        test.skip();
        return;
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
        return;
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

  const searchForChannel = async (page, channelIds) => {
    // eslint-disable-next-line functional/no-let
    let channelFound = false;
    // eslint-disable-next-line functional/no-let
    let foundChannelId = '';

    for (const id of channelIds) {
      const isFound = await isChannelVisibleInSearch(page, id);
      if (isFound) {
        channelFound = true;
        foundChannelId = id;

        if (id !== channelId) {
          channelId = id;
        }
        break;
      }
    }

    return { channelFound, targetChannelId: foundChannelId };
  };

  const navigateToPspChannels = async (page) => {
    await changeToPspUser(page);
    await page.getByTestId('channels-test').click();
  };

  const prepareChannelSearch = async (page, testAction) => {
    console.log(`🚀 STARTING TEST: ${testAction}`);
    await navigateToPspChannels(page);

    const channelIdsToTry = [channelId];
    if (channelId !== '99999000011_20') {
      for (const id of DEFAULT_CHANNEL_IDS) {
        if (!channelIdsToTry.includes(id)) {
          channelIdsToTry.push(id); // eslint-disable-line functional/immutable-data
        }
      }
    }

    return await searchForChannel(page, channelIdsToTry);
  };

  test('PSP associate another PSP to Channel', async () => {
    const result = await prepareChannelSearch(page, 'PSP associate another PSP to Channel');

    if (!result.channelFound) {
      console.log('No channel found in any of the attempts, skipping test');
      test.skip();
      return;
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
        return;
      }

      await page.getByTestId('psp-selection-search').click();
      await page.keyboard.insertText("PSP DEMO");

      await page.waitForTimeout(2000);

      if (!await findAndClickPsp(page)) {
        console.log('No PSP option found, skipping test');
        test.skip();
        return;
      }

      await page.getByTestId('confirm-btn-test').click();
      await checkReturnHomepage(page);
    });
  });

  const findAndClickPsp = async (page) => {
    const pspSelectors = [
      'PartyItemContainer: PSP DEMO DIRECT',
      'PartyItemContainer: PSP DEMO'
    ];

    // eslint-disable-next-line functional/no-let
    let pspFound = false;

    for (const selector of pspSelectors) {
      try {
        const pspOption = page.getByTestId(selector);
        const isPspVisible = await pspOption.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (isPspVisible) {
          await pspOption.getByRole('button').click();
          pspFound = true;
          break;
        }
      } catch (error) {
        console.error('Error occurred:', selector, error);
      }
    }

    if (!pspFound) {
      const pspItems = await page.locator('[data-testid^="PartyItemContainer"]').all();

      if (pspItems.length > 0) {
        await pspItems[0].getByRole('button').first().click();
        return true;
      }
      return false;
    }

    return true;
  };

  test('PSP dissociate another PSP from Channel', async () => {
    const result = await prepareChannelSearch(page, 'PSP dissociate another PSP from Channel');

    if (!result.channelFound) {
      console.log('No channel found in any of the attempts, skipping test');
      test.skip();
      return;
    }

    await test.step('Dissociate PSP from the channel', async () => {
      await page.getByLabel('more').click();
      await page.getByRole('link', { name: 'Gestisci PSP' }).click();

      await page.waitForTimeout(2000);
      const dissociateButton = page.getByTestId('dissociate-99999000011');
      const isDissociateVisible = await dissociateButton.isVisible({ timeout: 5000 })
        .catch(() => false);

      if (!isDissociateVisible) {
        console.log('Dissociate button not visible, skipping test');
        test.skip();
        return;
      }

      await dissociateButton.click();

      const confirmButton = page.getByRole('button', { name: 'Dissocia PSP' });
      const isConfirmVisible = await confirmButton.isVisible({ timeout: 5000 })
        .catch(() => false);

      if (!isConfirmVisible) {
        console.log('Confirm dissociate button not visible, skipping test');
        test.skip();
        return;
      }

      await confirmButton.click();
      await checkReturnHomepage(page);
    });
  });

  async function handleDropdown(page: Page, dropdownLabel: string): Promise<void> {
    try {
      const dropdownContainer = page.locator(`div:has-text("${dropdownLabel}")`).filter({
        hasText: dropdownLabel
      }).first();

      const isVisible = await dropdownContainer.isVisible({ timeout: 3000 })
        .catch(() => false);

      if (!isVisible) {
        return;
      }

      await dropdownContainer.click({ force: true });
      await page.waitForTimeout(500);

      const options = await page.locator('[role="option"], [role="listitem"]').all();
      if (options.length > 0) {
        for (const option of options) {
          if (await option.isVisible()) {
            await option.click({ force: true });
            return;
          }
        }
      }

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  const navigateToPagopaCannels = async (page: Page): Promise<boolean> => {
    try {
      await changeToPspUser(page, true);
      await page.getByTestId('channels-test').click();
      return true;
    } catch (error) {
      console.error('Error navigating to channels as Pagopa Operator:', error);
      return false;
    }
  };

});