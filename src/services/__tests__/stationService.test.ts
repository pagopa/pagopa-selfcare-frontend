import { createStation, getStations } from '../stationService';

import { mockedStation, mockedStations } from '../__mocks__/stationService';
import { RedirectProtocolEnum } from '../../api/generated/portal/StationDetailsDto';

jest.mock('../../api/PortalApiClient');

let portalApiGetStationSpy;

beforeEach(() => {
  portalApiGetStationSpy = jest.spyOn(require('../stationService'), 'getStations');
});

test('Test createStation', async () => {
  const station = await createStation({
    primitiveVersion: 1,
    redirectIp: 'ip',
    redirectPath: 'rPath',
    redirectPort: 1,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectQueryString: 'qString',
    stationCode: '123',
    targetHost: 'tHost',
    targetPath: 'tPath',
    targetPort: 1,
  });
  expect(station).toMatchObject(mockedStation);
});

test('Test getStations', async () => {
  const stations = await getStations(0, '1');
  expect(stations).toMatchObject(mockedStations);

  expect(portalApiGetStationSpy).toBeCalledTimes(1);
});
