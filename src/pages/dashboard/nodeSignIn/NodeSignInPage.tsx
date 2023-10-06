import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { getBrokerAndEcDetails, getBrokerAndPspDetails } from '../../../services/nodeService';
import { LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS } from '../../../utils/constants';
import { BrokerOrPspDetailsResource } from '../../../api/generated/portal/BrokerOrPspDetailsResource';
import { BrokerAndEcDetailsResource } from '../../../api/generated/portal/BrokerAndEcDetailsResource';
import NodeSignInPSPForm from './NodeSignInPSPForm';
import NodeSignInECForm from './NodeSignInECForm';

const NodeSignInPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const goBack = () => history.push(ROUTES.HOME);

  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_DASHBOARD_GET_EC_PSP_DETAILS);
  const [ecNodeData, setEcNodeData] = useState<BrokerAndEcDetailsResource>();
  const [pspNodeData, setPspNodeData] = useState<BrokerOrPspDetailsResource>();

  useEffect(() => {
    if (selectedParty && selectedParty.institutionType !== 'PSP') {
      setLoading(true);
      getBrokerAndEcDetails(selectedParty.fiscalCode)
        .then((res) => {
          setEcNodeData(res);
        })
        .catch((reason) => {
          addError({
            id: 'NODE_SIGN_IN_PAGE_EC_DETAILS',
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

    if (selectedParty && selectedParty.institutionType === 'PSP') {
      setLoading(true);
      getBrokerAndPspDetails(
        selectedParty.pspData?.abiCode ? `ABI${selectedParty.pspData.abiCode}` : ''
      )
        .then((res) => {
          setPspNodeData(res);
        })
        .catch((reason) => {
          addError({
            id: 'NODE_SIGN_IN_PAGE_PSP_DETAILS',
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
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={goBack}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.dashboard')}</Typography>
            <Typography color={'text.disaled'}>{t(`nodeSignInPage.breadcrumb`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`nodeSignInPage.title`)}
          subTitle={
            selectedParty?.pspData
              ? t(`nodeSignInPage.subtitlePSP`)
              : t(`nodeSignInPage.subtitleEC`)
          }
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {selectedParty?.pspData ? (
          <NodeSignInPSPForm goBack={goBack} pspNodeData={pspNodeData} />
        ) : (
          <NodeSignInECForm goBack={goBack} ecNodeData={ecNodeData} />
        )}
      </Grid>
    </Grid>
  );
};

export default NodeSignInPage;
