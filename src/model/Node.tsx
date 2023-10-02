import { BrokerOrPspDetailsResource } from '../api/generated/portal/BrokerOrPspDetailsResource';
import { CreditorInstitutionDetailsResource } from '../api/generated/portal/CreditorInstitutionDetailsResource';

export type NodeOnSignInPSP = {
  name: string;
  businessName: string;
  fiscalCode: string;
  abiCode: string;
  pspCode: string;
  bicCode: string;
  digitalStamp: boolean;
};

export type SigninData = BrokerOrPspDetailsResource | CreditorInstitutionDetailsResource;
