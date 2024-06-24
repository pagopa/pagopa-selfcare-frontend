import {BackofficeApi} from '../../api/BackofficeClient';
import {TypeEnum} from '../../api/generated/portal/BundleRequest';
import {
    getPaymentReceiptDetail,
    getPaymentsReceipts
} from '../paymentsReceiptsService';

describe('PaymentsReceiptsService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false'};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Test getPaymentsReceipts', async () => {
        const spyOn = jest.spyOn(BackofficeApi, "getPaymentsReceipts").mockReturnValue(new Promise((resolve) => resolve([])));
        expect(getPaymentsReceipts("orgTaxCode", 'debtorTaxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
    test('Test createBundle', async () => {
        const spyOn = jest.spyOn(BackofficeApi, "getPaymentReceiptDetail").mockReturnValue(new Promise((resolve) => resolve("")));
        expect(getPaymentReceiptDetail("orgTaxCode", 'debtorTaxCode')).resolves.not.toThrow();
        expect(spyOn).toBeCalledTimes(1);
    });
});
