import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

export default function TableEmptyState({ componentName }: Readonly<{ componentName: string }> ) {
  const { t } = useTranslation();
  return (
    <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }} data-testid="empty-state-table">
      <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <Typography variant="body2">
          {componentName ? t(`${componentName}.table.emptyState`) : ''}
        </Typography>
      </Box>
    </Box>
  );
}
