/* eslint-disable complexity */
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import ROUTES from '../../../routes';
import { getChannelDetail, getWrapperEntities } from '../../../services/channelService';
import {
  LOADING_TASK_CHANNEL_DETAIL,
  LOADING_TASK_CHANNEL_WRAPPER_DETAIL,
} from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { WrapperEntitiesOperations } from '../../../api/generated/portal/WrapperEntitiesOperations';
// import { getWrapperChannel } from '../../../services/__mocks__/channelService';
import { WrapperChannelDetailsDto } from '../../../api/generated/portal/WrapperChannelDetailsDto';
import { TypeEnum } from '../../../api/generated/portal/WrapperEntityOperationsOfobject';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import ChannelDetails from './components/ChannelDetails';
import ChannelDetailsWrap from './components/ChannelDetailsWrap';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChannelDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoadingOperator = useLoading(LOADING_TASK_CHANNEL_DETAIL);
  const setLoadingPsp = useLoading(LOADING_TASK_CHANNEL_WRAPPER_DETAIL);
  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>({});
  const [channelDetailWrapper, setChannelDetailWrapper] = useState<WrapperEntitiesOperations>();
  const [channelDetWrap, setChannelDetWrap] = useState<WrapperChannelDetailsDto>();
  const addError = useErrorDispatcher();
  const { channelId } = useParams<{ channelId: string }>();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';
  const goBack = () => history.push(ROUTES.CHANNELS);

  useEffect(() => {
    if (isOperator) {
      // try {
      setLoadingPsp(true);
      getWrapperEntities(channelId)
        .then((response) => {
          setChannelDetailWrapper(response);
          if (
            response.wrapperEntityOperationsSortedList &&
            response.wrapperEntityOperationsSortedList[0].type === TypeEnum.CHANNEL
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
        .finally(() => setLoadingPsp(false));
      // } catch {
      //   setLoadingOperator(true);
      //   getChannelDetail(channelId)
      //     .then((channelDetailResponse) => setChannelDetail(channelDetailResponse))
      //     .catch((reason) => {
      //       addError({
      //         id: 'GET_CHANNEL_DETAILS',
      //         blocking: false,
      //         error: reason as Error,
      //         techDescription: `An error occurred while getting channel details`,
      //         toNotify: true,
      //         displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
      //         displayableDescription: t(
      //           'addEditChannelPage.addForm.errorMessageChannelDetailsDesc'
      //         ),
      //         component: 'Toast',
      //       });
      //     })
      //     .finally(() => setLoadingOperator(false));
      // }
    } else {
      setLoadingOperator(true);
      getChannelDetail(channelId)
        .then((channelDetailResponse) => setChannelDetail(channelDetailResponse))
        // eslint-disable-next-line sonarjs/no-identical-functions
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
        .finally(() => setLoadingOperator(false));
    }
  }, []);

  return isOperator ? (
    <ChannelDetails
      channelDetail={channelDetWrap}
      channelDetailWrapper={channelDetailWrapper}
      channelId={channelId}
      goBack={goBack}
    />
  ) : (
    <ChannelDetailsWrap channelDetWrap={channelDetail} channelId={channelId} goBack={goBack} />
  );
};

export default ChannelDetailPage;
