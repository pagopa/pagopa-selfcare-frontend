import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Trans } from 'react-i18next';

const DelegationsTableEmpty = () => (
  <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }} data-testid="empty-delegations">
    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
      <Typography variant="body2">
        <Trans i18nKey="delegationsPage.table.noDelegations">
          Non sono ancora presenti intermediari
        </Trans>
      </Typography>
    </Box>
  </Box>
);

export default DelegationsTableEmpty;
