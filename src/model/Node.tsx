import { BrokerAndEcDetailsResource } from '../api/generated/portal/BrokerAndEcDetailsResource';
import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';

export type NodeOnSignInPSP = {
  name: string;
  businessName: string;
  fiscalCode: string;
  abiCode: string;
  pspCode: string;
  bicCode: string;
  digitalStamp: boolean;
};

export type SigninData = BrokerOrPspDetailsResource & BrokerAndEcDetailsResource;
