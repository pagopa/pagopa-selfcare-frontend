import { Iban } from "../api/generated/portal/Iban";

export const isIbanValid = (iban?: Iban) : boolean =>
    iban && iban.due_date && (new Date(iban.due_date) > new Date()) || false;