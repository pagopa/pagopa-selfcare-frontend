<<<<<<< HEAD
import { Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GridOverlay } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
=======
import {Link, Typography} from '@mui/material';
import {Box} from '@mui/system';
import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {Link as RouterLink} from 'react-router-dom';
>>>>>>> 3f32cfc3 (Formatting (#542))

const EmptyStateWrapper = ({
  isDataGrid,
  children,
}: {
  isDataGrid?: boolean;
  children: ReactNode;
}) => {
  if (isDataGrid) {
    return <GridOverlay sx={{ pointerEvents: 'all' }}>{children}</GridOverlay>;
  }
  return <>{children}</>;
};

export default function TableEmptyState({
<<<<<<< HEAD
  componentName,
  translationPathSuffix,
  translationArgs,
  linkToRedirect,
  children,
  isDataGrid,
}: Readonly<{
  componentName: string;
  linkToRedirect?: string;
  children?: ReactNode;
  translationPathSuffix?: string;
  translationArgs?: any;
  isDataGrid?: boolean; // To delete when all tables uses generic data grid component
}>) {
  const { t } = useTranslation();
  return (
    <EmptyStateWrapper isDataGrid={isDataGrid}>
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
    </EmptyStateWrapper>
  );
=======
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
    const {t} = useTranslation();
    return (
        <Box p={3} mt={3} sx={{backgroundColor: 'rgb(242, 242, 242)'}} data-testid="empty-state-table">
            <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
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
                    {children}
                </Typography>
            </Box>
        </Box>
    );
>>>>>>> 3f32cfc3 (Formatting (#542))
}
