import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { theme } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SideMenu from '../../../components/SideMenu/SideMenu';
import { getStations } from '../../../services/stationService';
import { StationsResource } from '../../../api/generated/portal/StationsResource';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import ROUTES from '../../../routes';
import StationsTable from './StationsTable';

export default function StationsPage() {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const [stations, setStations] = useState<StationsResource>();

  useEffect(() => {
    setLoading(true);
    getStations(0)
      .then((retrievedStations) => {
        console.log('retrievedStations: ', retrievedStations);
        setStations(retrievedStations);
      })
      .catch((reason) =>
        addError({
          id: 'RETRIEVE_STATIONS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving stations`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container item xs={12} sx={{ backgroundColor: '#F5F5F5' }}>
      <Grid item xs={2} sx={{ backgroundColor: 'background.paper' }}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid item xs={10} display="flex" flexDirection="column" pb={8} px={3}>
        <Box width="100%">
          <TitleBox
            title={t('stationsPage.title')}
            subTitle={t('stationsPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Box>
        {history.location.state && (history.location.state as any).alertSuccessMessage && (
          <Alert severity="success" variant="outlined">
            {(history.location.state as any).alertSuccessMessage}
          </Alert>
        )}
        <Grid sx={{ display: 'flex', flexDirection: 'row' }} mt={3}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="disabled" />
                </InputAdornment>
              ),
              sx: {
                height: 48,
                fontWeight: '400',
                backgroundColor: 'background.paper',
              },
            }}
            type="tel"
            fullWidth
            placeholder={t('stationsPage.searchPlaceholder')}
          />
          <Button
            variant="contained"
            sx={{ ml: 2, whiteSpace: 'nowrap', minWidth: 'auto' }}
            onClick={() => history.push(ROUTES.STATION_ADD)}
          >
            <Typography
              mx={3}
              sx={{ color: 'background.paper', fontWeight: '600', fontSize: '16px' }}
            >
              {t('stationsPage.createStationButtonLabel')}
            </Typography>
          </Button>
        </Grid>

        {stations && stations.stationsList.length > 0 ? (
          <StationsTable stations={stations} />
        ) : (
          <Grid
            sx={{
              backgroundColor: '#EEEEEE',
              display: 'inline-grid',
              alignContent: 'center',
            }}
            mt={3}
          >
            <Paper
              sx={{
                height: '56px',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                margin: 3,
              }}
            >
              <Trans i18next="stationsPage.notFoundStations">
                Non sono ancora presenti stazioni in ambiente di collaudo.&nbsp;
                <Link
                  onClick={() => history.push(ROUTES.STATION_ADD)}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontWeight: '700',
                    color: theme.palette.primary.main,
                  }}
                >
                  Crea stazione
                </Link>
              </Trans>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
