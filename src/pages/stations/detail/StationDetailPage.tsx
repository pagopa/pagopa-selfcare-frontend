import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { StationDetailResource } from '../../../api/generated/portal/StationDetailResource';
import { ConfigurationStatus } from '../../../model/Station';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getECListByStationCode, getStationDetail } from '../../../services/stationService';
import { LOADING_TASK_STATION_DETAILS_WRAPPER } from '../../../utils/constants';
import StationDetails from './components/StationDetails';

const StationDetailPage = () => {
    const {t} = useTranslation();
    const {stationId, status} = useParams<{ stationId: string; status: ConfigurationStatus }>();
    const [stationDetail, setStationDetail] = useState<StationDetailResource>();
    const [ecAssociatedNumber, setECAssociatedNumber] = useState<number>(0);
    const addError = useErrorDispatcher();
    const setLoadingWrap = useLoading(LOADING_TASK_STATION_DETAILS_WRAPPER);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

    useEffect(() => {
        setLoadingWrap(true);

        async function getEcListByStationCode(): Promise<any> {
            try {
                return await getECListByStationCode(stationId, undefined, 0);
            } catch (e) {
                return {};
            }
        }

        Promise.all([getStationDetail({stationCode: stationId, status}), getEcListByStationCode()])
            .then(([stationDetail, ecList]) => {
                setStationDetail(stationDetail);
                setECAssociatedNumber(ecList?.page_info?.total_items ?? 0);
            })
            .catch((reason) => {
                addError({
                    id: 'GET_STATION_DETAILS_WRAPPER',
                    blocking: false,
                    error: reason as Error,
                    techDescription: `An error occurred while getting station details wrapper`,
                    toNotify: true,
                    displayableTitle: t('addEditStationPage.errorMessageStationCodeTitle'),
                    displayableDescription: t('addEditStationPage.errorMessageStationWrapperDetailsDesc'),
                    component: 'Toast',
                });
            })
            .finally(() => setLoadingWrap(false));
    }, [selectedParty]);

    return (
        <StationDetails
            stationDetail={stationDetail}
            setStationDetail={setStationDetail}
            ecAssociatedNumber={ecAssociatedNumber}
        />
    );
};

export default StationDetailPage;
