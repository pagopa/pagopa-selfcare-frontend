import { ReceiptsInfo } from '../../api/generated/portal/ReceiptsInfo';

export const mockedPaymentsReceiptsList: ReceiptsInfo = {
  receipts_list: [
    {
      organizationFiscalCode: 'orgTaxCode1',
      iuv: 'iuv1',
      debtor: 'debtorTaxCode1',
      paymentDateTime: '01/01/2020',
      status: 'STATUS',
    },
    {
      organizationFiscalCode: 'orgTaxCode2',
      iuv: 'iuv2',
      debtor: 'debtorTaxCode2',
      paymentDateTime: '01/01/2020',
      status: 'STATUS',
    },
    {
      organizationFiscalCode: 'orgTaxCode3',
      iuv: 'iuv3',
      debtor: 'debtorTaxCode3',
      paymentDateTime: '01/01/2020',
      status: 'STATUS',
    },
  ],
};
