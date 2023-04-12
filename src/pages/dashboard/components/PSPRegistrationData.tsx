import { Grid, Typography, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaymentServiceProviderDetailsResource } from '../../../api/generated/portal/PaymentServiceProviderDetailsResource';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';

type Props = {
  pspNodeData?: PaymentServiceProviderDetailsResource;
};

const PSPRegistrationData = ({ pspNodeData }: Props) => {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const stampToString = (stamp: boolean) =>
    stamp
      ? t(`dashboardPage.registrationData.digitalStampValue.yes`)
      : t(`dashboardPage.registrationData.digitalStampValue.no`);

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
        <Typography variant="body2">{t('dashboardPage.registrationData.abiCode')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {selectedParty?.pspData?.abiCode ?? '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.pspCode')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {selectedParty?.pspData?.abiCode ? `ABI${selectedParty?.pspData?.abiCode}` : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.bicCode')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {pspNodeData?.bic ?? '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.digitalStamp')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {pspNodeData?.stamp ? stampToString(pspNodeData?.stamp) : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.statusLabel')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Chip
          color={pspNodeData?.bic ? 'primary' : 'default'}
          label={t(
            `dashboardPage.registrationData.status.${pspNodeData?.bic ? 'enabled' : 'disabled'}`
          )}
        ></Chip>
      </Grid>
    </>
  );
};

export default PSPRegistrationData;
