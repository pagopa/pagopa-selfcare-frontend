import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../api/generated/portal/StationDetailsDto';

export const mockedStation: StationDetailsDto = {
  stationCode: '97735020584_01',
  primitiveVersion: '12345',
  redirectProtocol: RedirectProtocolEnum.HTTPS,
  redirectPort: 3000,
  redirectIp: 'Esempio Ip',
  redirectPath: 'Esempio Pat',
  redirectQueryString: 'Esempio parametri',
  targetHost: 'Esempio indirizzo',
  targetPath: 'Esempio Pat',
  targetPort: 3001,
};

export const createStationMocked = (_station: StationDetailsDto): Promise<StationDetailsDto> =>
  new Promise((resolve) => resolve(mockedStation));
