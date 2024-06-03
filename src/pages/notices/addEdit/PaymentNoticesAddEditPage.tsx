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
import { institutionsDataDetailsSelectors } from '../../../redux/slices/institutionsDataDetailsSlice';
import PaymentNoticesAddEditForm from './PaymentNoticesAddEditForm';
import { InstitutionUploadData } from '../../../api/generated/portal/InstitutionUploadData';

const PaymentNoticesAddEditPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const goBack = () => history.push(ROUTES.IBAN);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_GET_IBAN);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const creditorInstitutionCode = selectedParty?.fiscalCode ?? '';
  const institutionUploadData : InstitutionUploadData = useAppSelector(institutionsDataDetailsSelectors
    .selectInstitutionsDataDetailsDetails);

  useEffect(() => {
    if (institutionUploadData.cbill !== null && (
      selectedParty?.fiscalCode !== institutionUploadData.taxCode
    )) {

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
          <PaymentNoticesAddEditForm goBack={goBack} data={institutionUploadData} />
        )}
      </Grid>
    </Grid>
  );
};

export default PaymentNoticesAddEditPage;
