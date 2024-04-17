export type PaymentsReceiptsListMethodParams = {
  organizationTaxCode: string;
  debtorTaxCodeOrIuv?: string;
  filterYear?: number | null;
  page?: number;
  pageLimit?: number;
};

export type PaymentsReceiptsListRequestBody = {
  'organization-tax-code': string;
  page?: number;
  limit?: number;
  debtorTaxCode?: string;
  fromDate?: string;
  toDate?: string;
  debtorOrIuv?: string;
};
