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

export enum BundleDetailsActionTypes {
  DELETE_BUNDLE_PSP = "deleteBundlePsp",
  DELETE_BUNDLE_EC = "deleteBundleEc",
  REJECT_OFFER_EC = "rejectOfferEc",
  ACCEPT_OFFER_EC = "acceptOfferEc",
  DELETE_REQUEST_EC = "deleteRequestEc",
  CREATE_REQUEST_EC = "createRequestEc"
}