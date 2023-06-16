import { WrapperStatusEnum } from '../api/generated/portal/StationDetailResource';
import {
  Protocol4ModEnum,
  ProtocolEnum,
  RedirectProtocolEnum,
} from '../api/generated/portal/StationDetailsDto';

export enum StationFormAction {
  Create = 'create',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
  Duplicate = 'duplicate',
}

export type StationOnCreation = {
  enabled?: boolean;
  brokerCode: string;
  stationCode: string;
  primitiveVersion: number;
  redirectProtocol: RedirectProtocolEnum;
  redirectPort: number;
  redirectIp: string;
  redirectPath: string;
  redirectQueryString: string;
  targetHost: string;
  targetPath: string;
  targetPort: number;
  version?: number | undefined;
  password?: string | undefined;
  newPassword?: string | undefined;
  protocol?: ProtocolEnum | undefined;
  port?: number | undefined;
  ip?: string | undefined;
  service?: string | undefined;
  pofService?: string | undefined;
  targetHostPof?: string | undefined;
  targetPathPof?: string | undefined;
  targetPortPof?: number | undefined;
  endpointIp?: string | undefined;
  endpointPath?: string | undefined;
  endpointPort?: number | undefined;
  protocol4Mod?: Protocol4ModEnum | undefined;
  ip4Mod?: string | undefined;
  port4Mod?: number | undefined;
  service4Mod?: string | undefined;
  timeoutA?: number | undefined;
  timeoutB?: number | undefined;
  timeoutC?: number | undefined;
  activationDate?: Date | undefined;
  associatedCreditorInstitutions?: number | undefined;
  brokerDescription?: string | undefined;
  brokerObjId?: number | undefined;
  createdAt?: Date | undefined;
  flagOnline?: boolean | undefined;
  modifiedAt?: Date | undefined;
  proxyEnabled?: boolean | undefined;
  proxyHost?: string | undefined;
  proxyPassword?: string | undefined;
  proxyPort?: number | undefined;
  proxyUsername?: string | undefined;
  rtInstantaneousDispatch?: boolean | undefined;
  threadNumber?: number | undefined;
  wrapperStatus?: WrapperStatusEnum;
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
