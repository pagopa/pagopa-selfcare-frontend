import { CIBundleFee } from '../api/generated/portal/CIBundleFee';
import { CIBundleResource } from '../api/generated/portal/CIBundleResource';
import { CIBundlesResource } from '../api/generated/portal/CIBundlesResource';
import { CIBundleSubscriptionsDetail } from '../api/generated/portal/CIBundleSubscriptionsDetail';
import { CISubscriptionInfo } from '../api/generated/portal/CISubscriptionInfo';
import { PSPBundleResource, TypeEnum } from '../api/generated/portal/PSPBundleResource';
import { PSPBundlesResource } from '../api/generated/portal/PSPBundlesResource';
import { PSPBundleTaxonomy } from '../api/generated/portal/PSPBundleTaxonomy';
import { datesAreOnSameDay } from '../utils/common-utils';

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
}

export enum SubscriptionStateType {
  Waiting = 'WAITING',
  Accepted = 'ACCEPTED',
}

export type BundleCISubscriptionsMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
  bundleType: TypeEnum;
};

export type BundleCISubscriptionsBodyRequest = {
  'id-bundle': string;
  'psp-tax-code': string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
  bundleType: TypeEnum;
};

export type BundleCiSubscriptionsDetailMethodParams = {
  idBundle: string;
  pspTaxCode: string;
  ciTaxCode: string;
  status: string;
  bundleType: TypeEnum;
};

export type BundleCiSubscriptionDetailModel = CISubscriptionInfo & CIBundleSubscriptionsDetail;

export enum BundleDetailsActionTypes {
  DELETE_BUNDLE_PSP = 'deleteBundlePsp',
  DELETE_BUNDLE_EC = 'deleteBundleEc',
  REJECT_OFFER_EC = 'rejectOfferEc',
  ACCEPT_OFFER_EC = 'acceptOfferEc',
  DELETE_REQUEST_EC = 'deleteRequestEc',
  CREATE_REQUEST_EC = 'createRequestEc',
}

export type BundlesResource = PSPBundlesResource | CIBundlesResource;
export type BundleResource = PSPBundleResource | CIBundleResource;
export type BundleTaxonomy = PSPBundleTaxonomy | CIBundleFee;

export const isBundleValid = (bundleDetail: BundleResource) =>
  bundleDetail.validityDateFrom && new Date().getTime() > bundleDetail.validityDateFrom.getTime();

export const isBundleDeleted = (bundleDetail: BundleResource) =>
  bundleDetail.validityDateTo && datesAreOnSameDay(new Date(), bundleDetail.validityDateTo);
