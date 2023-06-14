import { Box, Link, Typography } from '@mui/material';
import { Trans } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../../routes';

const StationTableEmpty = () => (
  <>
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

export default StationTableEmpty;
