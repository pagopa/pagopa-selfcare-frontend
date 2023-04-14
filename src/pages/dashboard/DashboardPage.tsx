import { useEffect, useState } from 'react';
import { Box, Grid, Typography, Alert, Card } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import SideMenu from '../../components/SideMenu/SideMenu';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { getCreditorInstitutionDetails, getPSPDetails } from '../../services/nodeService';
import { PaymentServiceProviderDetailsResource } from '../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { CreditorInstitutionDetailsResource } from '../../api/generated/portal/CreditorInstitutionDetailsResource';
import { LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS } from '../../utils/constants';
import OperativeTable from './components/OperativeTable';
import ECRegistrationData from './components/ECRegistrationData';
import PSPRegistrationData from './components/PSPRegistrationData';
import NextSteps from './components/NextSteps';

const DashboardPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [pspNodeData, setPspNodeData] = useState<PaymentServiceProviderDetailsResource>();
  const [ecNodeData, setEcNodeData] = useState<CreditorInstitutionDetailsResource>();

  useEffect(() => {
    if (
      selectedParty !== undefined &&
      selectedParty.pspData !== undefined &&
      selectedParty.institutionType === 'PSP'
    ) {
      getPSPDetails(selectedParty.fiscalCode)
        .then((response) => {
          setPspNodeData(response);
        })
        .catch((reason) =>
          addError({
            id: 'DASHBOARD_PAGE_PSP_DETAILS',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting psp details`,
            toNotify: true,
            displayableTitle: t('dashboardPage.registrationData.pspDetailsErrorMessageTitle'),
            displayableDescription: t('dashboardPage.registrationData.pspDetailsErrorMessageDesc'),
            component: 'Toast',
          })
        );
    } else if (
      selectedParty !== undefined &&
      selectedParty.pspData === undefined &&
      selectedParty.institutionType !== 'PSP'
    ) {
      setLoading(true);
      getCreditorInstitutionDetails(selectedParty.fiscalCode)
        .then((res) => {
          setEcNodeData(res);
        })
        .catch((reason) => {
          addError({
            id: 'DASHBOARD_PAGE_EC_DETAILS',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting ec details`,
            toNotify: true,
            displayableTitle: t('dashboardPage.registrationData.ecDetailsErrorMessageTitle'),
            displayableDescription: t('dashboardPage.registrationData.ecDetailsErrorMessageDesc'),
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [selectedParty]);

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
                  {selectedParty?.institutionType === 'PSP' ? (
                    <PSPRegistrationData pspNodeData={pspNodeData} />
                  ) : (
                    <ECRegistrationData ecNodeData={ecNodeData} />
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <NextSteps selectedParty={selectedParty} pspNodeData={pspNodeData}></NextSteps>
            </Grid>
            {selectedParty?.institutionType !== 'PSP' ? <OperativeTable /> : null}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
