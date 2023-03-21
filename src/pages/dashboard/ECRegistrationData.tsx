import { Grid, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';

const ECRegistrationData = () => {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  return (
    <>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.name')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {selectedParty?.description}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.companyName')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {selectedParty?.pspData?.legalRegisterName}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.fiscalCode')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {selectedParty?.fiscalCode}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.statusLabel')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Chip label={t('dashboardPage.registrationData.status.disabled')}></Chip>
      </Grid>
    </>
  );
};

export default ECRegistrationData;
