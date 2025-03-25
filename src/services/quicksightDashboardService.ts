import { BackofficeApi } from '../api/BackofficeClient';
import { QuicksightEmbedUrlResponse } from '../api/generated/portal/QuicksightEmbedUrlResponse';
import { getMockEmbedUrlForAnonymousUser } from './__mocks__/quicksightDashboardService';

export const getEmbedUrlForAnonymousUser = ({
  institutionId,
}: {
  institutionId?: string;
}): Promise<QuicksightEmbedUrlResponse> => {
  if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
    return getMockEmbedUrlForAnonymousUser();
  } else {
    return BackofficeApi.quicksightDashboard.getEmbedUrlForAnonymousUser({
      institutionId: institutionId,
    });
  }
};
