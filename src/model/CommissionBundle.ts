export enum FormAction {
  Create = 'create',
  Edit = 'edit',
}
export enum SubscriptionStateType {
  Waiting = 'waiting',
  Accepted = 'accepted'
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
  "id-bundle": string;
  "psp-tax-code": string;
  limit: number;
  page: number;
  status: SubscriptionStateType;
  ciTaxCode?: string;
};

