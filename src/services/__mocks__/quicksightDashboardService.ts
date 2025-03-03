import { QuicksightEmbedUrlResponse } from '../../api/generated/portal/QuicksightEmbedUrlResponse';

export const mockedDashboardUrl: QuicksightEmbedUrlResponse = {
  embedUrl: 'mocked-url',
};

export const getMockEmbedUrlForAnonymousUser = (
): Promise<QuicksightEmbedUrlResponse> => Promise.resolve(mockedDashboardUrl);
