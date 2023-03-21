import { Alert, Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SideMenu from '../../../components/SideMenu/SideMenu';
import StationsTable from './StationsTable';

export default function StationsPage() {
  const { t } = useTranslation();

  const history = useHistory();

  return (
    <Grid container item xs={12} sx={{ backgroundColor: '#F5F5F5' }}>
      <Grid item xs={2} sx={{ backgroundColor: 'background.paper' }}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid item xs={10} display="flex" flexDirection="column" pb={8} px={3}>
        <Box width="100%">
          <TitleBox
            title={t('stationsPage.title')}
            subTitle={t('stationsPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        {history.location.state && (history.location.state as any).alertSuccessMessage && (
          <Alert severity="success" variant="outlined">
            {(history.location.state as any).alertSuccessMessage}
          </Alert>
        )}

        <Box display="flex" width="100%" mt={3}>
          <Box pt={2} display="flex" width="100%">
            <StationsTable />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
