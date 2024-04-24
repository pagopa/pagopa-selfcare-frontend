import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { TFunction } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { CIBrokerStationResource } from '../../../api/generated/portal/CIBrokerStationResource';
import { PaddedDrawer } from '../../../components/PaddedDrawer';
import ROUTES from '../../../routes';
import { formatDateToDDMMYYYY } from '../../../utils/common-utils';

export const DelegationStationDetailsDrawer = ({
  t,
  setDrawerValue,
  drawerValue,
  setShowDisassociateStationModal,
}: {
  t: TFunction<'translation', undefined>;
  setDrawerValue: (openDrawer: CIBrokerStationResource) => void;
  drawerValue: CIBrokerStationResource;
  setShowDisassociateStationModal: (openModal: string) => void;
}) => {
  const history = useHistory();

  return (
    <PaddedDrawer
      openDrawer={drawerValue?.station_code !== undefined}
      setOpenDrawer={setDrawerValue}
      drawerButtons={
        <Button
          fullWidth
          onClick={() => {
            setShowDisassociateStationModal(drawerValue?.station_code ?? '');
            setDrawerValue({});
          }}
          color="error"
          variant="outlined"
          data-testid="station-detail-disassociate-station-button"
        >
          {t('delegationDetailPage.stationDetail.disassociateStaion')}
        </Button>
      }
    >
      <TitleBox title={t('delegationDetailPage.stationDetail.title')} variantTitle="h5" />
      <Box mb={1} data-testid="station-detail-drawer-column">
        <Box mt={3}>
          <Typography variant="overline">
            {t('delegationDetailPage.stationDetail.registry')}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.stationCode')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.station_code ?? '-'}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.activationDate')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.activation_date
              ? formatDateToDDMMYYYY(drawerValue?.activation_date)
              : '-'}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.auxDigit')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.aux_digit ?? 3}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.segregationCode')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.segregation_code ?? '-'}
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.applicationCode')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.application_code ?? '-'}
          </Typography>
        </Box>

        <Box mt={1} mb={3}>
          <ButtonNaked
            size="large"
            component="button"
            endIcon={<ArrowForwardIcon />}
            onClick={() =>
              history.push(
                generatePath(ROUTES.STATION_DETAIL, { stationId: drawerValue?.station_code })
              )
            }
            sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
            weight="default"
            data-testid="go-to-station-details-test"
          >
            {t('delegationDetailPage.stationDetail.goToStationDetails')}
          </ButtonNaked>
        </Box>

        <Box mt={5}>
          <Typography variant="overline">
            {t('delegationDetailPage.stationDetail.references')}
          </Typography>
        </Box>

        <Box mt={1}>
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
        </Box>

        <Box mt={1}>
          <Typography variant="body1" color="action.active">
            {t('delegationDetailPage.stationDetail.lastUpdate')}
          </Typography>
          <Typography variant="body1" fontWeight={'fontWeightMedium'}>
            {drawerValue?.last_modified_date
              ? formatDateToDDMMYYYY(drawerValue?.last_modified_date)
              : '-'}
          </Typography>
        </Box>
      </Box>
    </PaddedDrawer>
  );
};
