import { Grid, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CreditorInstitutionDetailsResource } from '../../../api/generated/portal/CreditorInstitutionDetailsResource';
import ROUTES from '../../../routes';

type Props = {
  ecNodeData?: CreditorInstitutionDetailsResource;
};

const ECRegistrationData = ({ ecNodeData }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
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
          {selectedParty?.description}
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
        <Typography variant="body2">{t('dashboardPage.registrationData.interBankCode')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {'-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.accessionDate')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {'-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.address')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {ecNodeData?.address.location ? ecNodeData.address.location : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.city')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {ecNodeData?.address.city ? ecNodeData.address.city : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.province')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {ecNodeData?.address.countryCode ? ecNodeData.address.countryCode : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.CAP')}</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {ecNodeData?.address.zipCode ? ecNodeData.address.zipCode : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">
          {t('dashboardPage.registrationData.fiscalDomicile')}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2" fontWeight={600}>
          {ecNodeData?.address.taxDomicile ? ecNodeData.address.taxDomicile : '-'}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2">{t('dashboardPage.registrationData.statusLabel')}</Typography>
      </Grid>
      <Grid item xs={8}>
        {ecNodeData?.enabled ? (
          <Chip label={t('dashboardPage.registrationData.status.enabled')} color="primary"></Chip>
        ) : (
          <Chip label={t('dashboardPage.registrationData.status.disabled')}></Chip>
        )}
      </Grid>

      <Grid item xs={8}>
        {ecNodeData?.enabled ? (
          <ButtonNaked
            size="medium"
            component="button"
            onClick={() => history.push(ROUTES.NODE_SIGNIN)}
            endIcon={<EditIcon />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('dashboardPage.registrationData.modifyData')}
          </ButtonNaked>
        ) : null}
      </Grid>
    </>
  );
};

export default ECRegistrationData;
