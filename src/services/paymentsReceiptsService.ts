import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { BackofficeApi } from '../api/BackofficeClient';
import { ReceiptsInfo } from '../api/generated/portal/ReceiptsInfo';
import { ENV } from '../utils/env';
import { mockedPaymentsReceiptsList } from './__mocks__/paymentsReceiptsService';

export const getPaymentsReceipts = (
  organizationTaxCode: string,
  debtorTaxCode?: string,
  filterYear?: number | null
): Promise<ReceiptsInfo> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve(mockedPaymentsReceiptsList);
  } else {
    return BackofficeApi.getPaymentsReceipts(organizationTaxCode, debtorTaxCode, filterYear).then((data) => data);
  }
};

export const getPaymentReceiptDetail = (
  organizationTaxCode: string,
  iuv: string
): Promise<string> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return Promise.resolve('<note><body>example xml</body></note>');
  } else {
    return BackofficeApi.getPaymentReceiptDetail(organizationTaxCode, iuv);
    // return BackofficeApi.getPaymentReceiptDetail('99999000013', iuv).then((data) => data); TODO fix generate library to receive XMLs
  }
};
