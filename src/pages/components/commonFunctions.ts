import { store } from '../../redux/store';
import { ENV } from '../../utils/env';

export const isOperator = (): boolean => {
  const user = store.getState().user.logged;
  const email = typeof user !== 'undefined' ? user.email : '';
  return ENV.PAGOPA_OPERATOR.MAIL_ADDRESSES.split(';').includes(email);
};

export const splitURL = (url: string | undefined) => {
  if (url) {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol;
    const host = urlObj.hostname;
    const path = urlObj.pathname;
    const port = urlObj.port || undefined;

    return {
      protocol,
      host,
      path,
      port,
    };
  } else {
    return;
  }
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true; // L'URL è valido
  } catch (error) {
    return false; // L'URL non è valido
  }
};
