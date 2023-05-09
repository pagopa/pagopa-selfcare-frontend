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
import {
  getChannelCode,
  getChannelDetail,
  getWrapperEntities,
} from '../../../services/channelService';
import { LOADING_TASK_CHANNEL_ADD_EDIT } from '../../../utils/constants';
import { WrapperChannelDetailsDto } from '../../../api/generated/portal/WrapperChannelDetailsDto';
import { WrapperEntitiesOperations } from '../../../api/generated/portal/WrapperEntitiesOperations';
import { TypeEnum } from '../../../api/generated/portal/WrapperEntityOperationsOfobject';
import AddEditChannelForm from './AddEditChannelForm';

const AddEditChannelPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const { channelId, actionId } = useParams<{ channelId: string; actionId: string }>();
  const formAction = actionId ?? FormAction.Create;
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';
  const [_channelDetail, setChannelDetail] = useState<ChannelDetailsResource>();
  const [_channelDetailWrapper, setChannelDetailWrapper] = useState<WrapperEntitiesOperations>();
  const [channelDetWrap, setChannelDetWrap] = useState<WrapperChannelDetailsDto>();
  const [channelCode, setChannelCode] = useState<string>('');

  const goBack = () => history.push(ROUTES.CHANNELS);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    if (formAction !== FormAction.Create) {
      if (isOperator) {
        //   try {
        setLoading(true);
        getWrapperEntities(channelId)
          .then((response) => {
            setChannelDetailWrapper(response);
            setChannelCode(channelId);
            if (
              response.wrapperEntityOperationsSortedList &&
              response.wrapperEntityOperationsSortedList[0].type === TypeEnum.CHANNEL &&
              response.wrapperEntityOperationsSortedList[0].entity
            ) {
              setChannelDetWrap(response.wrapperEntityOperationsSortedList[0].entity);
            }
          })
          .catch((reason) => {
            addError({
              id: 'GET_CHANNEL_DETAILS_WRAPPER',
              blocking: false,
              error: reason as Error,
              techDescription: `An error occurred while getting channel details wrapper`,
              toNotify: true,
              displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
              displayableDescription: t(
                'addEditChannelPage.addForm.errorMessageChannelWrapperDetailsDesc'
              ),
              component: 'Toast',
            });
          })
          .finally(() => setLoading(false));
        //   } catch {
        //   setLoading(true);
        //   getChannelDetail(channelId)
        //     .then((response) => {
        //       setChannelDetail(response);
        //       setChannelCode(response.channel_code ?? '');
        //     })
        //     .catch((reason) => {
        //       addError({
        //         id: 'GET_CHANNEL_DETAILS',
        //         blocking: false,
        //         error: reason as Error,
        //         techDescription: `An error occurred while getting channel details`,
        //         toNotify: true,
        //         displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
        //         displayableDescription: t('addEditChannelPage.addForm.errorMessageChannelDetailsDesc'),
        //         component: 'Toast',
        //       });
        //     })
        //     .finally(() => {
        //       setLoading(false);
        //     });
        // }
      } else {
        setLoading(true);
        getChannelDetail(channelId)
          .then((response) => {
            setChannelDetail(response);
            setChannelCode(response.channel_code ?? '');
          })
          // eslint-disable-next-line sonarjs/no-identical-functions
          .catch((reason) => {
            addError({
              id: 'GET_CHANNEL_DETAILS',
              blocking: false,
              error: reason as Error,
              techDescription: `An error occurred while getting channel details`,
              toNotify: true,
              displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
              displayableDescription: t(
                'addEditChannelPage.addForm.errorMessageChannelDetailsDesc'
              ),
              component: 'Toast',
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
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
              <Typography color={'#A2ADB8'}>{channelId}</Typography>
            )}
            <Typography color={'#A2ADB8'}>
              {isOperator
                ? t(`addEditChannelPage.config.titleConfiguration`)
                : t(`addEditChannelPage.${formAction}.breadcrumb`)}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={
            isOperator
              ? t(`addEditChannelPage.config.titleConfiguration`)
              : t(`addEditChannelPage.${formAction}.title`)
          }
          subTitle={
            isOperator
              ? t(`addEditChannelPage.config.subtitleConfiguration`)
              : t(`addEditChannelPage.${formAction}.subtitle`)
          }
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {selectedParty && (
          <AddEditChannelForm
            selectedParty={selectedParty}
            channelCode={channelCode}
            channelDetail={channelDetWrap}
            formAction={formAction}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default AddEditChannelPage;
