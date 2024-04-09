import { BackofficeApi } from '../../api/BackofficeClient';
import { getCreditorInstitutionContacts } from '../creditorInstitutionService';

describe('BrokerService test client', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getCreditorInstitutionContacts', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi, 'getCreditorInstitutionContacts')
      .mockReturnValue(new Promise((resolve) => resolve([])));
    expect(getCreditorInstitutionContacts('ciTaxCode', 'institutionId')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
