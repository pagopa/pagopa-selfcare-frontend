import { tavoloOpDto } from '../../services/__mocks__/operationTable';
import { PortalApi, apiClient, apiConfigClient } from '../PortalApiClient';
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

const spyOnGetOperationTableList = jest.spyOn(apiConfigClient, 'getAllTavoloOpDetailsUsingGET');

const spyOnGetOperationTableDetails = jest.spyOn(apiConfigClient, 'getTavoloOpDetailsUsingGET');

const spyOnCreateOperationTable = jest.spyOn(apiConfigClient, 'insertUsingPOST');

const spyOnUpdateOperationTable = jest.spyOn(apiConfigClient, 'updateUsingPUT');

const spyOnGetDelegatedPSPbyBroker = jest.spyOn(apiClient, 'getBrokerDelegationUsingGET');

describe('Testing that PortalApi methods calls apiConfigClient', () => {
  test('Testing getDelegatedPSPbyBroker calls getBrokerDelegationUsingGET', async () => {
    await PortalApi.getDelegatedPSPbyBroker('123');
    expect(spyOnGetDelegatedPSPbyBroker).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

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

  test('Testing getOperationTableList calls getAllTavoloOpDetailsUsingGET', async () => {
    await PortalApi.getOperationTableList();
    expect(spyOnGetOperationTableList).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getOperationTableDetails calls getTavoloOpDetailsUsingGET', async () => {
    await PortalApi.getOperationTableDetails('123');
    expect(spyOnGetOperationTableDetails).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing createOperationTable calls insertUsingPOST', async () => {
    await PortalApi.createOperationTable(tavoloOpDto);
    expect(spyOnCreateOperationTable).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing updateOperationTable calls updateUsingPUT', async () => {
    await PortalApi.updateOperationTable(tavoloOpDto);
    expect(spyOnUpdateOperationTable).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });
});
