import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Add } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { Alert, Button, Stack } from '@mui/material';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import StationMaintenancesTable from './StationMaintenancesTable';
import StationMaintenancesHoursSummary from './StationMaintenancesHoursSummary';

const componentPath = 'stationMaintenancesPage';
export default function StationMaintenancesPage() {
  const { t } = useTranslation();
  const [alertMessage, setAlertMessage] = useState<string | undefined>();

  return (
    <SideMenuLayout>
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
              /* TODO ROUTE TO CREATE MAINTENANCE PAGE PPANTT-42 */ 
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
      <StationMaintenancesHoursSummary />
      <StationMaintenancesTable setAlertMessage={setAlertMessage}/>
    </SideMenuLayout>
  );
}
