import { Grid, Typography, Stack, Breadcrumbs } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { IbanFormAction } from '../../../model/Iban';
import ROUTES from '../../../routes';
import AddEditIbanForm from './AddEditIbanForm';

// import { useAppSelector } from '../../redux/hooks';
// import { partiesSelectors } from '../../redux/slices/partiesSlice';

const AddEditIbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const goBack = () => history.push(ROUTES.IBAN);

  const { ibanId, actionId } = useParams<{ ibanId: string; actionId: string }>();
  const formAction = actionId ?? IbanFormAction.Create;

  // const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

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
        <AddEditIbanForm formAction={formAction} />
      </Grid>
    </Grid>
  );
};

export default AddEditIbanPage;
