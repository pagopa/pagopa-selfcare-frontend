/* eslint-disable complexity */
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getChannelDetail, getChannelPSPs } from '../../../services/channelService';
import { LOADING_TASK_CHANNEL_DETAIL } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import ChannelDetails from './components/ChannelDetails';

const ChannelDetailPage = () => {
  const { t } = useTranslation();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_DETAIL);
  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>({} as any);
  const [PSPAssociatedNumber, setPSPAssociatedNumber] = useState<number>(0);
  const addError = useErrorDispatcher();
  const { channelId } = useParams<{ channelId: string }>();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  useEffect(() => {
    setLoading(true);
    Promise.all([getChannelDetail(channelId), getChannelPSPs(channelId, '', 0)])
      .then(([channelDetailResponse, channelPSPList]) => {
        setChannelDetail(channelDetailResponse);
        setPSPAssociatedNumber(channelPSPList?.page_info?.total_items ?? 0);
      })
      .catch((reason) => {
        addError({
          id: 'GET_CHANNEL_DETAILS',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting channel details`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('addEditChannelPage.addForm.errorMessageChannelDetailsDesc'),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }, [selectedParty]);

  return (
    <ChannelDetails
      channelDetail={channelDetail}
      setChannelDetail={setChannelDetail}
      channelId={channelId}
      PSPAssociatedNumber={PSPAssociatedNumber}
    />
  );
};

export default ChannelDetailPage;

