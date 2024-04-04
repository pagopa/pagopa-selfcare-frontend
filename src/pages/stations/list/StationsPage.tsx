import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import StationsTable from './StationsTable';
import StationsTableSearchBar from './StationsTableSearchBar';

export const clearLocationState = () => {
  window.history.replaceState({}, document.title);
};

export default function StationsPage() {
  const { t } = useTranslation();
  const history = useHistory();

  const [stationCodeInput, setStationCodeInput] = useState<string>('');
  const [stationCode, setStationCode] = useState<string>('');

  useEffect(() => {
    const setSearchValue = setTimeout(() => {
      setStationCode(stationCodeInput);
    }, 500);

    return () => clearTimeout(setSearchValue);
  }, [stationCodeInput]);

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  return (
    <SideMenuLayout>
      <TitleBox
        title={t('stationsPage.title')}
        subTitle={t('stationsPage.subtitle')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}

      <StationsTableSearchBar
        stationCodeInput={stationCodeInput}
        setStationCodeInput={setStationCodeInput}
      />
      <StationsTable stationCode={stationCode} />
    </SideMenuLayout>
  );
}
