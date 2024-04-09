import { Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TitleBox } from "@pagopa/selfcare-common-frontend";
import { TFunction } from 'react-i18next';
import { CIBrokerStationResource } from "../../../api/generated/portal/CIBrokerStationResource";
import { PaddedDrawer } from "../../../components/PaddedDrawer";
import { formatDateToDDMMYYYY } from "../../../utils/common-utils";

export const DelegationStationDetailsDrawer = ({
    t,
    setDrawerValue,
    drawerValue
  }: {
    t: TFunction<'translation', undefined>;
    setDrawerValue: (openDrawer: CIBrokerStationResource) => void;
    drawerValue: CIBrokerStationResource;
  }) => (
        <PaddedDrawer openDrawer={drawerValue?.station_code !== undefined} setOpenDrawer={setDrawerValue}>
          <TitleBox title={t('delegationDetailPage.stationDetail.title')} variantTitle="h5" />
          <Box
            key={`station-detail-${drawerValue.station_code}`}
            mb={1}
            data-testid="station-detail-drawer-column"
          >
            <Typography variant="overline">
              {t('delegationDetailPage.stationDetail.registry')}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.stationCode')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.station_code ?? '-'}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.activationDate')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.activation_date ?
              formatDateToDDMMYYYY(drawerValue?.activation_date) : '-'}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.auxDigit')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.aux_digit ?? '-'}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.segregationCode')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.segregation_code ?? '-'}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.applicationCode')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.application_code ?? '-'}
            </Typography>
  
            <Typography variant="overline">
              {t('delegationDetailPage.stationDetail.references')}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.status.label')}
            </Typography>
            <Grid item xs={8}>
              {drawerValue?.station_enabled ? (
                <Chip
                  label={t('delegationDetailPage.stationDetail.status.active')}
                  color="success"
                ></Chip>
              ) : (
                <Chip label={t('delegationDetailPage.stationDetail.status.inactive')}></Chip>
              )}
            </Grid>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.stationDetail.lastUpdate')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {drawerValue?.last_modified_date ?
              formatDateToDDMMYYYY(drawerValue?.last_modified_date) : '-'}
            </Typography>
          </Box>
        </PaddedDrawer>
    );
  