import { RedirectProtocolEnum } from '../api/generated/portal/StationDetailsDto';

export type StationOnCreation = {
  stationCode: string;
  primitiveVersion: number;
  redirectProtocol: RedirectProtocolEnum;
  redirectPort: number;
  redirectIp: string;
  redirectPath: string;
  redirectQueryString: string;
  targetAddress: string;
  targetService: string;
  targetPort: number;
};
