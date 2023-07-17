// import { useTranslation } from 'react-i18next';
import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Divider, Box, Grid, Paper, Stack, Typography, Chip } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_GET_IBAN } from '../../../utils/constants';
import { IbanOnCreation } from '../../../model/Iban';
import { getIbanList } from '../../../services/ibanService';
import { emptyIban } from '../IbanPage';
import IbanDetailButtons from './components/IbanDetailButtons';

const IbanDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const goBack = () => history.push(ROUTES.IBAN);
  const { ibanId } = useParams<{ ibanId: string }>();
  const [iban, setIban] = useState<IbanOnCreation>(emptyIban);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_GET_IBAN);

  useEffect(() => {
    if (selectedParty && selectedParty.fiscalCode) {
      setLoading(true);
      getIbanList(selectedParty.fiscalCode)
        .then((response) => {
          const fileterdIban = response.ibanList.filter((e) => e.iban === ibanId);
          setIban({
            iban: fileterdIban[0].iban,
            description: fileterdIban[0].description ?? undefined,
            creditorInstitutionCode: fileterdIban[0].ecOwner,
            validityDate: fileterdIban[0].validityDate,
            dueDate: fileterdIban[0].dueDate,
            labels: fileterdIban[0].labels ?? undefined,
          });
        })
        .catch((reason) => {
          handleErrors([
            {
              id: `FETCH_STATIONS_ERROR`,
              blocking: false,
              error: reason,
              techDescription: `An error occurred while fetching stations`,
              toNotify: false,
            },
          ]);
          addError({
            id: 'GET_IBAN_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving iban list`,
            toNotify: true,
            displayableTitle: t('ibanPage.error.listErrorTitle'),
            displayableDescription: t('ibanPage.error.listErrorDesc'),
            component: 'Toast',
          });
          setIban(emptyIban);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedParty, ibanId]);

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
                {/* {iban?.publicationDate?.toLocaleDateString('en-GB')} */}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <IbanDetailButtons active={iban.active} iban={ibanId} />
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
              <Chip
                label={iban.active ? t('ibanPage.active') : t('ibanPage.notActive')}
                aria-label="update-in-progress"
                size="medium"
                sx={{
                  color: iban.active ? '#FFFFFF' : '#17324D',
                  backgroundColor: iban.active ? 'primary.main' : 'error.light',
                  fontSize: '14px',
                  paddingBottom: '1px',
                  height: '32px',
                }}
              ></Chip>
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
                  {iban.iban ?? '-'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.ibanDesc')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban.description ?? '-'}
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
                  {iban.validityDate?.toLocaleDateString('en-GB')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">{t('ibanDetailPage.to')} </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {iban.dueDate?.toLocaleDateString('en-GB')}
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
                  {iban.creditorInstitutionCode ?? '-'}
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
