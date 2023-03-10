export enum RedirectProtocolEnum {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
}

export type StationOnCreation = {
  stationCode: string;
  primitiveVersion: string;
  redirectProtocol: RedirectProtocolEnum | undefined;
  redirectPort?: number | undefined;
  redirectIp: string;
  redirectService: string;
  redirectParameters: string;
  targetAddress: string;
  targetService: string;
  targetPort: number | undefined;
};
