import { ApiRequestType, IResponseType, TypeofApiResponse } from '@pagopa/ts-commons/lib/requests';
import { isRight, toError } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { ENV } from './env';

export const extractResponse = async <R>(
  response: t.Validation<
    TypeofApiResponse<ApiRequestType<any, any, any, IResponseType<any, any, any>>>
  >,
  successHttpStatus: number,
  onRedirectToLogin: () => void,
  notValidTokenHttpStatus: number | null = 401,
  notAuthorizedTokenHttpStatus: number | null = 403
): Promise<R> => {
  if (isRight(response)) {
    if (response.right.status === successHttpStatus) {
      return response.right.value;
    } else if (notValidTokenHttpStatus && response.right.status === notValidTokenHttpStatus) {
      onRedirectToLogin();
      window.setTimeout(() => window.location.assign(ENV.URL_FE.LOGOUT), 2000);
      return new Promise(() => null);
    } else if (
      notAuthorizedTokenHttpStatus &&
      response.right.status === notAuthorizedTokenHttpStatus
    ) {
      throw new Error(`Operation not allowed!`);
    } else {
      throw new Error(
        JSON.stringify({ status: response.right.status, response: response.right.value })
      );
    }
  } else {
    console.error('Something gone wrong while fetching data');
    console.error(JSON.stringify(response.left));
    throw toError(response.left);
  }
};

export const extractProblemJson = (data: any): any => {
  try {
    return data?.message ? JSON.parse(data.message) : {};
  } catch (_) {
    return {};
  }
};
