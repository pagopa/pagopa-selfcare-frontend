import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Add } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { Alert, Button, Stack } from '@mui/material';
import { generatePath, useHistory } from 'react-router-dom';
import ROUTES from '../../../routes';
import { fromHoursFormattedToNumbers } from '../../../utils/common-utils';
import { StationMaintenanceActionType } from '../../../model/StationMaintenance';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import { MaintenanceHoursSummaryResource } from '../../../api/generated/portal/MaintenanceHoursSummaryResource';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getBrokerMaintenancesSummary } from '../../../services/stationMaintenancesService';
import { LOADING_TASK_STATION_MAINTENANCES_HOURS_SUMMARY } from '../../../utils/constants';
import { stationsActions } from '../../../redux/slices/stationsSlice';
import SuccessAlertLayout from '../../../components/Layout/SuccessAlertLayout';
import StationMaintenancesTable from './StationMaintenancesTable';
import StationMaintenancesHoursSummary from './StationMaintenancesHoursSummary';

const emptySummary: MaintenanceHoursSummaryResource = {
  used_hours: '',
  scheduled_hours: '',
  remaining_hours: '',
  extra_hours: '',
  annual_hours_limit: '',
};

const componentPath = 'stationMaintenancesPage';
export default function StationMaintenancesPage() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatcher = useAppDispatch();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_MAINTENANCES_HOURS_SUMMARY);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const [hoursSummary, setHoursSummary] = useState<MaintenanceHoursSummaryResource>(emptySummary);

  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  const getHoursSummary = () => {
    setLoading(true);
    getBrokerMaintenancesSummary({
      brokerTaxCode: selectedParty?.fiscalCode ?? '',
      maintenanceYear: new Date().getFullYear().toString(),
    })
      .then((res: MaintenanceHoursSummaryResource) => {
        if (res) {
          dispatcher(
            stationsActions.setStationMaintenanceState({
              hoursRemaining: fromHoursFormattedToNumbers(res.remaining_hours),
              stationMaintenance: undefined,
            })
          );
          setHoursSummary(res);
        } else {
          setHoursSummary(emptySummary);
        }
      })
      .catch((reason) => {
        addError({
          component: 'Toast',
          id: 'GET_STATION_MAINTENANCES_HOURS_SUMMARY',
          displayableTitle: t('general.errorTitle'),
          techDescription: 'An error occured retrieving the hours summary',
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: t(`${componentPath}.hoursSummary.errorGetSummary`),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getHoursSummary();
  }, []);

  return (
    <SideMenuLayout>
      <SuccessAlertLayout>
        <Stack direction="row" justifyContent="space-between">
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <TitleBox
              title={t(`${componentPath}.title`)}
              subTitle={t(`${componentPath}.subTitle`)}
              mbSubTitle={3}
              variantTitle="h4"
              variantSubTitle="body1"
            />
          </Stack>
          <Stack display="flex" justifyContent="flex-end" mb={5}>
            <Button
              variant="contained"
              onClick={() => {
                history.push(
                  generatePath(ROUTES.STATION_MAINTENANCES_ADD_EDIT_DETAIL, {
                    action: StationMaintenanceActionType.CREATE,
                    maintenanceId: 0,
                  })
                );
              }}
              endIcon={<Add />}
              color="primary"
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: theme.spacing(0.5),
                px: 2,
                py: 1.5,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {t(`${componentPath}.createButton`)}
            </Button>
          </Stack>
        </Stack>
        {alertMessage && (
          <Alert
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
            severity="success"
            variant="outlined"
          >
            {alertMessage}
          </Alert>
        )}
        <StationMaintenancesHoursSummary hoursSummary={hoursSummary} />
        <StationMaintenancesTable
          setAlertMessage={setAlertMessage}
          getHoursSummary={getHoursSummary}
          hoursRemaining={hoursSummary.remaining_hours}
        />
      </SuccessAlertLayout>
    </SideMenuLayout>
  );
}
