import { Grid, Typography, Stack, Breadcrumbs } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import ROUTES from '../../../routes';
import { LOADING_TASK_GET_IBAN } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import PaymentNoticesAddEditForm from './PaymentNoticesAddEditForm';

const AddEditIbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const goBack = () => history.push(ROUTES.IBAN);
  const addError = useErrorDispatcher();
  const { ibanId, actionId } = useParams<{ ibanId: string; actionId: string }>();
  const formAction = actionId ?? IbanFormAction.Create;
  const setLoading = useLoading(LOADING_TASK_GET_IBAN);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const creditorInstitutionCode = selectedParty?.fiscalCode ?? '';

  useEffect(() => {
    if (formAction !== IbanFormAction.Create) {
      setLoading(true);
      getIbanList(creditorInstitutionCode)
        .then((response) => {
          const filteredIban = response.ibans_enhanced.filter((e: any) => e.iban === ibanId);
          setIban({
            iban: filteredIban[0].iban!,
            description: filteredIban[0].description,
            creditor_institution_code: filteredIban[0].ci_owner ?? creditorInstitutionCode,
            validity_date: new Date(filteredIban[0].validity_date!),
            due_date: new Date(filteredIban[0].due_date!),
            labels: filteredIban[0].labels,
            is_active: filteredIban[0].is_active!,
          });
        })
        .catch((reason) => {
          handleErrors([
            {
              id: `FETCH_STATIONS_ERROR`,
              blocking: false,
              error: reason,
              techDescription: `An error occurred while fetching iban detail`,
              toNotify: false,
            },
          ]);
          addError({
            id: 'GET_IBAN_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving iban detail`,
            toNotify: true,
            displayableTitle: t('ibanPage.error.listErrorTitle'),
            displayableDescription: t('ibanPage.error.listErrorDesc'),
            component: 'Toast',
          });
          setIban(emptyIban);
        })
        .finally(() => setLoading(false));
    }
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
            <Typography>{t('general.PaymentNoticed')}</Typography>
            <Typography color={'text.disabled'}>
              {t(`paymentNotice.addEdit.breadcrumb`)}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`paymentNoticesPage.title`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {selectedParty && (
          <PaymentNoticesAddEditForm goBack={goBack} institutionsData={iban} />
        )}
      </Grid>
    </Grid>
  );
};

export default PaymentNoticesAddEditPage;
