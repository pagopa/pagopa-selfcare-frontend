import { BackofficeApi } from "../api/BackofficeClient";
import { QuicksightEmbedUrlResponse } from "../api/generated/portal/QuicksightEmbedUrlResponse";

export const getEmbedUrlForAnonymousUser = (institutionId: string): Promise<QuicksightEmbedUrlResponse> => {
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return new Promise((resolve) => resolve(""));
    } else {
        return BackofficeApi.quicksightDashboard.getEmbedUrlForAnonymousUser({institutionId});
    }
};