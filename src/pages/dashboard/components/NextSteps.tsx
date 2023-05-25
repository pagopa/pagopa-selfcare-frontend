import { ArrowForward } from '@mui/icons-material';
import { Alert, Box, Button, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ROUTES from '../../../routes';
import { Party } from '../../../model/Party';
import { SigninData } from '../../../model/Node';

type Props = {
  selectedParty?: Party;
  signinData?: SigninData;
};

const NextSteps = ({ selectedParty, signinData }: Props) => {
  const { t } = useTranslation();
  const isSignedIn = signinData ? true : false;
  const isAdmin = selectedParty?.roles.find((r) => r.roleKey === 'admin');
  const isPSP = selectedParty?.institutionType === 'PSP' ? true : false;

  return (
    <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
      <Typography variant="h6" mb={3}>
        {t('dashboardPage.nextStep.title')}
      </Typography>
      <Box mb={3}>
        <Alert severity="warning">
          {t(
            `dashboardPage.nextStep.${
              isAdmin && isSignedIn && isPSP
                ? 'generateApiKeysStepAlertPSP'
                : isAdmin && isSignedIn
                ? 'generateApiKeyStepAlertEC'
                : 'signInStepAlert'
            }`
          )}
        </Alert>
      </Box>
      {isAdmin && isSignedIn ? (
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
        isAdmin && (
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
