import { Page } from '@playwright/test';
import { changeToPspUser, checkReturnHomepage } from './e2eUtils';

export const DEFAULT_CHANNEL_IDS = ['99999000011_20', '99999000011_19', '99999000011_18'];

/**
 * Prepares an array of channel IDs to test, with the current channel first
 * @param currentId Current channel ID being tested
 * @returns Array of channel IDs to try
 */
export const prepareChannelIds = (currentId: string) => {
  const ids = [currentId];
  if (currentId !== '99999000011_20') {
    return ids.concat(DEFAULT_CHANNEL_IDS);
  }
  return ids;
};

/**
 * Checks if a channel is visible in the search results
 * @param page Playwright page
 * @param channelId Channel ID to search for
 * @returns Promise<boolean> True if channel is visible
 */
export const isChannelVisibleInSearch = async (page: Page, channelId: string): Promise<boolean> => {
  await page.waitForSelector('[data-testid="search-input"]', { state: 'visible', timeout: 10000 });
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').clear();
  await page.getByTestId('search-input').fill(channelId);
  await page.waitForTimeout(2000);

  return await page.getByText(channelId, { exact: false })
    .isVisible({ timeout: 3000 })
    .catch(() => false);
};

/**
 * Finds an approvable channel from a list of channel IDs
 * @param page Playwright page
 * @param channelIdsToTry Array of channel IDs to try
 * @returns Object with channelFound and foundChannelId
 */
export const findApprovableChannel = async (page: Page, channelIdsToTry: Array<string>) => {
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

/**
 * Fills the primitive version field in the form
 * @param page Playwright page
 * @returns Promise<boolean> Success status
 */
export const fillPrimitiveField = async (page: Page): Promise<boolean> => {
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

/**
 * Fills the password field in the form
 * @param page Playwright page
 * @returns Promise<boolean> Success status
 */
export const fillPasswordField = async (page: Page): Promise<boolean> => {
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

/**
 * Clicks the confirm button in the form
 * @param page Playwright page
 * @returns Promise<boolean> Success status
 */
export const clickConfirmButton = async (page: Page): Promise<boolean> => {
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

/**
 * Searches for a channel from a list of channel IDs
 * @param page Playwright page
 * @param channelIds Array of channel IDs to search for
 * @returns Object with channelFound and targetChannelId
 */
export const searchForChannel = async (page: Page, channelIds: Array<string>) => {
  // eslint-disable-next-line functional/no-let
  let channelFound = false;
  // eslint-disable-next-line functional/no-let
  let foundChannelId = '';

  for (const id of channelIds) {
    const isFound = await isChannelVisibleInSearch(page, id);
    if (isFound) {
      channelFound = true;
      foundChannelId = id;
      break;
    }
  }

  return { channelFound, targetChannelId: foundChannelId };
};

/**
 * Navigates to PSP channels
 * @param page Playwright page
 */
export const navigateToPspChannels = async (page: Page): Promise<void> => {
  await changeToPspUser(page);
  await page.getByTestId('channels-test').click();
};

/**
 * Prepares channel search by navigating to PSP channels and searching for a channel
 * @param page Playwright page
 * @param currentChannelId Current channel ID
 * @returns Result of channel search
 */
export const prepareChannelSearch = async (page: Page, currentChannelId: string) => {
  await navigateToPspChannels(page);

  const channelIdsToTry = [currentChannelId];
  if (currentChannelId !== '99999000011_20') {
    for (const id of DEFAULT_CHANNEL_IDS) {
      if (!channelIdsToTry.includes(id)) {
        channelIdsToTry.push(id); // eslint-disable-line functional/immutable-data
      }
    }
  }

  return await searchForChannel(page, channelIdsToTry);
};

/**
 * Finds and clicks on a PSP option
 * @param page Playwright page
 * @returns Promise<boolean> Success status
 */
export const findAndClickPsp = async (page: Page): Promise<boolean> => {
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

/**
 * Handles dropdown selection
 * @param page Playwright page
 * @param dropdownLabel Label of the dropdown
 */
export const handleDropdown = async (page: Page, dropdownLabel: string): Promise<void> => {
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
};

/**
 * Navigates to Pagopa channels
 * @param page Playwright page
 * @returns Promise<boolean> Success status
 */
export const navigateToPagopaCannels = async (page: Page): Promise<boolean> => {
  try {
    await changeToPspUser(page, true);
    await page.getByTestId('channels-test').click();
    return true;
  } catch (error) {
    console.error('Error navigating to channels as Pagopa Operator:', error);
    return false;
  }
};