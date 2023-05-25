import { CreditorInstitutionDetailsResource } from '../api/generated/portal/CreditorInstitutionDetailsResource';
import { PaymentServiceProviderDetailsResource } from '../api/generated/portal/PaymentServiceProviderDetailsResource';

export type NodeOnSignInPSP = {
  name: string;
  businessName: string;
  fiscalCode: string;
  abiCode: string;
  pspCode: string;
  bicCode: string;
  digitalStamp: boolean;
};

export type SigninData = PaymentServiceProviderDetailsResource | CreditorInstitutionDetailsResource;
