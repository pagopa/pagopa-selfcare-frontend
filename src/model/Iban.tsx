import { IbanLabel } from '../api/generated/portal/IbanLabel';

export enum IbanFormAction {
  Create = 'create',
  Edit = 'edit',
}

export type IbanOnCreation = {
  iban: string;
  description?: string;
  validity_date: Date;
  due_date: Date;
  creditor_institution_code: string;
  ec_owner?: string;
  labels?: Readonly<Array<IbanLabel>>;
  is_active: boolean;
  publication_date?: Date;
};
