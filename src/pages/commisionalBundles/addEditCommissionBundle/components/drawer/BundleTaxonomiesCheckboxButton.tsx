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
  /* The number of characters beyond which the multiLine is applied */
  maxCharactersNumberMultiLine?: number;
}

export const BundleTaxonomiesCheckboxButton = ({
  title,
  subtitle,
  action,
  checked,
  maxCharactersNumberMultiLine = 50,
}: BundleTaxonomiesCheckboxButtonProps) => {
  const maxCharacter = title && title.length > maxCharactersNumberMultiLine;
  const truncatedText = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    width: '100%',
    whiteSpace: 'normal' as const,
  };
  return (
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
      <Box>
        <FormControlLabel control={<Checkbox checked={checked} onChange={action} />} label={''} data-testid="checkbox-taxonomy" />
      </Box>
      <Tooltip arrow title={maxCharacter ? title : ''}>
        <Box>
          <Typography
            variant="body1"
            sx={{
              ...(maxCharacter && {
                ...truncatedText,
                WebkitLineClamp: 2,
              }),
            }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, lineHeight: 1 }} color="action.active">
            {subtitle ?? ''}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default BundleTaxonomiesCheckboxButton;
