import {WrapperStatusEnum} from '../api/generated/portal/StationDetailResource';
<<<<<<< HEAD
import {
    Protocol4ModEnum,
    ProtocolEnum,
    RedirectProtocolEnum,
} from '../api/generated/portal/StationDetailsDto';
=======
import {Protocol4ModEnum, ProtocolEnum, RedirectProtocolEnum,} from '../api/generated/portal/StationDetailsDto';
>>>>>>> 3f32cfc3 (Formatting (#542))

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

export enum StationCategory {
    AsyncGPD = 'AsyncGPD',
    SyncNewConn = 'SyncNewConn',
    SyncGAD = 'SyncGAD',
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
    port?: number | undefined;
    port4Mod?: number | undefined;
    protocol?: ProtocolEnum | undefined;
    protocol4Mod?: Protocol4ModEnum | undefined;
    proxyConcat: string;
    proxyEnabled?: boolean | undefined;
    proxyHost?: string | undefined;
    proxyPassword?: string | undefined;
    proxyPort?: number | undefined;
    proxyUsername?: string | undefined;
    rtInstantaneousDispatch?: boolean | undefined;
    service?: string | undefined;
    pofService?: string | undefined;
    service4Mod?: string | undefined;
    stationCode: string;
    threadNumber?: number | undefined;
    timeoutA?: number | undefined;
    timeoutB?: number | undefined;
    timeoutC?: number | undefined;
    version?: number | undefined;
    wrapperStatus?: WrapperStatusEnum;
    gdpConcat: string;
    newConnConcat: string;
    validationUrl?: string;
    // fields for redirect endpoint
    redirectConcat: string;
    redirectIp: string;
    redirectPath: string;
    redirectPort?: number;
    redirectProtocol: RedirectProtocolEnum;
    redirectQueryString: string;
    // fields for RT endpoint
    targetConcat: string;
    targetHost: string;
    targetPath: string;
    targetPort?: number;
    // fields for Modello Unico endpoint
    targetPofConcat: string;
    targetHostPof?: string;
    targetPathPof?: string;
    targetPortPof?: number;
    primitiveVersion: number;
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

export interface IProxyConfigItem {
    newConnectivity: string;
    oldConnectivity: string;
}

export interface IProxyConfig {
    LOCAL_DEV: IProxyConfigItem;
    TEST: IProxyConfigItem;
    dev: IProxyConfigItem;
    uat: IProxyConfigItem;
    prod: IProxyConfigItem;
}

export const ProxyConfigs: IProxyConfig = {
    LOCAL_DEV: {
        newConnectivity: 'http://10.79.20.33:80',
        oldConnectivity: 'http://10.101.1.95:8080',
    },
    TEST: {
        newConnectivity: 'http://10.79.20.33:80',
        oldConnectivity: 'http://10.101.1.95:8080',
    },
    dev: {newConnectivity: 'http://10.79.20.33:80', oldConnectivity: 'http://10.101.1.95:8080'},
    uat: {newConnectivity: 'http://10.79.20.33:80', oldConnectivity: 'http://10.101.1.95:8080'},
    prod: {newConnectivity: 'http://10.79.20.35:80', oldConnectivity: 'http://10.102.1.85:8080'},
};

export interface INewConnConfigItem {
    forwarder01: string;
}

export interface INewConnConfig {
    LOCAL_DEV: INewConnConfigItem;
    TEST: INewConnConfigItem;
    dev: INewConnConfigItem;
    uat: INewConnConfigItem;
    prod: INewConnConfigItem;
}

export const NewConnConfigs: INewConnConfig = {
    LOCAL_DEV: {
        forwarder01: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward',
    },
    TEST: {
        forwarder01: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward',
    },
    dev: {forwarder01: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'},
    uat: {forwarder01: 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'},
    prod: {forwarder01: 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'},
};

export interface IGPDConfigItem {
    gdp01: string;
}

export interface IGPDConfig {
    LOCAL_DEV: IGPDConfigItem;
    TEST: IGPDConfigItem;
    dev: IGPDConfigItem;
    uat: IGPDConfigItem;
    prod: IGPDConfigItem;
}

export const GPDConfigs = {
    LOCAL_DEV: {
        gdp01: 'https://api.uat.platform.pagopa.it/gpd-payments/api/v1',
    },
    TEST: {
        gdp01: 'https://api.uat.platform.pagopa.it/gpd-payments/api/v1',
    },
    dev: {gdp01: 'https://api.uat.platform.pagopa.it/gpd-payments/api/v1'},
    uat: {gdp01: 'https://api.uat.platform.pagopa.it/gpd-payments/api/v1'},
    prod: {gdp01: 'https://api.platform.pagopa.it/gpd-payments/api/v1'},
};

export enum ConnectionType {
    ASYNC = 'async',
    SYNC = 'sync',
}

export enum ConfigurationStatus {
    ACTIVE = "ACTIVE",
    TO_BE_VALIDATED = "TO_BE_VALIDATED"
}
