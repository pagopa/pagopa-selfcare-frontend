import React from 'react';

import { Typography, Box, IconButton } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

import { theme } from '@pagopa/mui-italia';

export interface BundleTaxonomiesGroupButtonProps {
  /* The name to show  */
  title: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
}

export const BundleTaxonomiesGroupButton = ({
  title,
  action,
}: BundleTaxonomiesGroupButtonProps) => (
    <Box
      py={1.5}
      px={2}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
      onClick={action}
      display="flex"
      flexDirection={'row'}
      alignItems={'center'}
      data-testid="taxonomy-group-item"
    >
      <Typography variant="subtitle1">{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', pl: 1.25 }}>
        {' '}
        <IconButton
          sx={{
            width: '100%',
            '&:hover': { backgroundColor: 'transparent !important' },
          }}
          data-testid="taxonomy-group-button"
        >
          <ArrowForwardIos sx={{ color: 'primary.main', fontSize: '24px' }} />
        </IconButton>
      </Box>
    </Box>
  );

export default BundleTaxonomiesGroupButton;
