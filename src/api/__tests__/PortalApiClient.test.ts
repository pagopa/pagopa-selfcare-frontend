import { tavoloOpDto } from '../../services/__mocks__/operationTable';
import { BackofficeApi, backofficeClient, backofficeClient } from '../BackofficeClient';
import * as apiUtils from '@pagopa/selfcare-common-frontend/utils/api-utils';

const spyOnExtractResponse = jest
  .spyOn(apiUtils, 'extractResponse')
  .mockImplementation(() => Promise.resolve({}));

const spyOngetBrokerAndEcDetailsUsingGET = jest.spyOn(
  backofficeClient,
  'getBrokerAndEcDetailsUsingGET'
);

const spyOngetBrokerAndPspDetailsUsingGET = jest.spyOn(
  backofficeClient,
  'getBrokerAndPspDetailsUsingGET'
);

const spyOnGetOperationTableList = jest.spyOn(backofficeClient, 'getAllTavoloOpDetailsUsingGET');

const spyOnGetOperationTableDetails = jest.spyOn(backofficeClient, 'getTavoloOpDetailsUsingGET');

const spyOnCreateOperationTable = jest.spyOn(backofficeClient, 'insertUsingPOST');

const spyOnUpdateOperationTable = jest.spyOn(backofficeClient, 'updateUsingPUT');

const spyOnGetDelegatedPSPbyBroker = jest.spyOn(backofficeClient, 'getBrokerDelegationUsingGET');

describe('Testing that BackofficeApi methods calls backofficeClient', () => {
  test('Testing getDelegatedPSPbyBroker calls getBrokerDelegationUsingGET', async () => {
    await BackofficeApi.getDelegatedPSPbyBroker('123');
    expect(spyOnGetDelegatedPSPbyBroker).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getBrokerAndEcDetails calls getBrokerAndEcDetailsUsingGET', async () => {
    await BackofficeApi.getBrokerAndEcDetails('test');
    expect(spyOngetBrokerAndEcDetailsUsingGET).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getBrokerAndPspDetails calls getBrokerAndPspDetailsUsingGET', async () => {
    await BackofficeApi.getBrokerAndPspDetails('test');
    expect(spyOngetBrokerAndPspDetailsUsingGET).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getOperationTableList calls getAllTavoloOpDetailsUsingGET', async () => {
    await BackofficeApi.getOperationTableList();
    expect(spyOnGetOperationTableList).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing getOperationTableDetails calls getTavoloOpDetailsUsingGET', async () => {
    await BackofficeApi.getOperationTableDetails('123');
    expect(spyOnGetOperationTableDetails).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing createOperationTable calls insertUsingPOST', async () => {
    await BackofficeApi.createOperationTable(tavoloOpDto);
    expect(spyOnCreateOperationTable).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });

  test('Testing updateOperationTable calls updateUsingPUT', async () => {
    await BackofficeApi.updateOperationTable(tavoloOpDto);
    expect(spyOnUpdateOperationTable).toBeCalled();
    expect(spyOnExtractResponse).toBeCalled();
  });
});
