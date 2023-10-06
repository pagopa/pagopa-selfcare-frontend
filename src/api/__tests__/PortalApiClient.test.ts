import { PortalApi, apiConfigClient } from '../PortalApiClient';
import * as apiUtils from '@pagopa/selfcare-common-frontend/utils/api-utils';

const spyOnExtractResponse = jest
  .spyOn(apiUtils, 'extractResponse')
  .mockImplementation(() => Promise.resolve({}));

const spyOngetBrokerAndEcDetailsUsingGET = jest.spyOn(
  apiConfigClient,
  'getBrokerAndEcDetailsUsingGET'
);

const spyOngetBrokerAndPspDetailsUsingGET = jest.spyOn(
  apiConfigClient,
  'getBrokerAndPspDetailsUsingGET'
);

describe('Testing that PortalApi methods calls apiConfigClient', () => {
  test('Testing getBrokerAndEcDetails calls getBrokerAndEcDetailsUsingGET', async () => {
    await PortalApi.getBrokerAndEcDetails('test');
    expect(spyOngetBrokerAndEcDetailsUsingGET).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getBrokerAndPspDetails calls getBrokerAndPspDetailsUsingGET', async () => {
    await PortalApi.getBrokerAndPspDetails('test');
    expect(spyOngetBrokerAndPspDetailsUsingGET).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });
});
