import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';
import { StationOnCreation } from '../../model/Station';
import { alterStationValuesToFitCategories, getStationCategoryFromDetail } from '../station-utils';

test('Test getStationCategoryFromDetail undefined', () => {
  const asyncGPDStation: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    proxyConcat: '',
    targetConcat: '',
    targetHost: '',
    targetPath: '',
    targetPort: 443,
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationCategory = getStationCategoryFromDetail(asyncGPDStation, 'prod');

  expect(stationCategory).toStrictEqual(undefined);
});

test('Test getStationCategoryFromDetail AsyncGPD', () => {
  const asyncGPDStation: StationOnCreation = {
    brokerCode: '123',
    primitiveVersion: 1,
    redirectIp: 'string',
    redirectPath: 'string',
    redirectPort: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'string',
    stationCode: 'string',
    service: '/gpd-payments/api/v1',
    proxyConcat: '',
    targetConcat: '',
    targetHost: '',
    targetPath: '',
    targetPort: 443,
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationCategory = getStationCategoryFromDetail(asyncGPDStation, 'prod');

  expect(stationCategory).toStrictEqual('AsyncGPD');
});

test('Test getStationCategoryFromDetail SyncNewConn', () => {
  const station: StationOnCreation = {
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
    proxyConcat: '',
    targetConcat: '',
    targetHost: '',
    targetPath: '',
    targetPort: 443,
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationCategory = getStationCategoryFromDetail(station, 'prod');

  expect(stationCategory).toStrictEqual('SyncNewConn');
});

test('Test getStationCategoryFromDetail SyncGAD', () => {
  const station: StationOnCreation = {
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
    proxyConcat: '',
    targetConcat: '',
    targetPath: '',
    targetPort: 443,
    gdpConcat: '',
    newConnConcat: '',
  };

  const stationCategory = getStationCategoryFromDetail(station, 'prod');

  expect(stationCategory).toStrictEqual('SyncGAD');
});

//Test alterStationValuesToFitCategories
test('Test alterStationValuesToFitCategories ', () => {
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

  const stationOutput = alterStationValuesToFitCategories(stationInput, 'prod');

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
    gdpConcat: 'https://api.platform.pagopa.it/gpd-payments/api/v1',
    newConnConcat: '',
  };

  const stationOutput = alterStationValuesToFitCategories(stationInput, 'prod');

  expect(stationOutput.targetHost).toStrictEqual('');

  expect(stationOutput.ip).toStrictEqual('api.platform.pagopa.it');
  expect(stationOutput.port).toStrictEqual(443);
  expect(stationOutput.service).toStrictEqual('/gpd-payments/api/v1');
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

  const stationOutput2 = alterStationValuesToFitCategories(stationInput, 'prod');

  expect(stationOutput2.targetPortPof).toStrictEqual(8080);
  expect(stationOutput2.targetHostPof).toStrictEqual('https://test.it');
  expect(stationOutput2.targetPathPof).toStrictEqual('/test');

  expect(stationOutput2.ip).toStrictEqual('api.platform.pagopa.it');
  expect(stationOutput2.port).toStrictEqual(443);
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

  const stationOutput2 = alterStationValuesToFitCategories(stationInput, 'prod');

  expect(stationOutput2.ip).toStrictEqual('test.it');
  expect(stationOutput2.port).toStrictEqual(8080);
  expect(stationOutput2.service).toStrictEqual('/test');
  expect(stationOutput2.protocol).toStrictEqual('HTTP');
});
