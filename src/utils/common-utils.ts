import { Iban } from "../api/generated/portal/Iban";

export const isIbanValid = (iban?: Iban) : boolean =>
    iban !== undefined && iban.due_date !== undefined && (new Date(iban.due_date) > new Date());

export const isIbanValidityDateEditable = (iban?: Iban) : boolean =>
    iban !== undefined && iban.validity_date !== undefined && (new Date(iban.validity_date) > new Date());