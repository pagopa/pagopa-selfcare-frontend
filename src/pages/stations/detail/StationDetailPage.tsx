import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStationDetail, getWrapperStation } from '../../../services/stationService';
import {
  LOADING_TASK_STATION_DETAILS,
  LOADING_TASK_STATION_DETAILS_WRAPPER,
} from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import {
  TypeEnum,
  WrapperEntitiesOperations,
} from '../../../api/generated/portal/WrapperEntitiesOperations';
import ROUTES from '../../../routes';
import { isOperator } from '../components/commonFunctions';
import StationDetails from './components/StationDetails';
import StationDetailsValidation from './components/StationDetailsValidation';

const StationDetailPage = () => {
  const { t } = useTranslation();
  const { stationId } = useParams<{ stationId: string }>();
  const [stationDetail, setStationDetail] = useState<any>();
  const history = useHistory();
  const [stationDetailWrapper, setStationDetailWrapper] = useState<WrapperEntitiesOperations>();
  // const [stationDetWrap, setStationDetWrap] = useState<any>();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_DETAILS);
  const setLoadingWrap = useLoading(LOADING_TASK_STATION_DETAILS_WRAPPER);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const goBack = () => history.push(ROUTES.STATIONS);

  const operator = isOperator();

  useEffect(() => {
    // console.log('operatore', operator);
    if (operator) {
      setLoadingWrap(true);
      getWrapperStation(stationId)
        .then((response) => {
          setStationDetailWrapper(response);
          if (response.type === TypeEnum.STATION && response.wrapperEntityOperationsSortedList) {
            setStationDetail(response.wrapperEntityOperationsSortedList[0].entity);
          }
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
    } else {
      setLoading(true);
      getStationDetail(stationId)
        .then((stationDetailData) => {
          setStationDetail(stationDetailData);
        })
        .catch((reason) => {
          addError({
            id: 'GETTING_STATION_DETAILS',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting station details`,
            toNotify: true,
            displayableTitle: t('stationDetailPage.errorMessageStationDetails'),
            displayableDescription: t('stationDetailPage.errorMessageStationDetailsDesc'),
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [selectedParty]);

  const formatedDate = (date: Date | undefined) => {
    if (date) {
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
    return null;
  };

  return operator ? (
    <StationDetailsValidation
      stationWrapper={stationDetailWrapper}
      StationDetailsValidation={stationDetail}
      stationDetail={stationDetail}
      stationId={stationId}
      formatedDate={formatedDate}
      goBack={goBack}
    />
  ) : (
    <StationDetails stationDetail={stationDetail} formatedDate={formatedDate} />
  );
};

export default StationDetailPage;
