import {ENV} from '../utils/env';
import {mockedTokenExchange} from './__mocks__/tokenExchangeService';

const withDesiredRole = (url: string, desiredRole?: string): string => {
    if (!desiredRole) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${new URLSearchParams({desidered_role: desiredRole}).toString()}`;
};

export const fetchPagoPAToken = (identity_token: string, desiredRole?: string): Promise<Response> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return new Promise((resolve) => resolve(mockedTokenExchange));
    } else {
        return fetch(withDesiredRole(ENV.URL_API.TOKEN, desiredRole), {
            method: 'POST',
            mode: 'cors',
            headers: {
                accept: 'application/json',
                IdentityToken: identity_token,
            },
        });
    }
};
