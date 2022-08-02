import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { useLogin } from '../hooks/useLogin';
import { LOADING_TASK_LOGIN_CHECK } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/ban-types
type LoginProps = {};

/** Decorator to check if there is a valid JWT token, loading into redux the logged user */
export default function withLogin<T extends LoginProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithLogin = (props: Omit<T, keyof LoginProps>) => {
    const user = useSelector(userSelectors.selectLoggedUser);
    const { attemptSilentLogin } = useLogin();
    const setLoading = useLoading(LOADING_TASK_LOGIN_CHECK);

    useEffect(() => {
      async function asyncAttemptSilentLogin() {
        await attemptSilentLogin();
      }

      if (!user) {
        setLoading(true);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        asyncAttemptSilentLogin().finally(() => setLoading(false));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return user ? <WrappedComponent {...(props as T)} /> : <></>;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithLogin.displayName = `withLogin(${displayName})`;

  return ComponentWithLogin;
}
