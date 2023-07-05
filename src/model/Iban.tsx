import { IbanLabel } from '../api/generated/portal/IbanLabel';

export enum IbanFormAction {
  Create = 'create',
  Edit = 'edit',
}

export enum IbanStatus {
  ACTIVE = 'ACTIVE',
  NOT_ACTIVE = 'NOT_ACTIVE',
  IN_REVISION = 'IN_REVISION',
  TO_FIX = 'TO_FIX',
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
  status?: IbanStatus;
};
