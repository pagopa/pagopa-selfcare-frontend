import { Alert, Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import ChannelsTable from './ChannelsTable';
import ChannelsTableSearchBar from './ChannelsTableSearchBar';

export const clearLocationState = () => {
  window.history.replaceState({}, document.title);
};

const Channels = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [channelCodeInput, setChannelCodeInput] = useState<string>('');
  const [channelCodeFilter, setChannelCodeFilter] = useState<string>('');

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
        title={t('channelsPage.title')}
        subTitle={t('channelsPage.subtitle')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}
      <ChannelsTableSearchBar
        channelCodeInput={channelCodeInput}
        setChannelCodeInput={setChannelCodeInput}
      />
      <ChannelsTable channelCodeFilter={channelCodeFilter} />
    </SideMenuLayout>
  );
};

export default Channels;
