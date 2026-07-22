// DOM utilities

export enum WaitForElementResult {
  DOM_ELEMENT_ALREADY_EXISTS = 'DOM_ELEMENT_ALREADY_EXISTS',
  DOM_ELEMENT_FOUND = 'DOM_ELEMENT_FOUND',
}

/** Waits for existing element in DOM
 * @param {string} selector The selector to observe
 *
 * @example
 * // waits for myQuerySelector to be injected in the DOM.
 * waitForElem('.myQuerySelector').then(() => successCbk());
 */
export function waitForElement(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(WaitForElementResult.DOM_ELEMENT_ALREADY_EXISTS);
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        return resolve(WaitForElementResult.DOM_ELEMENT_FOUND);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

let bodyScrollLockCount = 0;

export function lockBodyScroll(): void {
  bodyScrollLockCount += 1;
  // eslint-disable-next-line functional/immutable-data
  document.body.style.overflow = 'hidden';
}

export function unlockBodyScroll(): void {
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
  if (bodyScrollLockCount === 0) {
    // eslint-disable-next-line functional/immutable-data
    document.body.style.overflow = '';
  }
}