import { ArrowForward } from '@mui/icons-material';
import { Box, Grid, Typography, Alert, Card, Button } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import SideMenu from '../../components/SideMenu/SideMenu';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import ROUTES from '../../routes';
import OperativeTable from './components/OperativeTable';
import ECRegistrationData from './components/ECRegistrationData';
import PSPRegistrationData from './components/PSPRegistrationData';

const DashboardPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
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
          <TitleBox
            title={t('dashboardPage.title')}
            subTitle={t('dashboardPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
          {history.location.state && (history.location.state as any).alertSuccessMessage && (
            <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
              {(history.location.state as any).alertSuccessMessage}
            </Alert>
          )}

          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
                <Box mb={3}>
                  <Typography variant="h6">{t('dashboardPage.registrationData.title')}</Typography>
                </Box>
                <Grid container spacing={3} pb={4}>
                  {selectedParty?.pspData ? (
                    <PSPRegistrationData></PSPRegistrationData>
                  ) : (
                    <ECRegistrationData></ECRegistrationData>
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
                <Typography variant="h6" mb={3}>
                  {t('dashboardPage.nextStep.title')}
                </Typography>
                <Box mb={3}>
                  <Alert severity="warning">{t('dashboardPage.nextStep.signInStepAlert')}</Alert>
                </Box>
                {selectedParty?.roles.find((r) => r.roleKey === 'admin') && (
                  <Button
                    component={Link}
                    to={ROUTES.NODE_SIGNIN}
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward />}
                  >
                    {t('dashboardPage.nextStep.signInCTA')}
                  </Button>
                )}
              </Card>
            </Grid>
            {selectedParty?.pspData === undefined ? <OperativeTable /> : null}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
