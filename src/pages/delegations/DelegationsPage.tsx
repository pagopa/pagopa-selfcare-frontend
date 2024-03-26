import { useState } from 'react';
import { Alert, Button, Grid, Stack, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import DownloadIcon from '@mui/icons-material/Download';
import { formatDateToDDMMYYYY } from '../../utils/common-utils';
import SideMenu from '../../components/SideMenu/SideMenu';
import DelegationsTable from './list/DelegationsTable';
import DelegationsTableSearchBar from './list/DelegationsTableSearchBar';

const DelegationsPage = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const theme = useTheme();

  const downloadList = () => {
    /* TODO DOWNLOAD LIST (VAS-690) */
    const date = new Date();
    setAlertMessage(
      t('delegationsPage.alertMessage', {
        date: formatDateToDDMMYYYY(date),
        hours: `${date.getHours()}:${date.getMinutes()}`,
      })
    );
  };

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        {/* TODO optimize layout with sidemenu for all pages */}
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={8}
      >
        <Box width="100%" px={2}>
          <Stack direction="row" justifyContent="space-between">
            <TitleBox
              title={t('delegationsPage.title')}
              subTitle={t('delegationsPage.subtitle')}
              mbTitle={2}
              mtTitle={4}
              mbSubTitle={3}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <Button
              variant="outlined"
              onClick={downloadList}
              startIcon={<DownloadIcon />}
              color="primary"
              data-testid="download-list-button"
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: theme.spacing(0.5),
                mt: 4,
                px: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'center',
                width: '11%',
              }}
            >
              {t('delegationsPage.downloadButton')}
            </Button>
          </Stack>
          {alertMessage && (
            <Alert
              severity="success"
              variant="outlined"
              data-testid="alert-test"
              sx={{ mb: 4, '.MuiAlert-message': { width: '100%' } }}
            >
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                {alertMessage}
                <ButtonNaked
                  size="medium"
                  component="button"
                  onClick={() => setAlertMessage('')}
                  sx={{ color: 'primary.main', ml: 'auto' }}
                  weight="default"
                  data-testid="got-it-button"
                >
                  {t('general.gotIt')}
                </ButtonNaked>
              </Box>
            </Alert>
          )}
          <DelegationsTableSearchBar setSearchInput={setSearchInput} />
          <DelegationsTable filterByName={searchInput} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DelegationsPage;
