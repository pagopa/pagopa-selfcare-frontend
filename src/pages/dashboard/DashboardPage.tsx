import { Alert, Box, Card, Grid, Typography } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { usePermissions } from '../../hooks/usePermissions';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { ENV } from '../../utils/env';
import DownloadSection from './components/DownloadSection';
import ECRegistrationData from './components/ECRegistrationData';
import NextSteps from './components/NextSteps';
import OperationTable from './components/OperationTable';
import PSPRegistrationData from './components/PSPRegistrationData';
import PTRegistrationData from './components/PTRegistrationData';

const DashboardPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const { hasPermission } = usePermissions();

  return (
    <SideMenuLayout>
      <TitleBox
        title={t('dashboardPage.title')}
        subTitle={t('dashboardPage.subtitle')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
            <Box mb={3}>
              <Typography variant="h6">{t('dashboardPage.registrationData.title')}</Typography>
            </Box>
            <Grid container spacing={3} pb={4}>
              {selectedParty?.institutionType === 'PSP' ? (
                <PSPRegistrationData />
              ) : selectedParty?.institutionType === 'PT' ? (
                <PTRegistrationData />
              ) : (
                <ECRegistrationData />
              )}
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <NextSteps selectedParty={selectedParty} signinData={signinData}></NextSteps>
          <DownloadSection selectedParty={selectedParty}></DownloadSection>
        </Grid>

        {selectedParty &&
          hasPermission('operation-table-read-write') &&
          ENV.FEATURES.OPERATIONTABLE.ENABLED && (
            <OperationTable ecCode={selectedParty.fiscalCode} />
          )}
      </Grid>
    </SideMenuLayout>
  );
};

export default DashboardPage;
