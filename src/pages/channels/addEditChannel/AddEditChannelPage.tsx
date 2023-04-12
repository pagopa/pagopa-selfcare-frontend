import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import { FormAction } from '../../../model/Channel';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { getChannelCode, getChannelDetail } from '../../../services/channelService';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import AddEditChannelForm from './AddEditChannelForm';

const AddEditChannelPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const { channelId, actionId } = useParams<{ channelId: string; actionId: string }>();
  const formAction = actionId ?? FormAction.Create;

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>();
  const [channelCode, setChannelCode] = useState<string>('');

  const goBack = () => history.push(ROUTES.CHANNELS);

  useEffect(() => {
    if (formAction !== FormAction.Create) {
      setLoading(true);
      getChannelDetail(channelId)
        .then((response) => {
          setChannelDetail(response);
          setChannelCode(response.channel_code ?? '');
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
    if (
      (formAction === FormAction.Create || formAction === FormAction.Duplicate) &&
      selectedParty
    ) {
      setLoading(true);
      getChannelCode(selectedParty.fiscalCode)
        .then((result) => {
          setChannelCode(result.channel_code ?? '');
        })
        .catch((reason) => {
          addError({
            id: 'GET_CHANNEL_CODE',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting payment types`,
            toNotify: true,
            displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
            displayableDescription: t(
              'addEditChannelPage.addForm.errorMessageChannelCodeTypesDesc'
            ),
            component: 'Toast',
          });
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
            <Typography>{t('general.Channels')}</Typography>
            {formAction === FormAction.Edit && (
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
        {selectedParty && (
          <AddEditChannelForm
            goBack={goBack}
            selectedParty={selectedParty}
            channelCode={channelCode}
            channelDetail={channelDetail}
            formAction={formAction}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AddEditChannelPage;
