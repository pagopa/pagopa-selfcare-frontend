import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridOverlay } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export default function TableEmptyState({
  componentName,
  translationPathSuffix,
  translationArgs,
  linkToRedirect,
  children,
}: Readonly<{
  componentName: string;
  linkToRedirect?: string;
  children?: ReactNode;
  translationPathSuffix?: string;
  translationArgs?: any;
}>) {
  const { t } = useTranslation();
  return (
    <GridOverlay sx={{ pointerEvents: 'all' }}>
      <Box
        sx={{ backgroundColor: 'rgb(242, 242, 242)' }}
        data-testid="empty-state-table"
        width="100%"
      >
        <Box
          p={2}
          sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}
          display="flex"
          justifyContent={'center'}
        >
          <Typography variant="body2">
            {t(
              `${componentName}.table.emptyState${
                translationPathSuffix ? `.${translationPathSuffix}` : ''
              }`,
              translationArgs
            )}
            {linkToRedirect && (
              <Link
                component={RouterLink}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  whiteSpace: 'pre',
                  ml: 1,
                  fontWeight: 'fontWeightMedium',
                }}
                to={linkToRedirect}
              >
                {t(`${componentName}.table.link`)}
              </Link>
            )}
          </Typography>
          {children}
        </Box>
      </Box>
    </GridOverlay>
  );
}
