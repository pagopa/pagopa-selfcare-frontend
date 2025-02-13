import { QuicksightEmbedUrlResponse } from '../../api/generated/portal/QuicksightEmbedUrlResponse';

export const mockedDashboardUrl: QuicksightEmbedUrlResponse = {
  embedUrl: 'mocked-url',
};

export const getMockEmbedUrlForAnonymousUser = (
  _institutionId: string
): Promise<QuicksightEmbedUrlResponse> => Promise.resolve(mockedDashboardUrl);
