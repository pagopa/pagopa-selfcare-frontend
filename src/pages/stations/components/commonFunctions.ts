import { store } from '../../../redux/store';
import { ENV } from '../../../utils/env';

export const isOperator = (): boolean => {
  const user = store.getState().user.logged;
  const email = typeof user !== 'undefined' ? user.email : '';
  return ENV.PAGOPA_OPERATOR.MAIL_ADDRESSES.split(';').includes(email);
};
