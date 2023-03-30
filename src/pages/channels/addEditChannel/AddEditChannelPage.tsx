import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import ROUTES from '../../../routes';
import { getChannelDetail } from '../../../services/channelService';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import AddEditChannelForm from './AddEditChannelForm';

const AddEditChannelPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const { channelId, actionId } = useParams<{ channelId: string; actionId: string }>();
  const formAction = actionId ?? 'create';
  const addError = useErrorDispatcher();
  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>();

  const goBack = () => history.push(ROUTES.CHANNELS);

  useEffect(() => {
    if (formAction !== 'create') {
      setLoading(true);
      getChannelDetail(channelId)
        .then((response) => {
          setChannelDetail(response);
        })
        .catch((reason) => {
          addError({
            id: 'GET_CHANNEL_DETAILS',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting channel details`,
            toNotify: true,
            displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
            displayableDescription: t('addEditChannelPage.addForm.errorMessageChannelDetailsDesc'),
            component: 'Toast',
          });
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
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Channels')}</Typography>
            {formAction === 'edit' && (
              <>
                <Typography color={'#A2ADB8'}>{channelId}</Typography>
              </>
            )}
            <Typography color={'#A2ADB8'}>
              {t(`addEditChannelPage.${formAction}.breadcrumb`)}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`addEditChannelPage.${formAction}.title`)}
          subTitle={t(`addEditChannelPage.${formAction}.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        <AddEditChannelForm goBack={goBack} channelDetail={channelDetail} formAction={formAction} />
      </Grid>
    </Grid>
  );
};

export default AddEditChannelPage;
