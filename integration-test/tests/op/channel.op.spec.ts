import { Page, test, expect } from '@playwright/test';
import { changeToOperatorOnPsp, checkReturnHomepage } from '../utils/e2eUtils';
import {
  createChannelAsPsp,
  findApprovableChannel,
  fillPrimitiveField,
  fillPasswordField,
  clickConfirmButton,
  handleDropdown
} from '../utils/channelUtils';

/**
 * PagoPA operator flow on channels.
 *
 * An operator cannot create channels, so the setup creates two of them as PSP
 * (this is the only place this suite runs as PSP): one for each operator test,
 * so the tests do not depend on each other's outcome.
 */
test.setTimeout(100000);
test.describe.serial('Channel flow (PagoPA operator)', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let channelToApprove = '';
  // eslint-disable-next-line functional/no-let
  let channelToRequestEdit = '';

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: op/channel.op.spec.ts');
    test.setTimeout(240000);
    page = await browser.newPage({ storageState: undefined });

    console.log('🔧 SETUP: PSP creates the channels the operator will work on');
    channelToApprove = await createChannelAsPsp(page);
    channelToRequestEdit = await createChannelAsPsp(page);
  });

  test.afterAll(async () => {
    // TODO delete channels
    await page.close();
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  test('Pagopa Operator approves channel', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator approves channel');

    await changeToOperatorOnPsp(page);
    await page.getByTestId('channels-test').click();

    const { channelFound } = await findApprovableChannel(page, [channelToApprove]);
    expect(channelFound, `channel ${channelToApprove} not approvable by the operator`).toBe(true);

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

    await changeToOperatorOnPsp(page);
    await page.getByTestId('channels-test').click();

    await test.step('Search for the channel', async () => {
      await page.getByTestId('tab-toBeValidated').click();

      await page.getByTestId('search-input').waitFor({ state: 'visible', timeout: 10000 });
      await page.getByTestId('search-input').click();
      await page.getByTestId('search-input').fill(channelToRequestEdit);

      await page.waitForTimeout(3000);

      await expect(
        page.getByText(channelToRequestEdit, { exact: false }),
        `channel ${channelToRequestEdit} not found in "To Be Validated" tab`
      ).toBeVisible({ timeout: 5000 });
    });

    await test.step('Request edit for the channel', async () => {
      await page.getByLabel('more').first().click();
      await page.getByRole('link', { name: 'Gestisci canale' }).click();

      await page.waitForLoadState('networkidle', { timeout: 15000 });

      // Only rendered for an operator on a channel waiting for validation.
      const requestEditButton = page.getByTestId('request-edit-button');
      await expect(requestEditButton).toBeVisible({ timeout: 15000 });

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
});
