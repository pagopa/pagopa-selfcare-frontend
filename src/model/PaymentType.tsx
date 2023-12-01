import { PaymentType } from '../api/generated/portal/PaymentType';

export function sortPaymentType(array: Readonly<Array<PaymentType>>) {
  return [...array].sort((a, b) => a.description!.localeCompare(b!.description!));
}
