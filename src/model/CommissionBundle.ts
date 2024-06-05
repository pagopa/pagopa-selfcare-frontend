import { CIBundleFee } from "../api/generated/portal/CIBundleFee";
import { CIBundleResource } from "../api/generated/portal/CIBundleResource";
import { CIBundlesResource } from "../api/generated/portal/CIBundlesResource";
import { CIBundleSubscriptionsDetail } from "../api/generated/portal/CIBundleSubscriptionsDetail";
import { CISubscriptionInfo } from "../api/generated/portal/CISubscriptionInfo";
import { PSPBundleResource } from "../api/generated/portal/PSPBundleResource";
import { PSPBundlesResource } from "../api/generated/portal/PSPBundlesResource";
import { PSPBundleTaxonomy } from "../api/generated/portal/PSPBundleTaxonomy";

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
}
export enum RequestStateType {
  Waiting = 'WAITING',
  Accepted = 'ACCEPTED',
}

export enum OfferStateType {
  Waiting = 'WAITING',
  Active = 'ACTIVE',
}

export type BundleCISubscriptionsMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  limit: number;
  page: number;
  status: RequestStateType;
  ciTaxCode?: string;
};

export type BundleCISubscriptionsBodyRequest = {
  'id-bundle': string;
  'psp-tax-code': string;
  limit: number;
  page: number;
  status: RequestStateType;
  ciTaxCode?: string;
};

export type BundleCiSubscriptionsDetailMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  ciTaxCode: string;
  status: string;
};

export type BundleCiSubscriptionDetailModel = CISubscriptionInfo & CIBundleSubscriptionsDetail;

export enum BundleDetailsActionTypes {
  DELETE_BUNDLE_PSP = "deleteBundlePsp",
  DELETE_BUNDLE_EC = "deleteBundleEc",
  REJECT_OFFER_EC = "rejectOfferEc",
  ACCEPT_OFFER_EC = "acceptOfferEc",
  DELETE_REQUEST_EC = "deleteRequestEc",
  CREATE_REQUEST_EC = "createRequestEc"
}

export type BundlesResource = PSPBundlesResource | CIBundlesResource;
export type BundleResource =  PSPBundleResource | CIBundleResource;
export type BundleTaxonomy = PSPBundleTaxonomy | CIBundleFee;