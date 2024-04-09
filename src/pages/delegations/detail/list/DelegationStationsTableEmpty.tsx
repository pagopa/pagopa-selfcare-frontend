import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trans } from 'react-i18next';

const DelegationStationsTableEmpty = () => (
  <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }} data-testid="empty-delegations">
    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
      <Typography variant="body2">
        <Trans i18nKey="delegationsPage.table.noDelegations">
          Non sono ancora presenti stazioni associate all`&apos;`ente.
        </Trans>
      </Typography>
    </Box>
  </Box>
);

export default DelegationStationsTableEmpty;
