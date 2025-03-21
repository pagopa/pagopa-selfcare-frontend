// /configuration endpoint
import {PaymentTypes} from '../../api/generated/portal/PaymentTypes';

// /configuration endpoint

export const mockedPaymentTypes: PaymentTypes = {
    payment_types: [
        {
            description: 'PostePay',
            payment_type: 'PPAY',
        },
        {
            description: 'Bonifico',
            payment_type: 'SEPA',
        },
        {
            description: 'Carta di Pagamento',
            payment_type: 'CP',
        },
    ],
};

export const getPaymentTypes = (): Promise<PaymentTypes> =>
    new Promise((resolve) => resolve(mockedPaymentTypes));
