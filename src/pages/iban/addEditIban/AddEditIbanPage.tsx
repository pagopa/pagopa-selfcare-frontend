import { Grid, Typography, Stack, Breadcrumbs } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IbanFormAction, IbanOnCreation } from '../../../model/Iban';
import ROUTES from '../../../routes';
import { getIban } from '../../../services/__mocks__/ibanService';
import { LOADING_TASK_GET_IBAN } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import AddEditIbanForm from './AddEditIbanForm';

const AddEditIbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [iban, setIban] = useState<IbanOnCreation>();
  const goBack = () => history.push(ROUTES.IBAN);
  const addError = useErrorDispatcher();
  const { ibanId, actionId } = useParams<{ ibanId: string; actionId: string }>();
  const formAction = actionId ?? IbanFormAction.Create;
  const setLoading = useLoading(LOADING_TASK_GET_IBAN);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

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
        <AddEditIbanForm ibanBody={iban} goBack={goBack} />
      </Grid>
    </Grid>
  );
};

export default AddEditIbanPage;
