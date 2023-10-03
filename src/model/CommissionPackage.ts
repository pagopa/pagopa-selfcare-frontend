import { PaymentTypeResource } from '../api/generated/portal/PaymentTypeResource';

export enum FormAction {
  Create = 'create',
  Edit = 'edit',
}

export type CommissionPackageOnCreation = {
  abi?: string;
  description?: string;
  digitalStamp?: boolean;
  digitalStampRestriction?: boolean;
  idBrokerPsp?: string;
  idCdi?: string;
  idChannel?: string;
  maxPaymentAmount?: number;
  minPaymentAmount?: number;
  name?: string;
  paymentAmount?: number;
  paymentType?: PaymentTypeResource;
  touchpoint?: TouchpointsResource;
  transferCategoryList?: Array<string>;
  type?: 'GLOBAL' | 'PUBLIC' | 'PRIVATE';
  validityDateFrom?: Date;
  validityDateTo?: Date;
};

export type CommissionPackageResource = {
  packageName: string;
  startDate: Date;
  endDate: Date;
  touchpoint: string;
  paymentType: PaymentTypeResource;
  rangeAmountFrom: number;
  rangeAmountTo: number;
};
export type TouchpointResource = { touchpoint: string };
export type TouchpointsResource = { touchpointList: Array<TouchpointResource> };

export type TaxonomyServiceResource = { taxonomyService: string };
export type TaxonomyServicesResource = { taxonomyServiceList: Array<TaxonomyServiceResource> };

export type CommissionPackageListResource = {
  commPackagesList: Array<CommissionPackageResource>;
  pageInfo: {
    items_found: number;
    limit: number;
    page: number;
    total_pages: number;
  };
};
