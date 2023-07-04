import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {getStationDetail} from '../../../services/stationService';
import {LOADING_TASK_STATION_DETAILS_WRAPPER} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import {isOperator} from '../components/commonFunctions';
import {StationDetailResource} from '../../../api/generated/portal/StationDetailResource';
import StationDetails from './components/StationDetails';
import StationDetailsValidation from './components/StationDetailsValidation';

const StationDetailPage = () => {
  const { t } = useTranslation();
  const { stationId } = useParams<{ stationId: string }>();
  const [stationDetail, setStationDetail] = useState<StationDetailResource>();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoadingWrap = useLoading(LOADING_TASK_STATION_DETAILS_WRAPPER);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const goBack = () => history.push(ROUTES.STATIONS);

  const operator = isOperator();

  useEffect(() => {
    setLoadingWrap(true);
    getStationDetail(stationId)
      .then((response) => {
        setStationDetail(response);
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
    <StationDetailsValidation stationDetail={stationDetail} formatedDate={formatedDate} />
  ) : (
    <StationDetails stationDetail={stationDetail} formatedDate={formatedDate} goBack={goBack} />
  );
};

export default StationDetailPage;
