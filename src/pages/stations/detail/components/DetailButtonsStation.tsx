/* eslint-disable sonarjs/no-identical-functions */
import { Stack, Button } from '@mui/material';
import { Link, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { StatusEnum } from '../../../../api/generated/portal/WrapperStationDetailsDto';
import { WrapperEntitiesOperations } from '../../../../api/generated/portal/WrapperEntitiesOperations';
import { StationDetailResource } from '../../../../api/generated/portal/StationDetailResource';
import { StationStatusEnum } from '../../../../api/generated/portal/StationResource';
import ROUTES from '../../../../routes';
import { StationFormAction } from '../../../../model/Station';

type Props = {
  stationDetailWrapper?: WrapperEntitiesOperations;
  stationDetail?: StationDetailResource;
  stationCode: string;
};

const DetailButtonsStation = ({ stationDetailWrapper, stationDetail, stationCode }: Props) => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';
  const { t } = useTranslation();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      {isOperator && stationDetailWrapper?.status === StatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={() =>
              generatePath(`${ROUTES.STATION_EDIT}`, {
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
      ) : isOperator &&
        stationDetailWrapper?.status === (StatusEnum.TO_CHECK || StatusEnum.TO_FIX) ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('stationDetailPage.stationOptions.correctionRequired')}
          </Button>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('stationDetailPage.stationOptions.configureStation')}
          </Button>
        </>
      ) : stationDetail?.stationStatus === StationStatusEnum.ACTIVE ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
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
            component={Link}
            to={() =>
              generatePath(`${ROUTES.STATION_EDIT}`, {
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
      ) : stationDetail?.stationStatus === StationStatusEnum.TO_BE_CORRECTED ? (
        <>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('stationDetailPage.stationOptions.correctStation')}
          </Button>
        </>
      ) : (
        <>
          <Button
            component={Link}
            to={() =>
              generatePath(`${ROUTES.STATION_EDIT}`, {
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
      )}
    </Stack>
  );
};

export default DetailButtonsStation;
