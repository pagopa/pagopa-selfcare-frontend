import { BackofficeApi } from '../../api/BackofficeClient';
import { mockedPaymentTypes } from '../__mocks__/configurationService';
import { getPaymentTypes } from '../configurationService';

describe('ConfigurationService test mocked', () => {
  test('Test getPaymentTypes', async () => {
    const response = await getPaymentTypes();
    expect(response).toMatchObject(mockedPaymentTypes);
  });
});

describe('ConfigurationService test client', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getPaymentTypes', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getPaymentTypes')
      .mockReturnValue(Promise.resolve({ payment_types: [] }));
    expect(getPaymentTypes()).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
