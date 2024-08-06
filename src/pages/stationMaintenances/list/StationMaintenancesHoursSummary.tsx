import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceHoursSummaryResource } from '../../../api/generated/portal/MaintenanceHoursSummaryResource';

const rowOrder = [
  'used_hours',
  'annual_hours_limit',
  'scheduled_hours',
  'extra_hours',
  'remaining_hours',
];

const componentPath = 'stationMaintenancesPage.hoursSummary';
export default function StationMaintenancesHoursSummary({
  hoursSummary,
}: {
  hoursSummary: MaintenanceHoursSummaryResource;
}) {
  const { t } = useTranslation();

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
