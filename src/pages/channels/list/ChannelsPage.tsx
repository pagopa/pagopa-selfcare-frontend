import { Alert, Button } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../../components/Table/TableSearchBar';
import { useUserRole } from '../../../hooks/useUserRole';
import { ConfigurationStatus } from '../../../model/Station';
import ROUTES from '../../../routes';
import ChannelsTable from './ChannelsTable';

export const clearLocationState = () => {
  window.history.replaceState({}, document.title);
};

const componentPath = 'channelsPage';
const Channels = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userIsPagopaOperator } = useUserRole();

  const [channelCodeInput, setChannelCodeInput] = useState<string>('');
  const [channelCodeFilter, setChannelCodeFilter] = useState<string>('');
  const [tabFilter, setTabFilter] = useState<number>(userIsPagopaOperator ? 1 : 0);

  const tabList = [
    {
      label: t(`${componentPath}.search.tabActive`),
      'data-testid': 'active',
      value: ConfigurationStatus.ACTIVE,
    },
    {
      label: t(`${componentPath}.search.tabToBeValidated`),
      'data-testid': 'toBeValidated',
      value: ConfigurationStatus.TO_BE_VALIDATED,
    },
  ];

  useEffect(() => {
    const setSearchValue = setTimeout(() => {
      setChannelCodeFilter(channelCodeInput);
    }, 500);

    return () => clearTimeout(setSearchValue);
  }, [channelCodeInput]);

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
        componentName="channelsPage"
        setExternalSearchInput={setChannelCodeInput}
        customEndButton={
          !userIsPagopaOperator && (
            <Button
              component={Link}
              to={ROUTES.CHANNEL_ADD}
              variant="contained"
              sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
              disabled={userIsPagopaOperator}
              data-testid={'create-channel'}
            >
              {t(`${componentPath}.search.createButton`)}
            </Button>
          )
        }
        setActiveTab={setTabFilter}
        activeTab={tabFilter}
        listTabFilter={tabList}
      />

      <ChannelsTable channelCodeFilter={channelCodeFilter} statusFilter={tabList[tabFilter]?.value}/>
    </SideMenuLayout>
  );
};

export default Channels;
