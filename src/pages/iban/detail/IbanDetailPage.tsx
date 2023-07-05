// import { useTranslation } from 'react-i18next';
import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { StatusChip } from '../../../components/StatusChip';
import { getIban } from '../../../services/__mocks__/ibanService';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_GET_IBAN } from '../../../utils/constants';
import { IbanOnCreation } from '../../../model/Iban';
import IbanDetailButtons from './components/IbanDetailButtons';

const IbanDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const goBack = () => history.push(ROUTES.IBAN);
  const { ibanId } = useParams<{ ibanId: string }>();
  const [iban, setIban] = useState<IbanOnCreation>();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_GET_IBAN);

  useEffect(() => {
    setLoading(true);
    getIban(ibanId)
      .then((response) => setIban(response))
      .catch((reason) => {
        addError({
          id: 'GET_IBAN',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting iban`,
          toNotify: true,
          displayableTitle: t('addEditIbanPage.errors.getIbanTitle'),
          displayableDescription: t('addEditIbanPage.errors.getIbanMessage'),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
            <Typography>{t('general.Iban')}</Typography>
            <Typography color={'text.disaled'}>{ibanId}</Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={6}>
            <TitleBox title={ibanId} mbTitle={2} variantTitle="h4" variantSubTitle="body1" />
            <Typography mb={5}>
              {t('ibanDetailPage.createdOn')}{' '}
              <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                {iban?.publicationDate?.toLocaleDateString('en-GB')}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <IbanDetailButtons status={iban?.status} iban={ibanId} />
          </Grid>
        </Grid>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 4,
            mb: 3,
          }}
        >
          <Grid container alignItems={'center'} spacing={0} mb={2}>
            <Grid item xs={3}>
              <Typography variant="subtitle2">{t('ibanDetailPage.state')}</Typography>
            </Grid>
            <Grid item xs={9} textAlign="right">
              <StatusChip status={'APPROVED'} />
            </Grid>
          </Grid>
          <Typography variant="h6" mb={3}>
            {t('ibanDetailPage.ibanConfiguration')}
          </Typography>
          <Divider></Divider>

          <Box mt={5}>
            <Grid container item alignContent="center" spacing={2} pb={4}>
              <Grid item xs={12}>
                <Typography variant="sidenav">{t('ibanDetailPage.ibanData')}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.iban')} </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban?.iban ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.ibanDesc')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban?.description ?? '-'}
                </Typography>
              </Grid>
            </Grid>

            <Grid container item alignContent="center" spacing={2} pb={4}>
              <Grid item xs={12}>
                <Typography variant="sidenav">{t('ibanDetailPage.validityDate')}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.from')} </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban?.validityDate?.toLocaleDateString('en-GB')}
                </Typography>
              </Grid>
            </Grid>

            <Grid container item alignContent="center" spacing={2} pb={4}>
              <Grid item xs={12}>
                <Typography variant="sidenav">{t('ibanDetailPage.ecData')}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.fiscalCode')} </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban?.ecOwner ?? '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default IbanDetailPage;
