import { Chip, Divider, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { BrokerAndEcDetailsResource } from '../../../api/generated/portal/BrokerAndEcDetailsResource';
import { isEcBrokerSigned, isEcSigned, isPspBrokerSigned } from '../../../utils/rbac-utils';
import { usePermissions } from '../../../hooks/usePermissions';
import { commonDetails } from '../DashboardPage';

const PTRegistrationData = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const signinData = useAppSelector(partiesSelectors.selectSigninData);
  const { hasPermission } = usePermissions();
  const isPspBroker = signinData && isPspBrokerSigned(signinData);
  const isEcBroker = signinData && isEcBrokerSigned(signinData);

  return (
    <>
      {commonDetails(t, selectedParty)}
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.statusLabel')}</Typography>
      </Grid>
      <Grid item xs={8}>
        {signinData?.brokerDetailsResource?.enabled ||
        signinData?.brokerPspDetailsResource?.enabled ? (
          <Chip label={t('dashboardPage.registrationData.status.enabled')} color="primary"></Chip>
        ) : (
          <Chip label={t('dashboardPage.registrationData.status.disabled')}></Chip>
        )}
      </Grid>

      <Grid item xs={12} sx={{ my: 2 }}>
        <Divider />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.intermediary')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Chip
          color={'default'}
          label={t(
            `dashboardPage.registrationData.intermediaryStatus.${
              isPspBroker && isEcBroker
                ? 'ecAndPsp'
                : isPspBroker
                ? 'psp'
                : isEcBroker
                ? 'ec'
                : 'disabled'
            }`
          )}
        />
      </Grid>

      <Grid item xs={8}>
        <ButtonNaked
          size="medium"
          component="button"
          disabled={!hasPermission('node-signin')}
          onClick={() => history.push(ROUTES.NODE_SIGNIN)}
          endIcon={<EditIcon />}
          sx={{ color: 'primary.main', mr: '20px' }}
          weight="default"
          data-testid="modify-data-test"
        >
          {t('dashboardPage.registrationData.modifyData')}
        </ButtonNaked>
      </Grid>
    </>
  );
};

export default PTRegistrationData;
