import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import { StationOnCreation } from '../../model/Station';
import { alterStationValuesToFitCategories, getStationCategoryFromDetail } from '../station-utils';

test('Test undefined', () => {
  const asyncGPDStation: StationDetailsDto = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
  };

  const stationCategory = getStationCategoryFromDetail(asyncGPDStation, 'PROD');

  expect(stationCategory).toStrictEqual(undefined);
});

test('Test AsyncGPD', () => {
  const asyncGPDStation: StationDetailsDto = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: '/gpd-paymements/api/v1',
  };

  const stationCategory = getStationCategoryFromDetail(asyncGPDStation, 'PROD');

  expect(stationCategory).toStrictEqual('AsyncGPD');
});

test('Test SyncNewConn', () => {
  const station: StationDetailsDto = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: '/pagopa-node-forwarder/api/v1/forward',
    targetHostPof: 'target',
  };

  const stationCategory = getStationCategoryFromDetail(station, 'PROD');

  expect(stationCategory).toStrictEqual('SyncNewConn');
});

test('Test SyncGAD', () => {
  const station: StationDetailsDto = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: 'test',
    targetHost: 'target',
  };

  const stationCategory = getStationCategoryFromDetail(station, 'PROD');

  expect(stationCategory).toStrictEqual('SyncGAD');
});

//Test alterStationValuesToFitCategories
test.skip('Test alterStationValuesToFitCategories ', () => {
  const stationInput: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: 'test',
    targetHost: '',
    targetPath: '',
    targetPort: 0,
    proxyConcat: '',
    targetConcat: '',
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationOutput = alterStationValuesToFitCategories(stationInput, 'PROD');

  expect(stationOutput).toStrictEqual(stationOutput);
});

test('Test Async GPD', () => {
  const stationInput: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: 'test',
    targetHost: '',
    targetPath: '',
    targetPort: 0,
    proxyConcat: '',
    targetConcat: '',
    gdpConcat: 'https://api.platform.pagopa.it/gpd-paymements/api/v1',
    newConnConcat: '',
  };

  const stationOutput = alterStationValuesToFitCategories(stationInput, 'PROD');

  expect(stationOutput.targetHost).toStrictEqual('');

  expect(stationOutput.ip).toStrictEqual('api.platform.pagopa.it');
  expect(stationOutput.port).toStrictEqual(0);
  expect(stationOutput.service).toStrictEqual('/gpd-paymements/api/v1');
  expect(stationOutput.protocol).toStrictEqual('HTTPS');
});

test('Test Sync New Conn', () => {
  const stationInput: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: 'test',
    targetHost: '',
    targetPath: '',
    targetPort: 0,
    targetPortPof: undefined,
    proxyConcat: '',
    targetConcat: 'https://test.it:8080/test',
    gdpConcat: '',
    newConnConcat: 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward',
  };

  const stationOutput2 = alterStationValuesToFitCategories(stationInput, 'PROD');

  expect(stationOutput2.targetPortPof).toStrictEqual(8080);
  expect(stationOutput2.targetHostPof).toStrictEqual('https://test.it');
  expect(stationOutput2.targetPathPof).toStrictEqual('/test');

  expect(stationOutput2.ip).toStrictEqual('api.platform.pagopa.it');
  expect(stationOutput2.port).toStrictEqual(0);
  expect(stationOutput2.service).toStrictEqual('/pagopa-node-forwarder/api/v1/forward');
  expect(stationOutput2.protocol).toStrictEqual('HTTPS');
});

test('Test Sync GAD', () => {
  const stationInput: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: 'test',
    targetHost: '',
    targetPath: '',
    targetPort: 0,
    targetPortPof: undefined,
    proxyConcat: '',
    targetConcat: 'http://test.it:8080/test',
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationOutput2 = alterStationValuesToFitCategories(stationInput, 'PROD');

  expect(stationOutput2.ip).toStrictEqual('test.it');
  expect(stationOutput2.port).toStrictEqual(8080);
  expect(stationOutput2.service).toStrictEqual('/test');
  expect(stationOutput2.protocol).toStrictEqual('HTTP');
});
