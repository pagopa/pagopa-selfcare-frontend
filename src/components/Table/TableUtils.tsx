import { Box, Chip, Typography } from '@mui/material';
import { GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import { CSSProperties } from 'react';

export function showCustomHeader(params: GridColumnHeaderParams) {
  return (
    <Typography
      color="colorTextPrimary"
      variant="caption"
      sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 1 }}
    >
      {params.colDef.headerName}
    </Typography>
  );
}

export function renderCell({
  value,
  color = undefined,
  overrideStyle = {},
  mainCell = false,
}: {
  value?: any;
  color?: string | undefined;
  overrideStyle?: CSSProperties;
  mainCell?: boolean;
}) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingLeft: 2.5,
        WebkitBoxOrient: 'vertical' as const,
        ...overrideStyle,
      }}
    >
      <Typography
        variant="body2"
        color={mainCell ? 'primary' : undefined}
        fontWeight={mainCell ? 'fontWeightBold' : '16px'}
        noWrap
      >
        {value ?? '-'}
      </Typography>
    </Box>
  );
}

export function renderStatusChip({
  chipLabel,
  chipColor,
  chipBgColor,
  cellColor = undefined,
}: {
  params: GridRenderCellParams;
  chipLabel: string;
  chipColor: string;
  chipBgColor: string;
  cellColor?: string | undefined;
}) {
  return renderCell({
    value: (
      <Box>
        <Chip
          label={chipLabel}
          aria-label="Status"
          sx={{
            fontSize: '14px',
            fontWeight: 'fontWeightMedium',
            color: chipColor,
            backgroundColor: chipBgColor,
            paddingBottom: '1px',
            height: '24px',
          }}
        />
      </Box>
    ),
    color: cellColor,
  });
}
