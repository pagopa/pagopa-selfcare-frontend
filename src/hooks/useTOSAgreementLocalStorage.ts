import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useCallback, useEffect, useState } from 'react';
import { userFromJwtToken } from './useLogin';

export function useTOSAgreementLocalStorage(localStorageKey = 'acceptTOS') {
  const getLocalStorageTOS = useCallback(() => {
    localStorage.getItem(localStorageKey);
  }, [localStorageKey]);

  const [tosAcceptedId, setTOSAcceptedId] = useState<any>(localStorage.getItem(localStorageKey)); // getLocalStorageTOS()
  console.log(localStorageKey);
  const jwt = storageTokenOps.read();
  const user: User = userFromJwtToken(jwt);

  useEffect(() => {
    function listenForStorage() {
      setTOSAcceptedId(getLocalStorageTOS());
    }
    window.addEventListener('storage', listenForStorage);
    return () => {
      window.removeEventListener('storage', listenForStorage);
    };
  }, [getLocalStorageTOS]);

  const acceptTOS = useCallback(() => {
    const id = JSON.stringify({ id: user?.uid, timestamp: new Date().toISOString() });
    setTOSAcceptedId(id);
    localStorage.setItem(localStorageKey, id);
  }, [localStorageKey, user?.uid]);

  return { isTOSAccepted: !!tosAcceptedId, acceptTOS, tosAcceptedId };
}
