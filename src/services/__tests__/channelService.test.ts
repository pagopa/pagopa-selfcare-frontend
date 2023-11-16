import { getDelegatedPSPbyBroker } from '../channelService';
import { mockedDelegatedPSP } from '../__mocks__/channelService';

// jest.mock('../../api/BackofficeClient');

describe('ChannelService test', () => {
  test('Test getDelegatedPSPbyBroker', async () => {
    const delegates = await getDelegatedPSPbyBroker('');
    expect(delegates).toMatchObject(mockedDelegatedPSP);
  });
});
