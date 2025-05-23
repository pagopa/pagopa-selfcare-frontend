import { BackofficeApi } from '../../api/BackofficeClient.ts';
import { Redirect_protocolEnum } from '../../api/generated/portal/WrapperChannelDetailsDto.ts';
import { ConfigurationStatus } from '../../model/Station.tsx';
import { channelCode } from '../__mocks__/channelService';
import {
  channelEnabled,
  mockedChannel,
  mockedChannelDetail,
  mockedChannelDetailWithNote,
  mockedChannelPSPs,
  mockedChannelPSPsPage2,
  mockedChannels,
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
  getPSPChannels,
  getWfespPlugins,
  updateChannel,
  updateWrapperChannelDetails,
  updateWrapperChannelWithOperatorReview,
} from '../channelService.ts';

describe('ChannelService test mocked', () => {
  test('Test getChannels', async () => {
    const response = await getChannels({
      status: ConfigurationStatus.ACTIVE,
      channelCode: 'channelId',
      brokerCode: 'brokerCode',
      limit: 10,
      page: 0,
    });
    expect(response).toMatchObject(mockedChannels);
  });
  test('Test getChannelDetail', async () => {
    const response = await getChannelDetail({
      channelCode: 'channelId',
      status: ConfigurationStatus.ACTIVE,
    });
    expect(response).toMatchObject(mockedChannelDetail('channelId'));
  });
  test('Test getPSPChannels', async () => {
    const response = await getPSPChannels('pspTaxCode');
    expect(response).toMatchObject(channelEnabled(mockedPSPChannels));
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
  test('Test updateWrapperChannelDetails', async () => {
    const response = await updateWrapperChannelDetails({
      channelCode: 'channelCode',
      channel: {
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
      validationUrl: 'validationUrl',
    });
    expect(response).toMatchObject(mockedWrapperChannel);
  });
  test('Test updateWrapperChannelWithOperatorReview', async () => {
    const response = await updateWrapperChannelWithOperatorReview({
      channelCode: 'channelCode',
      brokerPspCode: 'brokerPspCode',
      note: 'note',
    });
    expect(response).toMatchObject(mockedChannelDetailWithNote('channelCode', 'note'));
  });
});

describe('ChannelService test client', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Test getChannels', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'getChannels')
      .mockReturnValue(Promise.resolve(mockedChannels));
    expect(
      getChannels({
        status: ConfigurationStatus.ACTIVE,
        channelCode: 'channelId',
        brokerCode: 'brokerCode',
        limit: 10,
        page: 0,
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getChannelDetail', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'getChannelDetail')
      .mockReturnValue(new Promise((resolve) => resolve(mockedChannelDetail('channelCode'))));
    expect(
      getChannelDetail({ channelCode: 'channelId', status: ConfigurationStatus.ACTIVE })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getPSPChannels', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.paymentServiceProviders, 'getPSPChannels')
      .mockReturnValue(new Promise((resolve) => resolve(channelEnabled(mockedPSPChannels))));
    expect(getPSPChannels('pspTaxCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getWfespPlugins', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.configurations, 'getWfespPlugins')
      .mockReturnValue(new Promise((resolve) => resolve(mockedWfespPlugIn)));
    expect(getWfespPlugins()).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createChannel', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'createChannel')
      .mockReturnValue(new Promise((resolve) => resolve(mockedChannelDetail('channelCode'))));
    expect(
      createChannel({
        validationUrl: '',
        targetUnion: '',
        newConnection: '',
        proxyUnion: '',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateChannel', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'updateChannel')
      .mockReturnValue(new Promise((resolve) => resolve(mockedChannelDetail('channelCode'))));
    expect(
      updateChannel('channelCode', {
        validationUrl: '',
        targetUnion: '',
        newConnection: '',
        proxyUnion: '',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getChannelCode', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.paymentServiceProviders, 'getChannelCode')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getChannelCode('pspCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test getChannelPSPs', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'getChannelPSPs')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(getChannelPSPs('channelCode', 'pspName', 0)).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test associatePSPtoChannel', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.paymentServiceProviders, 'associatePSPtoChannel')
      .mockReturnValue(new Promise((resolve) => resolve(mockedPaymentTypesResource)));
    expect(
      associatePSPtoChannel('channelCode', 'taxCode', {
        payment_types: [],
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test dissociatePSPfromChannel', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.paymentServiceProviders, 'dissociatePSPfromChannel')
      .mockReturnValue(new Promise((resolve) => resolve()));
    expect(dissociatePSPfromChannel('channelCode', 'pspTaxCode')).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test createWrapperChannelDetails', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'createWrapperChannelDetails')
      .mockReturnValue(new Promise((resolve) => resolve({})));
    expect(
      createWrapperChannelDetails(
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
      )
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateWrapperChannelDetails', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'updateWrapperChannelDetails')
      .mockReturnValue(Promise.resolve({}));
    expect(
      updateWrapperChannelDetails({
        channelCode: 'channel_code',
        channel: {
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
        validationUrl: 'validationUrl',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
  test('Test updateWrapperChannelWithOperatorReview', async () => {
    const spyOn = jest
      .spyOn(BackofficeApi.channels, 'updateWrapperChannelWithOperatorReview')
      .mockReturnValue(
        new Promise((resolve) => resolve(mockedChannelDetailWithNote('channelCode', 'note')))
      );
    expect(
      updateWrapperChannelWithOperatorReview({
        channelCode: 'channelCode',
        brokerPspCode: 'brokerPspCode',
        note: 'note',
      })
    ).resolves.not.toThrow();
    expect(spyOn).toBeCalledTimes(1);
  });
});
