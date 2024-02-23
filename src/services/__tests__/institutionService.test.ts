
import { mockedDelegatedPSP } from '../__mocks__/channelService';
import { getBrokerDelegation } from '../__mocks__/institutionsService';

// jest.mock('../../api/BackofficeClient');

describe('ChannelService test', () => {
  test('Test getBrokerDelegation', async () => {
    const delegates = await getBrokerDelegation();
    expect(delegates).toMatchObject(mockedDelegatedPSP);
  });
});
