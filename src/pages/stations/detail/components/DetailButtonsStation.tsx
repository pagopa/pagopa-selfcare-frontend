/* eslint-disable sonarjs/no-identical-functions */
import { Stack, Button } from '@mui/material';
import { Link, generatePath, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { useAppSelector } from '../../../../redux/hooks';
// import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { StationDetailResource } from '../../../../api/generated/portal/StationDetailResource';
import ROUTES, { BASE_ROUTE } from '../../../../routes';
import { StationFormAction } from '../../../../model/Station';
import { isOperator } from '../../components/commonFunctions';
import { WrapperStatusEnum } from '../../../../api/generated/portal/StationDetailResource';

type Props = {
  stationDetail?: StationDetailResource;
  stationCode: string;
};

const DetailButtonsStation = ({ stationDetail, stationCode }: Props) => {
  // const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { t } = useTranslation();
  const history = useHistory();
  const operator = isOperator();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      {operator && stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={() =>
              generatePath(ROUTES.STATION_EDIT, {
                stationId: stationCode,
                actionId: StationFormAction.Edit,
              })
            }
            variant="contained"
            // TBD
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      ) : operator &&
        stationDetail?.wrapperStatus ===
          (WrapperStatusEnum.TO_CHECK || WrapperStatusEnum.TO_FIX) ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('stationDetailPage.stationOptions.correctionRequired')}
          </Button>
          <Button
            component={Link}
            to={() =>
              generatePath(ROUTES.STATION_EDIT, {
                stationId: stationCode,
                actionId: StationFormAction.Edit,
              })
            }
            variant="contained"
            // TBD
          >
            {t('stationDetailPage.stationOptions.configureStation')}
          </Button>
        </>
      ) : stationDetail?.wrapperStatus === WrapperStatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={''}
            color="error"
            variant="outlined"
            // onClick={() => ''}
          >
            {t('stationDetailPage.stationOptions.deleteRequired')}
          </Button>
          <Button
            component={Link}
            to={() => ''}
            variant="outlined"
            // TBD
          >
            {t('stationDetailPage.stationOptions.duplicateStation')}
          </Button>
          <Button
            // component={Link}
            // to={() =>
            //   generatePath(ROUTES.STATION_EDIT, {
            //     stationId: stationCode,
            //     actionId: StationFormAction.Edit,
            //   })
            // }
            variant="contained"
            onClick={() => history.push(`${BASE_ROUTE}/stations/${stationCode}/edit`)}
            // TBD
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      ) : stationDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX ? (
        <>
          <Button
            // component={Link}
            // to={() => ''}
            variant="contained"
            // TBD
          >
            {t('stationDetailPage.stationOptions.correctStation')}
          </Button>
        </>
      ) : (
        <>
          <Button
            // component={Link}
            // to={() =>
            //   generatePath(ROUTES.STATION_EDIT, {
            //     stationId: stationCode,
            //     actionId: StationFormAction.Edit,
            //   })
            // }
            variant="contained"
            onClick={() => history.push(`${BASE_ROUTE}/stations/${stationCode}/edit`)}
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default DetailButtonsStation;
