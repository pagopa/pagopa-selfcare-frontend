import { createWrapperStation, getStations } from '../stationService';

import { mockedWrapperStation, mockedStations } from '../__mocks__/stationService';

jest.mock('../../api/PortalApiClient');

let portalApiGetStationSpy: jest.SpyInstance<any, unknown[]>;
let portalApiCreateWrapSpy: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  portalApiCreateWrapSpy = jest.spyOn(require('../stationService'), 'createWrapperStation');
  portalApiGetStationSpy = jest.spyOn(require('../stationService'), 'getStations');
});

test('Test createWrapperStation', async () => {
  const station = await createWrapperStation(mockedWrapperStation);
  expect(station).toMatchObject(mockedWrapperStation);
  expect(portalApiCreateWrapSpy).toBeCalledTimes(1);
});

test('Test getStations', async () => {
  const stations = await getStations(0, '1');
  expect(stations).toMatchObject(mockedStations);
  expect(portalApiGetStationSpy).toBeCalledTimes(1);
});
