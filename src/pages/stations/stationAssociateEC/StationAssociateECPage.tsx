import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation, Trans } from 'react-i18next';
import { Box } from '@mui/system';
import { /* useErrorDispatcher, */ useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import ROUTES from '../../../routes';
import { LOADING_TASK_EC_AVAILABLE } from '../../../utils/constants';
import { EC } from '../../../model/EC';
import { getStationAvailableEC } from '../../../services/stationService';
import ECSelectionSearch from './ECSelectionSearch';

function StationAssociateECPage() {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_EC_AVAILABLE);
  // const addError = useErrorDispatcher();

  const { stationId } = useParams<{ stationId: string }>();

  const [selectedEC, setSelectedEC] = useState<EC | undefined>();
  const [availableEC, setAvailableEC] = useState<Array<EC>>([]);

  const formik = useFormik({
    initialValues: {
      product: '',
    },
    onSubmit: (_values) => {},
  });

  const history = useHistory();

  const goBack = () => {
    history.push(
      generatePath(ROUTES.STATION_EC_LIST, {
        stationId,
      })
    );
  };

  const handleSubmit = () => {
    if (selectedEC) {
      /* setLoading(true);
      associateECtoStation(selectedEC.id, stationId)
        .then((_data) => {
          history.push(ROUTES.STATION_EC_LIST, {
            alertSuccessMessage: t('stationAssociateECPage.associationForm.successMessage'),
          });
        })
        .catch((reason) =>
          addError({
            id: 'ASSOCIATE_EC',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while ec association`,
            toNotify: true,
            displayableTitle: t('stationAssociateECPage.associationForm.errorMessageTitle'),
            displayableDescription: t('stationAssociateECPage.associationForm.errorMessageDesc'),
            component: 'Toast',
          })
        )
        .finally(() => setLoading(false));
        */
      history.push(
        generatePath(ROUTES.STATION_EC_LIST, {
          stationId,
        }),
        {
          alertSuccessMessage: t('stationAssociateECPage.associationForm.successMessage'),
        }
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    getStationAvailableEC()
      .then((data) => {
        if (data) {
          setAvailableEC(data);
        }
      })
      .catch((reason) => console.error(reason))
      .finally(() => setLoading(false));
    setLoading(false);
  }, []);

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Box justifyContent="center">
        <Grid item xs={12} mb={1} display="flex" justifyContent="center">
          <Typography variant="h3">
            <Trans i18nKey="stationAssociateECPage.associationForm.title">Associa EC</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} mb={4} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            <Trans i18nKey="stationAssociateECPage.associationForm.subTitle">
              Digita il nome del nuovo EC da associare al canale
            </Trans>{' '}
            <Typography component="span" fontWeight={600}>
              {stationId}
            </Typography>
          </Typography>
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexGrow={0}
        mb={1}
        sx={{ width: '100%', maxWidth: '684px' }}
      >
        <Paper
          elevation={8}
          sx={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
          }}
        >
          <Grid item xs={12} p={3}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl sx={{ width: '100%', minWidth: '100%' }}>
                <ECSelectionSearch
                  iconColor={'#17324D'}
                  label={t('stationAssociateECPage.associationForm.ECSelectionInputPlaceholder')}
                  availableEC={availableEC}
                  selectedEC={selectedEC}
                  onECSelectionChange={(selectedEC: EC | undefined) => {
                    setSelectedEC(selectedEC);
                  }}
                />
              </FormControl>
            </form>
          </Grid>
        </Paper>
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack} data-testid="back-btn-test">
            {t('stationAssociateECPage.associationForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={handleSubmit}
            // disabled={!formik.dirty || !formik.isValid}
            disabled={!selectedEC}
            color="primary"
            variant="contained"
            data-testid="confirm-btn-test"
          >
            {t('stationAssociateECPage.associationForm.confirmButton')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default StationAssociateECPage;
