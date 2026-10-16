import { ENV } from '../../utils/env';
import { mockedTokenExchange } from '../__mocks__/tokenExchangeService';
import { fetchPagoPAToken } from '../tokenExchangeService';

describe('fetchPagoPAToken', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns the mocked response when REACT_APP_API_MOCK_BACKOFFICE is true', async () => {
    process.env.REACT_APP_API_MOCK_BACKOFFICE = 'true';

    const response = await fetchPagoPAToken('identity-token');

    expect(response).toBe(mockedTokenExchange);
  });

  test('calls fetch without a desidered_role query param when desiredRole is not provided', async () => {
    process.env.REACT_APP_API_MOCK_BACKOFFICE = 'false';
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ status: 200 } as Response);

    await fetchPagoPAToken('identity-token');

    expect(fetchSpy).toHaveBeenCalledWith(ENV.URL_API.TOKEN, {
      method: 'POST',
      mode: 'cors',
      headers: {
        accept: 'application/json',
        IdentityToken: 'identity-token',
      },
    });
  });

  test('appends the desidered_role query param when desiredRole is provided', async () => {
    process.env.REACT_APP_API_MOCK_BACKOFFICE = 'false';
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ status: 200 } as Response);

    await fetchPagoPAToken('identity-token', 'admin-psp');

    expect(fetchSpy).toHaveBeenCalledWith(
      `${ENV.URL_API.TOKEN}?desidered_role=admin-psp`,
      expect.objectContaining({
        headers: expect.objectContaining({ IdentityToken: 'identity-token' }),
      })
    );
  });
});
