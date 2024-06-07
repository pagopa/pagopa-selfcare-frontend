import {BackofficeApi} from "../api/BackofficeClient";
import {PaymentTypes} from "../api/generated/portal/PaymentTypes";
import {DISALLOWED_PAYMENT_TYPES} from '../utils/constants';
import {getPaymentTypes as getPaymentTypesMocked} from './__mocks__/configurationService';

// /configuration endpoint

export const getPaymentTypes = (): Promise<PaymentTypes> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return getPaymentTypesMocked();
    } else {
        return BackofficeApi.getPaymentTypes().then((results: PaymentTypes) => {
            if (results) {
                return {
                    "payment_types": results.payment_types?.filter(
                        (item) => !DISALLOWED_PAYMENT_TYPES.includes(item.payment_type))
                };
            }
            return results;
        });
    }
};
