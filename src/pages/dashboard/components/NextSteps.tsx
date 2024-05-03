import {ArrowForward} from '@mui/icons-material';
import {Alert, Box, Button, Card, Typography} from '@mui/material';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {usePermissions} from '../../../hooks/usePermissions';
import {SigninData} from '../../../model/Node';
import {Party} from '../../../model/Party';
import ROUTES from '../../../routes';
import {LOADING_TASK_DASHBOARD} from '../../../utils/constants';
import {hasGeneratedApiKey} from '../../../utils/rbac-utils';
import {useOrganizationType} from "../../../hooks/useOrganizationType";

type Props = {
  selectedParty?: Party;
  signinData?: SigninData;
};

const NextSteps = ({ selectedParty, signinData }: Props) => {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_DASHBOARD);
  const {orgInfo}= useOrganizationType();
  const isSignedIn = signinData ? orgInfo.isSigned : false;
  const isPSP = selectedParty?.institutionType === 'PSP' ? true : false;
  const { userHasPermission } = usePermissions();
  const [hasApiKey, setApiKey] = useState(false);

  useEffect(() => {
    setLoading(true);

    hasGeneratedApiKey(selectedParty)
      .then((hasAlreadyGeneratedKeys) => setApiKey(hasAlreadyGeneratedKeys))
      .catch((reason) =>
        addError({
          id: 'NEXT_STEP_HAS_API_KEY',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while retrieving institution api keys`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('dashboardPage.nextStep.retrieveHasApiKeysErrorMessage'),
          component: 'Toast',
        })
      )
      .finally(() => setLoading(false));
  }, [selectedParty]);

  function nextStepsAlert() {
    if (!isSignedIn) {
      return <Alert severity="warning">{t('dashboardPage.nextStep.signInStepAlert')}</Alert>;
    }
    if (!userHasPermission('apikey')) {
      return <Alert severity="info">{t(`dashboardPage.nextStep.emptyState`)}</Alert>;
    }
    if (hasApiKey) {
      return <Alert severity="info">{t(`dashboardPage.nextStep.completedAllSteps`)}</Alert>;
    }
    if (isPSP) {
      return (
        <Alert severity="warning">{t('dashboardPage.nextStep.generateApiKeysStepAlertPSP')}</Alert>
      );
    }
    return (
      <Alert severity="warning">{t('dashboardPage.nextStep.generateApiKeyStepAlertEC')}</Alert>
    );
  }

  return (
    <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
      <Typography variant="h6" mb={3}>
        {t('dashboardPage.nextStep.title')}
      </Typography>
      <Box mb={3}>{nextStepsAlert()}</Box>
      {isSignedIn && !hasApiKey && userHasPermission('apikey') ? (
        <Button
          component={Link}
          to={ROUTES.APIKEYS}
          variant="contained"
          size="small"
          endIcon={<ArrowForward />}
        >
          {t('dashboardPage.nextStep.generateApiKeysCTA')}
        </Button>
      ) : (
        !isSignedIn &&
        userHasPermission('node-signin') && (
          <Button
            component={Link}
            to={ROUTES.NODE_SIGNIN}
            variant="contained"
            size="small"
            endIcon={<ArrowForward />}
          >
            {t('dashboardPage.nextStep.signInCTA')}
          </Button>
        )
      )}
    </Card>
  );
};

export default NextSteps;
