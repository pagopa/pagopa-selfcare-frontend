import { useState } from 'react';
import { Alert, Grid, IconButton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ButtonNaked } from '@pagopa/mui-italia';
import DownloadIcon from '@mui/icons-material/Download';
import { formatDateToDDMMYYYY } from '../../utils/common-utils';
import SideMenu from '../../components/SideMenu/SideMenu';
import DelegationsTable from './list/DelegationsTable';
import DelegationTableSearchBar from './list/DelegationTableSearchBar';

const DelegationsPage = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const downloadList = () => {
    /* TODO DOWNLOAD LIST */
    const date = new Date();
    setAlertMessage(
      t('delegationsPage.alertMessage', {
        date: formatDateToDDMMYYYY(date),
        hours: `${date.getHours}:${date.getMinutes}`,
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
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <IconButton onClick={downloadList} data-testid="download-list-button">
                <DownloadIcon /> {t('delegationsPage.downloadButton')}
              </IconButton>
            </Box>
          </Stack>
          {alertMessage && (
            <Alert severity="success" variant="outlined" data-testid="alert-test">
              <Stack direction="row" justifyContent="space-between">
                {alertMessage}
                <ButtonNaked
                  size="medium"
                  component="button"
                  onClick={() => setAlertMessage('')}
                  sx={{ color: 'primary.main', mr: '20px' }}
                  weight="default"
                  data-testid="got-it-button"
                >
                  {t('general.gotIt')}
                </ButtonNaked>
              </Stack>
            </Alert>
          )}
          <DelegationTableSearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
          <DelegationsTable filterByName={searchInput} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default DelegationsPage;
