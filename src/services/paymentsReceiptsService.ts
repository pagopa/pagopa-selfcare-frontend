import { BackofficeApi } from '../api/BackofficeClient';
import { ReceiptsInfo } from '../api/generated/portal/ReceiptsInfo';
import { mockedPaymentsReceiptsList } from './__mocks__/paymentsReceiptsService';

export const getPaymentsReceipts = (
  organizationTaxCode: string,
  debtorTaxCode?: string
): Promise<ReceiptsInfo> => {
  if (process.env. REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return new Promise((resolve) => resolve(mockedPaymentsReceiptsList));
  } else {
    return BackofficeApi.getPaymentsReceipts(organizationTaxCode, debtorTaxCode).then(
      (data) => data
    );
  }
};

export const getPaymentReceiptDetail = (
  organizationTaxCode: string,
  iuv: string
): Promise<string> => {
  if (process.env.REACT_APP_API_MOCK_SELFCARE === 'true') {
    return new Promise((resolve) => resolve('<note><body>example xml</body></note>'));
  } else {
    return BackofficeApi.getPaymentReceiptDetail(organizationTaxCode, iuv).then((data) => data);
  }
};
