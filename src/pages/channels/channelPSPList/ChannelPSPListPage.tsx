import { ArrowBack, FileDownload } from '@mui/icons-material';
import { Alert, Box, Button, Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import SideMenu from '../../../components/SideMenu/SideMenu';
import ROUTES from '../../../routes';
import { mockedChannelPSPs } from '../../../services/__mocks__/channelService';
import ChannelPSPTable from './ChannelPSPTable';

const ChannelPSPListPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { channelId } = useParams<{ channelId: string }>();
  const [alertMessage, setAlertMessage] = useState('');
  const goBack = () => history.push(ROUTES.CHANNELS);

  useEffect(() => {
    if (history.location.state && (history.location.state as any).alertSuccessMessage) {
      setAlertMessage((history.location.state as any).alertSuccessMessage);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const downloadCSV = () => {
    // TODO: fetch current PSP associated with channel
    const rows = mockedChannelPSPs.channels;
    const headers = ['Nome PSP', 'Referente'];

    const csvContent = `${headers.join(';')}\n${rows
      .map((e) => [e.channel_code, e.broker_description].join(';'))
      .join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `PSP-channel-${channelId}.csv`);
    a.click();
  };

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        container
        item
        xs={10}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        sx={{ backgroundColor: '#F5F5F5' }}
        pb={8}
        pt={4}
        px={3}
      >
        <Stack direction="row" mb={3}>
          <ButtonNaked
            size="small"
            component="button"
            onClick={goBack}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px', fontWeight: 700 }}
            weight="default"
          >
            {t('general.back')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography fontSize={16}>{channelId}</Typography>
            <Typography fontWeight={600}>{t('channelPSPList.title')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" justifyContent={'space-between'}>
          <Box>
            <TitleBox
              title={t('channelPSPList.title')}
              subTitle={t('channelPSPList.subtitle')}
              mbTitle={2}
              mbSubTitle={3}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Box>
          <Box>
            <Button
              variant="outlined"
              sx={{ display: 'none' }}
              startIcon={<FileDownload />}
              onClick={() => downloadCSV()}
            >
              {t('channelPSPList.csvDownload')}
            </Button>
          </Box>
        </Stack>

        {alertMessage && (
          <Alert sx={{ mb: 3 }} severity="success" variant="outlined">
            {alertMessage}
          </Alert>
        )}
        <Box display="flex" width="100%" mt={0}>
          <Box pt={0} display="flex" width="100%">
            <ChannelPSPTable setAlertMessage={setAlertMessage} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChannelPSPListPage;
