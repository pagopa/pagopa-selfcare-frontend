import { CISubscriptionInfo } from "../api/generated/portal/CISubscriptionInfo";
import { PublicBundleCISubscriptionsDetail } from "../api/generated/portal/PublicBundleCISubscriptionsDetail";

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
}
export enum SubscriptionStateType {
  Waiting = 'WAITING',
  Accepted = 'ACCEPTED',
}

export type PublicBundleCISubscriptionsMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
};

export type PublicBundleCISubscriptionsRequest = {
  'id-bundle': string;
  'psp-tax-code': string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
};

export type PublicBundleCiSubscriptionsDetailMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  ciTaxCode: string;
  status: string;
};

export type PublicBundleCiSubscriptionDetailModel = CISubscriptionInfo & PublicBundleCISubscriptionsDetail;