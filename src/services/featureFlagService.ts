import {BackofficeApi} from "../api/BackofficeClient";
import {FeatureFlags} from "../api/generated/portal/FeatureFlags";

export const getFlags = (): Promise<FeatureFlags> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return mockFlag();
    } else {
        return BackofficeApi.getFeatureFlags();
    }
};

export const mockFlag = (): Promise<FeatureFlags> => {
        const ff: FeatureFlags = {flags: {'isOperator': false, 'payment-notices': true}};
        return new Promise((resolve) => resolve(ff));
    }
;

