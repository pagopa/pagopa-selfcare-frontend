import { store } from '../../redux/store';
import { ENV } from '../../utils/env';

export const isOperator = (): boolean => {
  const user = store.getState().user.logged;
  const email = typeof user !== 'undefined' ? user.email : '';
  return ENV.PAGOPA_OPERATOR.MAIL_ADDRESSES.split(';').includes(email);
};

export const splitURL = (targetURL: string) => {
  try {
    const url = new URL(targetURL);
    return {
      protocolSplit: url.protocol,
      hostSplit: url.hostname,
      portSplit: Number(url.port),
      pathSplit: url.pathname + url.search + url.hash,
    };
  } catch (e) {
    console.error(e);
  }
  return {
    protocolSplit: '',
    hostSplit: '',
    portSplit: 0,
    pathSplit: '',
  };
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true; // L'URL è valido
  } catch (error) {
    return false; // L'URL non è valido
  }
};

export const extractStringAndNumber = (input: string): { host: string; port: number } | null => {
  const regex = /'([^']+)'\s*(\d+)/;

  const matches = input.match(regex);

  if (matches && matches.length === 3) {
    const host = matches[1];
    const port = parseInt(matches[2], 10);

    return { host, port };
  }

  return null;
};
