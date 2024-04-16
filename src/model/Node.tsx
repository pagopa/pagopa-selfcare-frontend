import { BrokerAndEcDetailsResource } from '../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';
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

export type PTResource = {
  brokerPspDetailsResource?: BrokerPspDetailsResource;
  brokerDetailsResource?: BrokerResource;
};

export type SigninData = BrokerOrPspDetailsResource & BrokerAndEcDetailsResource;
