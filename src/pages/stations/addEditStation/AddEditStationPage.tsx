import { ArrowBack } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ROUTES, { BASE_ROUTE } from '../../../routes';
import { LOADING_TASK_STATION_ADD_EDIT } from '../../../utils/constants';
import { getStationDetail } from '../../../services/stationService';
import { StationFormAction } from '../../../model/Station';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { isOperator } from '../components/commonFunctions';
import AddEditStationForm from './AddEditStationForm';

const AddEditStationPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_STATION_ADD_EDIT);
  const { stationId, actionId } = useParams<{ stationId: string; actionId: string }>();
  const formAction = actionId ?? StationFormAction.Create;
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [stationDetail, setStationDetail] = useState<any>();
  const addError = useErrorDispatcher();
  const goBack = () => history.push(ROUTES.STATIONS);
  const goBack2Details = () => history.push(`${BASE_ROUTE}/stations/${stationId}`);

  useEffect(() => {
    if (formAction !== StationFormAction.Create) {
      setLoading(true);
      getStationDetail(stationId)
        .then((response) => {
          console.log('Response full detail', response);
          setStationDetail(response);
        })
        .catch((reason) => {
          addError({
            id: 'GET_STATION_DETAILS',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting station details`,
            toNotify: true,
            displayableTitle: t('addEditStationPage.errorMessageStationCodeTitle'),
            displayableDescription: t('addEditStationPage.errorMessageStationCodeDesc'),
            component: 'Toast',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedParty]);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() =>
              isOperator() && formAction === StationFormAction.Edit ? goBack2Details() : goBack()
            }
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
            data-testid="back-btn-test"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Stations')}</Typography>
            <Typography color={'#A2ADB8'}>
              {formAction === StationFormAction.Create
                ? t(`addEditStationPage.create.breadcrumb`)
                : stationId}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={
            formAction === StationFormAction.Create
              ? t(`addEditStationPage.create.title`)
              : t('addEditStationPage.configure.title')
          }
          subTitle={
            formAction === StationFormAction.Create
              ? t(`addEditChannelPage.create.subtitle`)
              : t('addEditStationPage.configure.subtitle')
          }
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        {selectedParty && (
          <AddEditStationForm
            goBack={goBack}
            stationDetail={stationDetail}
            formAction={formAction}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AddEditStationPage;
