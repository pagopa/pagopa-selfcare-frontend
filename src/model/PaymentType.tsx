import { PaymentTypeResource } from '../api/generated/portal/PaymentTypeResource';

export function sortPaymentType(array: Readonly<Array<PaymentTypeResource>>) {
  return [...array].sort((a, b) => a.description.localeCompare(b.description));
}
