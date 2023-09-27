import { getDelegatedPSPbyBroker } from '../channelService';
import { mockedDelegatedPSP } from '../__mocks__/channelService';

// jest.mock('../../api/PortalApiClient');

describe('ChannelService test', () => {
  test('Test getDelegatedPSPbyBroker', async () => {
    const delegates = await getDelegatedPSPbyBroker('');
    expect(delegates).toMatchObject(mockedDelegatedPSP);
  });
});
