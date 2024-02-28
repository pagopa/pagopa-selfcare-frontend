import {
  channelEnabled,
  mockedChannel,
  mockedChannelDetail,
  mockedChannelPSPs,
  mockedChannelPSPsPage2,
  mockedChannels,
  mockedChannelsMerged,
  mockedPSPChannels,
  mockedPaymentTypesResource,
  mockedWfespPlugIn,
  mockedWrapperChannel,
} from '../__mocks__/channelService.ts';
import {
  associatePSPtoChannel,
  createChannel,
  createWrapperChannelDetails,
  dissociatePSPfromChannel,
  getChannelCode,
  getChannelDetail,
  getChannelPSPs,
  getChannels,
  getChannelsIdAssociatedToPSP,
  getChannelsMerged,
  getPSPChannels,
  getWfespPlugins,
  getWrapperEntities,
  updateChannel,
  updateWrapperChannelDetailsByOpt,
  updateWrapperChannelDetailsToCheck,
  updateWrapperChannelDetailsToCheckUpdate,
} from '../channelService.ts';
import { channelCode } from '../__mocks__/channelService';
import { channelWrapperMockedGet } from '../__mocks__/institutionsService.ts';
import { Redirect_protocolEnum } from '../../api/generated/portal/WrapperChannelDetailsDto.ts';

describe('ChannelService test', () => {
  test('Test getChannels', async () => {
    const response = await getChannels(0);
    expect(response).toMatchObject(mockedChannels);
  });
  test('Test getChannelsMerged', async () => {
    const response = await getChannelsMerged(0, 'brokerCode');
    expect(response).toMatchObject(mockedChannelsMerged);
  });
  test('Test getChannelDetail', async () => {
    const response = await getChannelDetail('channelId');
    expect(response).toMatchObject(mockedChannelDetail('channelId'));
  });
  test('Test getPSPChannels', async () => {
    const response = await getPSPChannels('pspTaxCode');
    expect(response).toMatchObject(channelEnabled(mockedPSPChannels));
  });
  test('Test getChannelsIdAssociatedToPSP', async () => {
    const response = await getChannelsIdAssociatedToPSP(0, 'brokerCode');
    expect(response).toMatchObject(mockedChannelsMerged!.channels!.map((el) => el!.channel_code));
  });
  test('Test getWfespPlugins', async () => {
    const response = await getWfespPlugins();
    expect(response).toMatchObject(mockedWfespPlugIn);
  });
  test('Test createChannel', async () => {
    const response = await createChannel({
      validationUrl: '',
      targetUnion: '',
      newConnection: '',
      proxyUnion: '',
    });
    expect(response).toMatchObject(mockedChannel);
  });
  test('Test updateChannel', async () => {
    const response = await updateChannel('channelCode', {
      validationUrl: '',
      targetUnion: '',
      newConnection: '',
      proxyUnion: '',
    });
    expect(response).toMatchObject(mockedChannel);
  });
  test('Test getChannelCode', async () => {
    const response = await getChannelCode('pspCode');
    expect(response).toMatchObject(channelCode);
  });
  test('Test getChannelPSPs page 0', async () => {
    const response = await getChannelPSPs('channelCode', 'pspName', 0);
    expect(response).toMatchObject(mockedChannelPSPs);
  });
  test('Test getChannelPSPs page 1', async () => {
    const response = await getChannelPSPs('channelCode', 'pspName', 1);
    expect(response).toMatchObject(mockedChannelPSPsPage2);
  });
  test('Test associatePSPtoChannel', async () => {
    const response = await associatePSPtoChannel('channelCode', 'taxCode', {
      payment_types: [],
    });
    expect(response).toMatchObject(mockedPaymentTypesResource);
  });
  test('Test dissociatePSPfromChannel', async () => {
    expect(dissociatePSPfromChannel('channelCode', 'pspTaxCode')).resolves.not.toThrow();
  });
  test('Test getWrapperEntities', async () => {
    const response = await getWrapperEntities('pspCode');
    expect(response).toMatchObject(channelWrapperMockedGet('pspCode'));
  });
  test('Test createWrapperChannelDetails', async () => {
    const response = await createWrapperChannelDetails(
      {
        broker_description: '',
        broker_psp_code: '',
        channel_code: '',
        payment_types: [],
        redirect_protocol: Redirect_protocolEnum.HTTPS,
        target_host: '',
        target_path: '',
        target_port: 0,
        validationUrl: '',
      },
      'validationUrl'
    );
    expect(response).toMatchObject(mockedWrapperChannel);
  });
  test('Test updateWrapperChannelDetailsToCheck', async () => {
    const response = await updateWrapperChannelDetailsToCheck(
      {
        broker_description: '',
        broker_psp_code: '',
        channel_code: '',
        payment_types: [],
        redirect_protocol: Redirect_protocolEnum.HTTPS,
        target_host: '',
        target_path: '',
        target_port: 0,
        validationUrl: '',
      },
      'validationUrl'
    );
    expect(response).toMatchObject(mockedWrapperChannel);
  });
  test('Test updateWrapperChannelDetailsToCheckUpdate', async () => {
    const response = await updateWrapperChannelDetailsToCheckUpdate(
      {
        broker_description: '',
        broker_psp_code: '',
        channel_code: '',
        payment_types: [],
        redirect_protocol: Redirect_protocolEnum.HTTPS,
        target_host: '',
        target_path: '',
        target_port: 0,
        validationUrl: '',
      },
      'validationUrl'
    );
    expect(response).toMatchObject(mockedWrapperChannel);
  });
  test('Test updateWrapperChannelDetailsByOpt', async () => {
    const response = await updateWrapperChannelDetailsByOpt(
      {
        broker_description: '',
        broker_psp_code: '',
        channel_code: '',
        payment_types: [],
        redirect_protocol: Redirect_protocolEnum.HTTPS,
        target_host: '',
        target_path: '',
        target_port: 0,
        validationUrl: '',
      },
      'validationUrl'
    );
    expect(response).toMatchObject(mockedWrapperChannel);
  });
});
