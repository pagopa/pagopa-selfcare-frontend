/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ProtocolEnum, StationDetailResource } from '../api/generated/portal/StationDetailResource';
import {
  GPDConfigs,
  IGPDConfig,
  INewConnConfig,
  NewConnConfigs,
  StationCategory,
  StationOnCreation,
} from '../model/Station';

export const splitURL = (targetURL: string) => {
  try {
    const hasProtocol = targetURL.startsWith('http');
    const url = new URL(hasProtocol ? targetURL : `http://${targetURL}`);
    return {
      protocolSplit: url.protocol.replace(':', ''),
      hostSplit: url.hostname,
      portSplit: Number(url.port),
      pathSplit: url.pathname + url.search + url.hash,
    };
  } catch (e) {
    console.error(e);
  }
  return {
    protocolSplit: '',
    hostSplit: '',
    portSplit: 0,
    pathSplit: '',
  };
};

export const getStationCategoryFromDetail = (station: StationDetailResource, env: string) => {
  /* Stations can be created in three different flavours:
   ** 1. Async GPD -> Creditor Institution doesn't set Target field and Operator set GPD field
   **    a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with GPD values
   ** 2. Sync New Connectivity -> Creditor Institution set Target and Operator set NewConn field
   **    a. target_host_pof/target_port_pof/target_path_pof will be valorized with Target values
   **    B. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Forwarder values
   ** 3. Sync GAD/DomainPort/VPN -> Creditor Institution set Target field and Operator doesn't set GPD nor NewConn
   **    a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Target
   */
  const gpdAddresses = GPDConfigs[env as keyof IGPDConfig];
  const forwarderAddresses = NewConnConfigs[env as keyof INewConnConfig];

  const isForwarder = Object.entries(forwarderAddresses)
    .map(([key, value]) => value)
    .some((d) =>
      station.service && station.service !== '/' && station.service !== ''
        ? d.includes(station.service)
        : false
    );

  const isGPD = Object.entries(gpdAddresses)
    .map(([key, value]) => value)
    .some((gpd) =>
      station.service && station.service !== '/' && station.service !== ''
        ? gpd.includes(station.service)
        : false
    );

  if (isGPD && station.targetHost === '') {
    return StationCategory.AsyncGPD;
  }
  if (station.targetHostPof && isForwarder) {
    return StationCategory.SyncNewConn;
  }
  if (!isGPD && !isForwarder && station.targetHost !== '') {
    return StationCategory.SyncGAD;
  }

  return undefined;
};

export const alterStationValuesToFitCategories = (station: StationOnCreation, env: string): any => {
  /* Stations can be created in three different flavours:
   ** 1. Async GPD -> Creditor Institution doesn't set Target field and Operator set GPD field
   **    a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with GPD values
   ** 2. Sync New Connectivity -> Creditor Institution set Target and Operator set NewConn field
   **    a. target_host_pof/target_port_pof/target_path_pof will be valorized with Target values
   **    B. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Forwarder values
   ** 3. Sync GAD/DomainPort/VPN -> Creditor Institution set Target field and Operator doesn't set GPD nor NewConn
   **    a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Target
   */

  const gpdAddresses = GPDConfigs[env as keyof IGPDConfig];
  const forwarderAddresses = NewConnConfigs[env as keyof INewConnConfig];

  const isForwarder =
    station.newConnConcat !== '' &&
    Object.entries(forwarderAddresses)
      .map(([key, value]) => value)
      .some((d) => station.newConnConcat);

  const isGPD =
    station.gdpConcat !== '' &&
    Object.entries(gpdAddresses)
      .map(([key, value]) => value)
      .some((d) => d.includes(station.gdpConcat));

  const { protocolSplit, hostSplit, portSplit } = splitURL(station.proxyConcat);
  // eslint-disable-next-line functional/immutable-data
  station.proxyHost = hostSplit;

  if (isGPD) {
    const {
      protocolSplit,
      hostSplit: ip,
      portSplit,
      pathSplit: service,
    } = splitURL(station.gdpConcat);

    const protocol = protocolSplit.includes('https') ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : protocol === ProtocolEnum.HTTPS ? 443 : 80;

    // IP/PORT/SERVICE/PROTOCOL fields will be valorized with GPD values
    return { ...station, protocol, ip, port, service, pofService: service };
  }

  if (isForwarder) {
    const {
      protocolSplit: protocolForwarder,
      hostSplit: ip,
      portSplit,
      pathSplit: service,
    } = splitURL(station.newConnConcat);

    const protocol = protocolForwarder.includes('https') ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : protocol === ProtocolEnum.HTTPS ? 443 : 80;

    // IP/PORT/SERVICE/PROTOCOL fields will be valorized with Forwarder values
    return {
      ...station,
      protocol,
      ip,
      port,
      service,
      pofService: service,
    };
  }

  // Sync GAD
  if (station.targetConcat !== '' && !isForwarder && !isGPD) {
    const {
      protocolSplit,
      hostSplit: ip,
      portSplit,
      pathSplit: service,
    } = splitURL(station.targetConcat);

    const protocol = protocolSplit.includes('https') ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : protocol === ProtocolEnum.HTTPS ? 443 : 80;

    // a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Target
    return { ...station, protocol, ip, port, service };
  }

  return station;
};

export const stationServicesConfiguration = (getFlagValue: (value: string) => boolean) => {
  const arr = [];
  if (getFlagValue('station-odp-service')) {
    // eslint-disable-next-line functional/immutable-data
    arr.push({
      id: 'odp',
      property: 'isPaymentOptionsEnabled',
      endpoint: '/payment-options',
    });
  }
  return arr;
};

export const getAuxDigit = ({
  segregationCode,
  applicationCode,
  auxDigit,
}: {
  segregationCode?: string | number;
  applicationCode?: string | number;
  auxDigit?: string | number;
}): string => {
  const hasSegregationCode = segregationCode !== undefined;
  const hasApplicationCode = applicationCode !== undefined;

  if (hasSegregationCode && !hasApplicationCode) {
    return '3';
  } else if (!hasSegregationCode && hasApplicationCode) {
    return '0';
  } else if (hasSegregationCode && hasApplicationCode) {
    return '0/3';
  } else if (auxDigit !== undefined) {
    return auxDigit.toString(); // Ensures number values are converted to string
  } else {
    return '-';
  }
};
