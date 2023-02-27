import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { theme } from '@pagopa/mui-italia';
import SideMenu from '../../../components/SideMenu/SideMenu';
import StationsTable, { mockedStations } from './StationsTable';

export default function StationsPage() {
  const { t } = useTranslation();

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
        <Grid sx={{ display: 'flex', flexDirection: 'row' }} mt={1}>
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
          <Button variant="contained" sx={{ ml: 2, whiteSpace: 'nowrap', minWidth: 'auto' }}>
            <Typography
              mx={3}
              sx={{ color: 'background.paper', fontWeight: '600', fontSize: '16px' }}
            >
              {t('stationsPage.createStationButtonLabel')}
            </Typography>
          </Button>
        </Grid>

        {mockedStations && mockedStations.stations.length > 0 ? (
          <StationsTable />
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
                  onClick={() => {}}
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontWeight: '700',
                    color: theme.palette.primary.main,
                  }}
                >
                  {/* TODO Redirect to addStationPage */}
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
