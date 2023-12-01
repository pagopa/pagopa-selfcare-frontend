/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ProtocolEnum, StationDetailResource } from '../api/generated/portal/StationDetailResource';
import { StationDetailsDto } from '../api/generated/portal/StationDetailsDto';
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
    const url = new URL(targetURL);
    return {
      protocolSplit: url.protocol,
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

export const getStationCategoryFromDetail = (station: StationOnCreation, env: string) => {
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

  // Async GPD
  if (station.targetHost === '' && isGPD) {
    const {
      protocolSplit,
      hostSplit: ip,
      portSplit,
      pathSplit: service,
    } = splitURL(station.gdpConcat);

    const protocol = protocolSplit === 'https:' ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80;

    // IP/PORT/SERVICE/PROTOCOL fields will be valorized with GPD values
    return { ...station, protocol, ip, port, service };
  }

  // Sync New Connectivity
  if (station.targetConcat !== '' && isForwarder) {
    const {
      protocolSplit: targetProtocol,
      hostSplit: targetHost,
      portSplit: targetPortSplit,
      pathSplit: targetPath,
    } = splitURL(station.targetConcat);

    const targetPort =
      targetPortSplit > 0 ? targetPortSplit : targetProtocol === 'https:' ? 443 : 80;

    const {
      protocolSplit: protocolForwarder,
      hostSplit: ip,
      portSplit,
      pathSplit: service,
    } = splitURL(station.newConnConcat);

    const protocol = protocolForwarder === 'https:' ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : targetProtocol === 'https:' ? 443 : 80;

    const targetHostPof = targetProtocol + '//' + targetHost;
    const targetPortPof = targetPort;
    const targetPathPof = targetPath;

    // a. target_host_pof/target_port_pof/target_path_pof will be valorized with Target values
    //   B. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Forwarder values

    return {
      ...station,
      targetHostPof,
      targetPortPof,
      targetPathPof,
      protocol,
      ip,
      port,
      service,
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

    const protocol = protocolSplit === 'https:' ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
    const port = portSplit > 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80;

    // a. IP/PORT/SERVICE/PROTOCOL fields will be valorized with Target
    return { ...station, protocol, ip, port, service };
  }

  return station;
};
