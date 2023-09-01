import { ArrowBack, FileDownload } from '@mui/icons-material';
import { Alert, Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import SideMenu from '../../../components/SideMenu/SideMenu';
import ROUTES from '../../../routes';
// import { mockedStationECs } from '../../../services/__mocks__/stationService';
import StationECTable from './StationECTable';

const StationECListPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { stationId } = useParams<{ stationId: string }>();
  const [alertMessage, setAlertMessage] = useState('');
  const goBack = () => history.push(ROUTES.STATIONS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (history.location.state && (history.location.state as any).alertSuccessMessage) {
      setAlertMessage((history.location.state as any).alertSuccessMessage);
      window.history.replaceState({}, document.title);
    }
  }, []);

  setTimeout(() => setAlertMessage(''), 6000);

  const downloadCSV = () => {
    // TODO: fetch form station service
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
            <Typography fontSize={16}>{stationId}</Typography>
            <Typography fontWeight={'fontWeightMedium'}>{t('stationECList.title')}</Typography>
          </Breadcrumbs>
        </Stack>

        <Stack direction="row" justifyContent={'space-between'}>
          <Box>
            <TitleBox
              title={t('stationECList.title')}
              subTitle={t('stationECList.subtitle')}
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
              {t('stationECList.csvDownload')}
            </Button>
          </Box>
        </Stack>

        {alertMessage && (
          <Alert
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
            severity="success"
            variant="outlined"
          >
            {alertMessage}
          </Alert>
        )}
        <Box display="flex" width="100%" mt={0}>
          <Box pt={0} display="flex" width="100%">
            <StationECTable setAlertMessage={setAlertMessage} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StationECListPage;
