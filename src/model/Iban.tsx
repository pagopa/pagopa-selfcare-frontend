export enum IbanFormAction {
  Create = 'create',
  Edit = 'edit',
}

export type IbanOnCreation = {
  ibanCode?: string;
  ibanDescription?: string;
  startDate?: Date;
  endDate?: Date;
  holderFiscalCode?: string;
};
