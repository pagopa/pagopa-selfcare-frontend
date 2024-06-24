<<<<<<< HEAD
import { Box, Chip, Typography } from '@mui/material';
import { GridColumnHeaderParams } from '@mui/x-data-grid';
import { CSSProperties } from 'react';
=======
import {Box, Chip, Typography} from '@mui/material';
import {GridColumnHeaderParams, GridRenderCellParams} from '@mui/x-data-grid';
import {CSSProperties} from 'react';
>>>>>>> 3f32cfc3 (Formatting (#542))

export function showCustomHeader(params: GridColumnHeaderParams) {
    return (
        <Typography
            color="colorTextPrimary"
            variant="caption"
            sx={{fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 1}}
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
                color={color ? color : mainCell ? 'primary' : undefined}
                fontWeight={mainCell ? 'fontWeightBold' : '16px'}
                noWrap
                data-testid="render-cell"
            >
                {value ?? '-'}
            </Typography>
        </Box>
    );
}

export type colorType =
<<<<<<< HEAD
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined;

export function renderStatusChip({
  chipLabel,
  chipColor = 'default',
  cellColor = undefined,
  dataTestId,
  size,
  chipStyle,
}: {
  chipLabel: string;
  chipColor?: colorType;
  cellColor?: string;
  dataTestId?: string;
  size?: 'small' | 'medium';
  chipStyle?: Record<any, any>;
}) {
  return renderCell({
    value: (
      <Chip
        label={chipLabel}
        aria-label="Status"
        data-testid={dataTestId ?? 'status-chip'}
        sx={{ ...(chipStyle ?? {}) }}
        color={chipColor}
        size={size}
      />
    ),
    color: cellColor,
  });
=======
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | undefined;

export function renderStatusChip({
                                     chipLabel,
                                     chipColor = 'default',
                                     cellColor = undefined,
                                     dataTestId,
                                     size
                                 }: {
    chipLabel: string;
    chipColor?: colorType;
    cellColor?: string | undefined;
    dataTestId?: string;
    size?: "small" | "medium" | undefined;
}) {
    return renderCell({
        value: (
            <Chip
                label={chipLabel}
                aria-label="Status"
                data-testid={dataTestId ?? 'status-chip'}
                color={chipColor}
                size={size}
            />
        ),
        color: cellColor,
    });
>>>>>>> 3f32cfc3 (Formatting (#542))
}
