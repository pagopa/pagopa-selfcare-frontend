import { IbanLabel } from '../api/generated/portal/IbanLabel';

export enum IbanFormAction {
  Create = 'create',
  Edit = 'edit',
}

export type IbanOnCreation = {
  iban: string;
  description?: string;
  validityDate: Date;
  dueDate: Date;
  creditorInstitutionCode: string;
  ecOwner?: string;
  labels?: Readonly<Array<IbanLabel>>;
  active: boolean;
  publicationDate?: Date;
};
