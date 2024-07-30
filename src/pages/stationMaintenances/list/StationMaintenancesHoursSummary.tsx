import { Grid, Paper, Typography } from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LOADING_TASK_STATION_MAINTENANCES_HOURS_SUMMARY } from '../../../utils/constants';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { useAppSelector } from '../../../redux/hooks';
import { getBrokerMaintenancesSummary } from '../../../services/stationMaintenancesService';
import { MaintenanceHoursSummaryResource } from '../../../api/generated/portal/MaintenanceHoursSummaryResource';

const emptySummary: MaintenanceHoursSummaryResource = {
  used_hours: '',
  scheduled_hours: '',
  remaining_hours: '',
  extra_hours: '',
  annual_hours_limit: '',
};

const rowOrder = [
  'used_hours',
  'annual_hours_limit',
  'scheduled_hours',
  'extra_hours',
  'remaining_hours',
];

const componentPath = 'stationMaintenancesPage.hoursSummary';
export default function StationMaintenancesHoursSummary() {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_MAINTENANCES_HOURS_SUMMARY);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const [hoursSummary, setHoursSummary] = useState<MaintenanceHoursSummaryResource>(emptySummary);

  const getHoursSummary = () => {
    setLoading(true);
    getBrokerMaintenancesSummary({
      brokerTaxCode: selectedParty?.fiscalCode ?? '',
      maintenanceYear: new Date().getFullYear().toString(),
    })
      .then((res: MaintenanceHoursSummaryResource) => {
        if (res) {
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
          displayableDescription: t(`${componentPath}.errorGetSummary`),
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
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="overline">{t(`${componentPath}.title`)}</Typography>
      <Grid container mt={2} spacing={1}>
        {rowOrder.map((el) => (
          <React.Fragment key={'hours' + el}>
            <Grid item xs={2}>
              <Typography variant="body2">{t(`${componentPath}.${el}`)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" ml={5} fontWeight="medium">
                {hoursSummary[el as keyof MaintenanceHoursSummaryResource] || '-'}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Paper>
  );
}
