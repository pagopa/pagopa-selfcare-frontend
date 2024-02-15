import { ArrowForward } from '@mui/icons-material';
import { Alert, Box, Button, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { Party } from '../../../model/Party';
import { SigninData } from '../../../model/Node';
import { usePermissions } from '../../../hooks/usePermissions';
import { isSigned, hasGeneratedApiKey } from '../../../utils/rbac-utils';

type Props = {
  selectedParty?: Party;
  signinData?: SigninData;
};

const NextSteps = ({ selectedParty, signinData }: Props) => {
  const { t } = useTranslation();
  const isSignedIn = signinData ? isSigned(signinData) : false;
  const isAdmin = selectedParty?.roles.find((r) => r.roleKey === 'admin');
  const isPSP = selectedParty?.institutionType === 'PSP' ? true : false;
  const { hasPermission } = usePermissions();
  const [hasApiKey, setApiKey] = useState(false);

  useEffect(() => {
    hasGeneratedApiKey(selectedParty)
      .then((hasAlreadyGeneratedKeys) => setApiKey(hasAlreadyGeneratedKeys))
      .catch(console.error);
  }, []);

  function nextStepsAlert() {
    if (!isSignedIn) {
      return <Alert severity="warning">{t('dashboardPage.nextStep.signInStepAlert')}</Alert>;
    }
    if (!hasPermission('apikey')) {
      return <Alert severity="info">{t(`dashboardPage.nextStep.emptyState`)}</Alert>;
    }
    if (hasApiKey) {
      return <Alert severity="info">{t(`dashboardPage.nextStep.completedAllSteps`)}</Alert>;
    }
    if (isPSP) {
      return <Alert severity="warning">{t('dashboardPage.nextStep.generateApiKeysStepAlertPSP')}</Alert>;
    }
    return <Alert severity="warning">{t('dashboardPage.nextStep.generateApiKeyStepAlertEC')}</Alert>;
  }

  return (
    <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
      <Typography variant="h6" mb={3}>
        {t('dashboardPage.nextStep.title')}
      </Typography>
      <Box mb={3}>
        {nextStepsAlert()}
      </Box>
      {isSignedIn && !hasApiKey && hasPermission('apikey') ? (
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
        hasPermission('node-signin') && (
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
