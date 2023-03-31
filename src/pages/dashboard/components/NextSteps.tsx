import { ArrowForward } from '@mui/icons-material';
import { Alert, Box, Button, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ROUTES from '../../../routes';
import { PaymentServiceProviderDetailsResource } from '../../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { Party } from '../../../model/Party';

type Props = {
  selectedParty?: Party;
  pspNodeData?: PaymentServiceProviderDetailsResource;
};

const NextSteps = ({ selectedParty, pspNodeData }: Props) => {
  const { t } = useTranslation();
  const isPSPRegistered = pspNodeData?.bic ? true : false;
  const isAdmin = selectedParty?.roles.find((r) => r.roleKey === 'admin');

  return (
    <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
      <Typography variant="h6" mb={3}>
        {t('dashboardPage.nextStep.title')}
      </Typography>
      <Box mb={3}>
        <Alert severity="warning">
          {t(
            `dashboardPage.nextStep.${
              isAdmin && isPSPRegistered ? 'generateApiKeysStepAlert' : 'signInStepAlert'
            }`
          )}
        </Alert>
      </Box>
      {isAdmin && isPSPRegistered ? (
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
  );
};

export default NextSteps;
