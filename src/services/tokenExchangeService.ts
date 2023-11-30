import { ENV } from '../utils/env';
import { mockedTokenExchange } from './__mocks__/tokenExchangeService';

export const fetchPagoPAToken = (identity_token: string): Promise<Response> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve(mockedTokenExchange));
  } else {
    return fetch(ENV.URL_API.TOKEN, {
      method: 'POST',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        IdentityToken: identity_token,
      },
    });
  }
};
