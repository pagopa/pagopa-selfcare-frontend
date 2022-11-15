import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { useCallback, useEffect, useState } from 'react';
import tosJson from '../data/tos.json';
import { userFromJwtToken } from './useLogin';

const useTOSAgreementLocalStorage = (localStorageKey = 'acceptTOS') => {
  const jwt = storageTokenOps.read();
  const user: User = userFromJwtToken(jwt);

  const getLocalStorageTOS = () => localStorage.getItem(localStorageKey);

  const removeLocalStorageTOS = useCallback(() => {
    localStorage.removeItem(localStorageKey);
  }, [localStorageKey]);

  const acceptTOS = () => {
    const id = JSON.stringify({ id: user?.uid, timestamp: new Date().toISOString() });
    localStorage.setItem(localStorageKey, id);
    setAcceptedTOS(localStorage.getItem(localStorageKey));
  };

  const [acceptedTOS, setAcceptedTOS] = useState<string | null>(getLocalStorageTOS());

  useEffect(() => {
    if (acceptedTOS) {
      const acceptedTOSTimestamp = JSON.parse(acceptedTOS).timestamp;
      if (new Date(tosJson.date) > new Date(acceptedTOSTimestamp)) {
        removeLocalStorageTOS();
        setAcceptedTOS('');
      }
    }
  }, [acceptedTOS]);

  return { isTOSAccepted: !!acceptedTOS, acceptTOS, acceptedTOS };
};

export default useTOSAgreementLocalStorage;
