<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
import {CIBundleFee} from "../api/generated/portal/CIBundleFee";
import {CIBundleResource} from "../api/generated/portal/CIBundleResource";
import {CIBundlesResource} from "../api/generated/portal/CIBundlesResource";
import {CIBundleSubscriptionsDetail} from "../api/generated/portal/CIBundleSubscriptionsDetail";
import {CISubscriptionInfo} from "../api/generated/portal/CISubscriptionInfo";
import {PSPBundleResource, TypeEnum} from "../api/generated/portal/PSPBundleResource";
import {PSPBundlesResource} from "../api/generated/portal/PSPBundlesResource";
import {PSPBundleTaxonomy} from "../api/generated/portal/PSPBundleTaxonomy";
<<<<<<< HEAD
=======
import { CIBundleFee } from "../api/generated/portal/CIBundleFee";
import { CIBundleResource } from "../api/generated/portal/CIBundleResource";
import { CIBundlesResource } from "../api/generated/portal/CIBundlesResource";
import { CIBundleSubscriptionsDetail } from "../api/generated/portal/CIBundleSubscriptionsDetail";
import { CISubscriptionInfo } from "../api/generated/portal/CISubscriptionInfo";
import { PSPBundleResource, TypeEnum } from "../api/generated/portal/PSPBundleResource";
import { PSPBundlesResource } from "../api/generated/portal/PSPBundlesResource";
import { PSPBundleTaxonomy } from "../api/generated/portal/PSPBundleTaxonomy";
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
=======
>>>>>>> 3f32cfc3 (Formatting (#542))

export enum FormAction {
    Create = 'create',
    Edit = 'edit',
}

export enum SubscriptionStateType {
<<<<<<< HEAD
  Waiting = 'WAITING',
  Accepted = 'ACCEPTED'
}

export type BundleCISubscriptionsMethodParams = {
<<<<<<< HEAD
=======
    Waiting = 'WAITING',
    Accepted = 'ACCEPTED',
}

export type BundleCISubscriptionsMethodParams = {
>>>>>>> 3f32cfc3 (Formatting (#542))
    idBundle: string;
    pspTaxCode: string;
    limit: number;
    page: number;
    status: SubscriptionStateType;
    ciTaxCode?: string;
    bundleType: TypeEnum;
<<<<<<< HEAD
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
=======
  idBundle: string;
  pspTaxCode: string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
  bundleType: TypeEnum;
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
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
<<<<<<< HEAD
  idBundle: string;
  pspTaxCode: string;
  ciTaxCode: string;
  status: string;
  bundleType: TypeEnum;
>>>>>>> 85e19a10 ([VAS-776] feat: Implement Private Bundle Offers table for PSP (#526))
=======
    idBundle: string;
    pspTaxCode: string;
    ciTaxCode: string;
    status: string;
    bundleType: TypeEnum;
>>>>>>> 3f32cfc3 (Formatting (#542))
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
export type BundleResource = PSPBundleResource | CIBundleResource;
export type BundleTaxonomy = PSPBundleTaxonomy | CIBundleFee;
