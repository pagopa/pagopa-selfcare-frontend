import { Search as SearchIcon } from '@mui/icons-material';
import { Box, Button, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, Link as RouterLink, useHistory } from 'react-router-dom';
import ROUTES from '../../../routes';

const StationTableEmpty = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <>
      <Box width="100%" display="flex">
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
            sx: { height: 48, backgroundColor: '#FFFFFF' },
          }}
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
      </Box>
      <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
        <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Typography variant="body2">
            <Trans i18nKey="stationsPage.notFoundStations">
              Non sono ancora presenti stazione in questo ambiente.
              <Link
                component={RouterLink}
                sx={{
                  color: '#0073E6',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                  fontWeight: 700,
                }}
                to={generatePath(ROUTES.STATION_ADD)}
              >
                <strong> Crea Stazione</strong>
              </Link>
            </Trans>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default StationTableEmpty;
