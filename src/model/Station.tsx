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
  activationDate?: Date | undefined;
  associatedCreditorInstitutions?: number | undefined;
  brokerCode: string;
  brokerDescription?: string | undefined;
  brokerObjId?: number | undefined;
  createdAt?: Date | undefined;
  enabled?: boolean;
  endpointIp?: string | undefined;
  endpointPath?: string | undefined;
  endpointPort?: number | undefined;
  flagOnline?: boolean | undefined;
  ip?: string | undefined;
  ip4Mod?: string | undefined;
  modifiedAt?: Date | undefined;
  newPassword?: string | undefined;
  password?: string | undefined;
  pofService?: string | undefined;
  port?: number | undefined;
  port4Mod?: number | undefined;
  primitiveVersion: number;
  protocol?: ProtocolEnum | undefined;
  protocol4Mod?: Protocol4ModEnum | undefined;
  proxyEnabled?: boolean | undefined;
  proxyHost?: string | undefined;
  proxyPassword?: string | undefined;
  proxyPort?: number | undefined;
  proxyUsername?: string | undefined;
  redirectIp: string;
  redirectPath: string;
  redirectPort: number;
  redirectProtocol: RedirectProtocolEnum;
  redirectQueryString: string;
  rtInstantaneousDispatch?: boolean | undefined;
  service?: string | undefined;
  service4Mod?: string | undefined;
  stationCode: string;
  targetHost: string;
  targetHostPof?: string | undefined;
  targetPath: string;
  targetPathPof?: string | undefined;
  targetPort: number;
  targetPortPof?: number | undefined;
  threadNumber?: number | undefined;
  timeoutA?: number | undefined;
  timeoutB?: number | undefined;
  timeoutC?: number | undefined;
  version?: number | undefined;
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
