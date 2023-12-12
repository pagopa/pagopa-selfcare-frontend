import { getBrokerDelegation } from '../channelService';
import { mockedDelegatedPSP } from '../__mocks__/channelService';

// jest.mock('../../api/BackofficeClient');

describe('ChannelService test', () => {
  test('Test getBrokerDelegation', async () => {
    const delegates = await getBrokerDelegation('');
    expect(delegates).toMatchObject(mockedDelegatedPSP);
  });
});
