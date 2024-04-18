import { useState } from 'react';
import { Alert, Button, Grid, Stack, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import DownloadIcon from '@mui/icons-material/Download';
import TableSearchBar from '../../components/Table/TableSearchBar';
import { formatDateToDDMMYYYY } from '../../utils/common-utils';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import DelegationsTable from './list/DelegationsTable';


const DelegationsPage = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const theme = useTheme();

  const downloadList = () => {
    /* TODO DOWNLOAD LIST (VAS-690) */
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    setAlertMessage(
      t('delegationsPage.alertMessage', {
        date: formatDateToDDMMYYYY(date),
        hours: `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`,
      })
    );
  };

  return (
    <SideMenuLayout>
      <Stack direction="row" justifyContent="space-between">
        <TitleBox
          title={t('delegationsPage.title')}
          subTitle={t('delegationsPage.subtitle')}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {/* <Button
          variant="outlined"
          onClick={downloadList}
          startIcon={<DownloadIcon />}
          color="primary"
          data-testid="download-list-button"
          sx={{
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: theme.spacing(0.5),
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'center',
            width: '11%',
          }}
        >
          {t('delegationsPage.downloadButton')}
        </Button> */}
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
      <TableSearchBar handleSearchTrigger={setSearchInput} componentName='delegationsPage'/>
      <DelegationsTable filterByName={searchInput} />
    </SideMenuLayout>
  );
};

export default DelegationsPage;
