import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStationDetails } from '../../../services/stationService';
import { StationDetailResource } from '../../../api/generated/portal/StationDetailResource';
import { LOADING_TASK_STATION_DETAILS } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getWrapperStation } from '../../../services/__mocks__/stationService';
import {
  TypeEnum,
  WrapperEntitiesOperations,
} from '../../../api/generated/portal/WrapperEntitiesOperations';
import StationDetails from './components/StationDetails';
import StationDetailsValidation from './components/StationDetailsValidation';

const StationDetailPage = () => {
  const { t } = useTranslation();
  const { stationId } = useParams<{ stationId: string }>();
  const [stationDetail, setStationDetail] = useState<StationDetailResource>();

  const [stationDetailWrapper, setStationDetailWrapper] = useState<WrapperEntitiesOperations>();
  const [stationDetWrap, setStationDetWrap] = useState<any>();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_DETAILS);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';

  useEffect(() => {
    if (isOperator) {
      setLoading(true);
      getWrapperStation(stationId)
        .then((response) => {
          console.log('Response', response);
          setStationDetailWrapper(response);
          if (response.type === TypeEnum.STATION && response.wrapperEntityOperationsSortedList) {
            console.log('Response', response.wrapperEntityOperationsSortedList[0].entity);
            setStationDetWrap(response.wrapperEntityOperationsSortedList[0].entity);
          }
        })
        .catch((reason) => {
          addError({
            id: 'GET_STATION_DETAILS_WRAPPER',
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
    } else {
      setLoading(true);
      getStationDetails(stationId)
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
  }, []);

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

  return isOperator ? (
    <StationDetailsValidation
      stationWrapper={stationDetailWrapper}
      StationDetailsValidation={stationDetWrap}
      stationDetail={stationDetail}
      stationId={stationId}
      formatedDate={formatedDate}
      isOperator={isOperator}
    />
  ) : (
    <StationDetails stationDetail={stationDetail} formatedDate={formatedDate} />
  );
};

export default StationDetailPage;
