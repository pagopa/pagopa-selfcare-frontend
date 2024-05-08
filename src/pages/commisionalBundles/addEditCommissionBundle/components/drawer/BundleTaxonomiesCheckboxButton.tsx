'use client';

import React from 'react';

import { Typography, Box, Tooltip, Checkbox, FormControlLabel } from '@mui/material';

import { theme } from '@pagopa/mui-italia';

export interface BundleTaxonomiesCheckboxButtonProps {
  /* The name to show  */
  title: string;
  subtitle?: string;
  action?: React.Dispatch<React.ChangeEvent<HTMLInputElement>>;
  checked?: boolean;
  disabled?: boolean;
}

export const BundleTaxonomiesCheckboxButton = ({
  title,
  subtitle,
  action,
  checked,
  disabled
}: BundleTaxonomiesCheckboxButtonProps) => (
  <Box
    py={1}
    px={2}
    sx={{
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    }}
    display="flex"
    flexDirection={'row'}
    alignItems={'center'}
  >
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={action} disabled={disabled}  data-testid="checkbox-item"/>}
      label={''}
      data-testid="checkbox-taxonomy"
    />
    <div>
      <Typography variant="body1">{title}</Typography>

      <Typography variant="body1" sx={{ mb: 1, lineHeight: 1 }} color="action.active">
        {subtitle ?? ''}
      </Typography>
    </div>
  </Box>
);

export default BundleTaxonomiesCheckboxButton;
