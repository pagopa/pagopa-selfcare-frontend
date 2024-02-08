import { BackofficeApi } from "../api/BackofficeClient";
import { PaymentTypes } from "../api/generated/portal/PaymentTypes";
import { getPaymentTypes as getPaymentTypesMocked } from './__mocks__/configurationService';

// /configuration endpoint

export const getPaymentTypes = (): Promise<PaymentTypes> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
      return getPaymentTypesMocked();
    } else {
      return BackofficeApi.getPaymentTypes();
    }
  };