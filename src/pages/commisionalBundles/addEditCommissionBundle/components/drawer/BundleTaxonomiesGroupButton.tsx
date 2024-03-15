import React from 'react';

import { Typography, Box, Tooltip, IconButton } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

import { theme } from '@pagopa/mui-italia';

export interface BundleTaxonomiesGroupButtonProps {
  /* The name to show  */
  title: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
  /* The number of characters beyond which the multiLine is applied */
  maxCharactersNumberMultiLine?: number;
}

export const BundleTaxonomiesGroupButton = ({
  title,
  action,
  maxCharactersNumberMultiLine = 50,
}: BundleTaxonomiesGroupButtonProps) => {
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
    >
      <Tooltip arrow title={maxCharacter ? title : ''}>
        <Typography
          variant="subtitle1"
          sx={{
            lineHeight: 1.2,
            ...(maxCharacter && {
              ...truncatedText,
              WebkitLineClamp: 2,
            }),
          }}
        >
          {title}
        </Typography>
      </Tooltip>

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
};

export default BundleTaxonomiesGroupButton;
