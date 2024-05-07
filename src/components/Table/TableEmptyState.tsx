import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export default function TableEmptyState({
  componentName,
  translationPathSuffix,
  translationArgs,
  children,
}: Readonly<{
  componentName: string;
  children?: ReactNode;
  translationPathSuffix?: string;
  translationArgs?: any;
}>) {
  const { t } = useTranslation();
  return (
    <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }} data-testid="empty-state-table">
      <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <Typography variant="body2">
          {t(
            `${componentName}.table.emptyState${
              translationPathSuffix ? `.${translationPathSuffix}` : ''
            }`,
            translationArgs
          )}
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
