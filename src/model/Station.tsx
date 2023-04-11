import { RedirectProtocolEnum } from '../api/generated/portal/StationDetailsDto';

export type StationOnCreation = {
  brokerCode: string;
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

export type StationDetail = {
  anagraphic: {
    status: 'ACTIVE' | 'TO_EDIT' | 'REVIEW';
    stationId: string;
    version: string;
    primitiveVersion: number;
    password: string;
    redirectUrl: string;
    activationDate: string;
  };
  target: {
    address: string;
    service: string;
    port: string;
  };
  associatesEC: {
    associates: string;
  };
  changes: {
    lastChangesDate: string;
    operatedBy: string;
  };
};
