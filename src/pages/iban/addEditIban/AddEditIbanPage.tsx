import { Grid, Typography, Stack, Breadcrumbs } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { IbanFormAction, IbanOnCreation } from '../../../model/Iban';
import ROUTES from '../../../routes';
import { LOADING_TASK_GET_IBAN } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getIbanList } from '../../../services/ibanService';
import { emptyIban } from '../IbanPage';
import AddEditIbanForm from './AddEditIbanForm';

const AddEditIbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [iban, setIban] = useState<IbanOnCreation>(emptyIban);
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
          const fileterdIban = response.ibanList.filter((e) => e.iban === ibanId);
          setIban({
            iban: fileterdIban[0].iban,
            description: fileterdIban[0].description ?? '',
            creditorInstitutionCode: fileterdIban[0].ecOwner,
            validityDate: fileterdIban[0].validityDate,
            dueDate: fileterdIban[0].dueDate,
            labels: fileterdIban[0].labels ?? [],
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
            {formAction === IbanFormAction.Edit && <Typography>{ibanId}</Typography>}
            <Typography color={'text.disabled'}>
              {t(`ibanPage.${formAction}.breadcrumb`)}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`ibanPage.${formAction}.title`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {selectedParty && (
          <AddEditIbanForm goBack={goBack} ibanBody={iban} formAction={formAction} />
        )}
      </Grid>
    </Grid>
  );
};

export default AddEditIbanPage;
