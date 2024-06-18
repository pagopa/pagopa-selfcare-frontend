/* eslint-disable complexity */
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router';
import ROUTES from '../../../routes';
import {getChannelDetail, getChannelPSPs} from '../../../services/channelService';
import {LOADING_TASK_CHANNEL_DETAIL} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {ChannelDetailsResource} from '../../../api/generated/portal/ChannelDetailsResource';
import {useUserRole} from "../../../hooks/useUserRole";
import ChannelDetails from './components/ChannelDetails';
import ChannelDetailsWrap from './components/ChannelDetailsWrap';

const ChannelDetailPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const setLoading = useLoading(LOADING_TASK_CHANNEL_DETAIL);
    const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>({} as any);
    const [PSPAssociatedNumber, setPSPAssociatedNumber] = useState<number>(0);
    const addError = useErrorDispatcher();
    const {channelId} = useParams<{ channelId: string }>();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const {userIsPagopaOperator} = useUserRole();
    const goBack = () => history.push(ROUTES.CHANNELS);

    useEffect(() => {
        setLoading(true);
        Promise.all([getChannelDetail(channelId), getChannelPSPs(channelId, "", 0)])
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

    return userIsPagopaOperator ? (
        <ChannelDetails
            channelDetail={channelDetail}
            setChannelDetail={setChannelDetail}
            channelId={channelId}
            goBack={goBack}
            PSPAssociatedNumber={PSPAssociatedNumber}
        />
    ) : (
        <ChannelDetailsWrap
            channelDetWrap={channelDetail}
            setChannelDetail={setChannelDetail}
            channelId={channelId}
            goBack={goBack}
            PSPAssociatedNumber={PSPAssociatedNumber}
        />
    );
};

export default ChannelDetailPage;
