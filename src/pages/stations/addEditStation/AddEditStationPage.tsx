import { ArrowBack } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { TitleBox, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ROUTES from '../../../routes';
import { LOADING_TASK_STATION_ADD_EDIT } from '../../../utils/constants';
import { getStationDetail } from '../../../services/__mocks__/stationService';
import { StationDetailResource } from '../../../api/generated/portal/StationDetailResource';
import { FormAction } from '../../../model/Channel';
import AddEditStationForm from './AddEditStationForm';

const AddEditStationPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_STATION_ADD_EDIT);
  const { channelId, actionId } = useParams<{ channelId: string; actionId: string }>();
  const formAction = actionId ?? FormAction.Create;

  const [stationDetail, setStationDetail] = useState<StationDetailResource>();

  const goBack = () => history.push(ROUTES.STATIONS);

  useEffect(() => {
    if (formAction !== FormAction.Create) {
      setLoading(true);
      getStationDetail(channelId)
        .then((response) => {
          setStationDetail(response);
        })
        .catch((reason) => {
          console.error(reason);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

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
            data-testid="back-btn-test"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Stations')}</Typography>
            <Typography color={'#A2ADB8'}>{t(`addEditStationPage.create.breadcrumb`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`addEditStationPage.create.title`)}
          subTitle={t(`addEditChannelPage.create.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        <AddEditStationForm goBack={goBack} stationDetail={stationDetail} formAction={formAction} />
      </Grid>
    </Grid>
  );
};

export default AddEditStationPage;
