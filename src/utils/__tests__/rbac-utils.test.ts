import { mockedInstitutionDetailResource } from '../../services/__mocks__/institutionsService';
import * as ApiKeyService from '../../services/apiKeyService';
import { hasGeneratedApiKey } from '../rbac-utils';

describe('rbac-utils test', () => {
  test('Test hasGeneratedApiKey', async () => {
    const spyOn = jest
      .spyOn(ApiKeyService, 'getInstitutionApiKeys')
      .mockReturnValue(new Promise((resolve) => resolve(mockedInstitutionDetailResource)));
    expect(
      hasGeneratedApiKey({
        description: '',
        externalId: '',
        fiscalCode: '',
        origin: '',
        digitalAddress: '',
        partyId: '',
        status: 'PENDING',
        originId: '',
        roles: [],
        registeredOffice: '',
        institutionType: '',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
