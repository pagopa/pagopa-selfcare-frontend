

import { getBrokerDelegation, mockedDelegatedPSP } from '../__mocks__/institutionsService';

// jest.mock('../../api/BackofficeClient');

describe('InstitutionService test', () => {
  test('Test getBrokerDelegation', async () => {
    const delegates = await getBrokerDelegation();
    expect(delegates).toMatchObject(mockedDelegatedPSP);
  });
});
