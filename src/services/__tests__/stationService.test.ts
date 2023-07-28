import { createStation /* getStations */ } from '../stationService';

// import { mockedStations } from '../__mocks__/stationService';
import { RedirectProtocolEnum } from '../../api/generated/portal/WrapperStationDetailsDto';

jest.mock('../../api/PortalApiClient');

let portalApiGetStationSpy: jest.SpyInstance<any, unknown[]>;
let portalApiCreateWrapSpy: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  portalApiCreateWrapSpy = jest.spyOn(require('../stationService'), 'createWrapperStation');
  portalApiGetStationSpy = jest.spyOn(require('../stationService'), 'getStations');
});

describe('StationService test', () => {
  const mockedWrapperStation = {
    stationCode: '97735020584_02',
    primitiveVersion: 1,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectPort: 3000,
    redirectIp: 'Esempio Ip',
    redirectPath: 'Esempio Pat',
    redirectQueryString: 'Esempio parametri',
    targetHost: 'Esempio indirizzo',
    targetPath: 'Esempio Pat',
    targetPort: 3001,
    brokerCode: '97735020584',
  };

  test('Test createWrapperStation', async () => {
    const station = await createStation(mockedWrapperStation);
    expect(station).toMatchObject(mockedWrapperStation);
    // expect(portalApiCreateWrapSpy).toBeCalledTimes(1);
  });

  // test('Test getStations', async () => {
  //   const stations = await getStations(0, '1');
  //   expect(stations).toMatchObject(mockedStations);
  //   expect(portalApiGetStationSpy).toBeCalledTimes(1);
  // });
});
