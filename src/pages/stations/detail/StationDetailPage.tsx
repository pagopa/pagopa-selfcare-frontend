import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {getECListByStationCode, getStationDetail, getWrapperStation} from '../../../services/stationService';
import {LOADING_TASK_STATION_DETAILS_WRAPPER} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import {isOperator} from '../../components/commonFunctions';
import {StationDetailResource} from '../../../api/generated/portal/StationDetailResource';
import StationDetails from './components/StationDetails';
import StationDetailsValidation from './components/StationDetailsValidation';

const StationDetailPage = () => {
    const {t} = useTranslation();
    const {stationId} = useParams<{ stationId: string }>();
    const [stationDetail, setStationDetail] = useState<StationDetailResource>();
    const [ecAssociatedNumber, setECAssociatedNumber] = useState<number>(0);
    const history = useHistory();
    const addError = useErrorDispatcher();
    const setLoadingWrap = useLoading(LOADING_TASK_STATION_DETAILS_WRAPPER);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const goBack = () => history.push(ROUTES.STATIONS);

    const operator = isOperator();

    useEffect(() => {
        setLoadingWrap(true);

        async function getDetail(): Promise<any> {
            // eslint-disable-next-line functional/no-let
            let station: StationDetailResource;
            // eslint-disable-next-line functional/no-let
            let wrapper: any;
            try {
                station = await getStationDetail(stationId);
                return {
                    wrapperStatus: 'APPROVED',
                    ...station
                };
            } catch (e) {
                wrapper = await getWrapperStation(stationId);
                return {
                    wrapperStatus: wrapper.status,
                    ...wrapper.entities![0],
                    ...wrapper
                };
            }
        }

        async function getEcListByStationCode(): Promise<any> {
            try {
                return await getECListByStationCode(stationId, "", 0);
            } catch (e) {
                return {};
            }
        }

        Promise.all([getDetail(), getEcListByStationCode()])
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

    return operator ? (
        <StationDetailsValidation stationDetail={stationDetail}/>
    ) : (
        <StationDetails
            stationDetail={stationDetail}
            goBack={goBack}
            ecAssociatedNumber={ecAssociatedNumber}
        />
    );
};

export default StationDetailPage;
