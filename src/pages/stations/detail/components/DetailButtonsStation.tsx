/* eslint-disable sonarjs/no-identical-functions */
import { Button, Stack } from '@mui/material';
import { generatePath, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../routes';
import { StationFormAction } from '../../../../model/Station';
import { isOperator } from '../../../components/commonFunctions';
import { WrapperStatusEnum } from '../../../../api/generated/portal/StationDetailResource';

type Props = {
  status: WrapperStatusEnum | undefined;
  stationCode: string;
};

const DetailButtonsStation = ({ status, stationCode }: Props) => {
  const { t } = useTranslation();
  const operator = isOperator();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      {operator && status === WrapperStatusEnum.APPROVED ? (
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
            data-testid="edit-btn-ope-sts-approved"
            // TBD
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      ) : operator && status !== WrapperStatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={''}
            disabled={true}
            color="error"
            variant="outlined"
            onClick={() => ''}
          >
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
            data-testid="edit-btn-ope-sts-chk-fix"
            // TBD
          >
            {t('stationDetailPage.stationOptions.configureStation')}
          </Button>
        </>
      ) : status === WrapperStatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={''}
            color="error"
            variant="outlined"
            disabled={true}
            // onClick={() => ''}
          >
            {t('stationDetailPage.stationOptions.deleteRequired')}
          </Button>
          <Button
            component={Link}
            to={() =>
              generatePath(ROUTES.STATION_EDIT, {
                stationId: stationCode,
                actionId: StationFormAction.Duplicate,
              })
            }
            variant="outlined"
            data-testid="duplicate-btn-sts-approved"
          >
            {t('stationDetailPage.stationOptions.duplicateStation')}
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
            data-testid="edit-btn-sts-approved"
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      ) : status === WrapperStatusEnum.TO_FIX ? (
        <>
          <Button
            // component={Link}
            // to={() => ''}
            variant="contained"
            // TBD
            disabled={true}
            data-testid="edit-btn-sts-fix"
          >
            {t('stationDetailPage.stationOptions.correctStation')}
          </Button>
        </>
      ) : (
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
            data-testid="edit-btn-sts-approved"
          >
            {t('stationDetailPage.stationOptions.editStation')}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default DetailButtonsStation;
