import { Alert, Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import SideMenu from '../../../components/SideMenu/SideMenu';
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
    <Grid container item xs={12} sx={{ backgroundColor: '#F5F5F5' }}>
      <Grid item xs={2} sx={{ backgroundColor: 'background.paper' }}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        pb={8}
        px={3}
      >
        <Box width="100%">
          <TitleBox
            title={t('channelsPage.title')}
            subTitle={t('channelsPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        {history.location.state && (history.location.state as any).alertSuccessMessage && (
          <Alert severity="success" variant="outlined" data-testid="alert-test">
            {(history.location.state as any).alertSuccessMessage}
          </Alert>
        )}
        <ChannelsTableSearchBar
          channelCodeInput={channelCodeInput}
          setChannelCodeInput={setChannelCodeInput}
        />
        <Box display="flex" width="100%" mt={3}>
          <Box pt={0} display="flex" width="100%">
            <ChannelsTable channelCodeFilter={channelCodeFilter} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Channels;
