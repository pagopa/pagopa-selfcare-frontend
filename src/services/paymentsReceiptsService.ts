import {BackofficeApi} from '../api/BackofficeClient';
import {PaymentsResult} from '../api/generated/portal/PaymentsResult';
import {PaymentsReceiptsListMethodParams} from '../model/PaymentsReceipts';
import {mockedPaymentsReceiptsList} from './__mocks__/paymentsReceiptsService';

export const getPaymentsReceipts = ({
                                        organizationTaxCode,
                                        debtorTaxCodeOrIuv,
                                        filterYear,
                                        page,
                                        pageLimit,
                                    }: PaymentsReceiptsListMethodParams): Promise<PaymentsResult> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return Promise.resolve(mockedPaymentsReceiptsList);
    } else {
        return BackofficeApi.paymentReceipts.getPaymentsReceipts({
            organizationTaxCode,
            debtorTaxCodeOrIuv,
            filterYear,
            page,
            pageLimit,
        }).then((data) => data);
    }
};

export const getPaymentReceiptDetail = (
    organizationTaxCode: string,
    iuv: string
): Promise<string> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return Promise.resolve('<note><body>example xml</body></note>');
    } else {
        return BackofficeApi.paymentReceipts.getPaymentReceiptDetail(organizationTaxCode, iuv);
    }
};
