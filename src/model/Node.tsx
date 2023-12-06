import { BrokerPspDetailsResource } from '../api/generated/portal/BrokerPspDetailsResource';
import { BrokerResource } from '../api/generated/portal/BrokerResource';

export type NodeOnSignInPSP = {
  name: string;
  businessName: string;
  fiscalCode: string;
  abiCode: string;
  pspCode: string;
  bicCode: string;
  digitalStamp: boolean;
};

export type NodeOnSignInPT = {
  name: string;
  businessName: string;
};

export type PTResource = BrokerPspDetailsResource & BrokerResource;

