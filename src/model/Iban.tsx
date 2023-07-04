import { IbanLabel } from '../api/generated/portal/IbanLabel';

export enum IbanFormAction {
  Create = 'create',
  Edit = 'edit',
}

export type IbanOnCreation = {
  iban?: string;
  description?: string;
  validityDate: Date | null;
  dueDate: Date | null;
  creditorInstitutionCode?: string;
  publicationDate?: Date | null;
  ecOwner?: string;
  labels?: Readonly<Array<IbanLabel>>;
};
