import { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useUserRole } from '../../../hooks/useUserRole';
import ROUTES from '../../../routes';
import { ConfigurationStatus } from '../../../model/Station';
import TableSearchBar from '../../../components/Table/TableSearchBar';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import StationsTable from './StationsTable';

export const clearLocationState = () => {
  window.history.replaceState({}, document.title);
};

const componentPath = 'stationsPage';
export default function StationsPage() {
  const { t } = useTranslation();
  const history = useHistory();
  const { userIsPagopaOperator } = useUserRole();

  const [stationCodeInput, setStationCodeInput] = useState<string>('');
  const [stationCode, setStationCode] = useState<string>('');
  const [tabFilter, setTabFilter] = useState<number>(userIsPagopaOperator ? 1 : 0);

  const tabList = [
    {
      label: t(`${componentPath}.search.tabActive`),
      'data-testid': 'active',
      value: ConfigurationStatus.ACTIVE
    },
    {
      label: t(`${componentPath}.search.tabToBeValidated`),
      'data-testid': 'toBeValidated',
      value: ConfigurationStatus.TO_BE_VALIDATED
    },
  ];

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
        title={t(`${componentPath}.title`)}
        subTitle={t(`${componentPath}.subtitle`)}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}

      <TableSearchBar
        componentName="stationsPage"
        setExternalSearchInput={setStationCodeInput}
        customEndButton={
          !userIsPagopaOperator && (
            <Button
              component={Link}
              to={ROUTES.STATION_ADD}
              variant="contained"
              sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
              disabled={userIsPagopaOperator}
              data-testid={'create-station'}
            >
              {t(`${componentPath}.search.createButton`)}
            </Button>
          )
        }
        setActiveTab={setTabFilter}
        activeTab={tabFilter}
        listTabFilter={tabList}
      />

      <StationsTable stationCode={stationCode} statusFilter={tabList[tabFilter]?.value}/>
    </SideMenuLayout>
  );
}
