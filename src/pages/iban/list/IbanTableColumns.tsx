import { Typography, Grid, Box, Chip, IconButton } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { ArrowForwardIos } from '@mui/icons-material';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (ec_code: string) => void
) {
  return [
    {
      field: 'ibanValue',
      cellClassName: 'justifyContentBold',
      headerName: t('ibanPage.list.column.ibanCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showIbanValue(params),
      sortable: false,
      flex: 4,
    },
    {
      field: 'description',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.description'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, params.row.description),
      sortable: false,
      flex: 3,
    },
    {
      field: 'activeDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.activeDate'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell(params, params.row.publicationDate.toLocaleDateString('en-GB')),
      sortable: false,
      flex: 3,
    },
    {
      field: 'enabled',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.status'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
      sortable: false,
      flex: 2,
    },
    {
      field: 'actions',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'right',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: (p) => (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
          mr={2}
          sx={{ cursor: 'pointer' }}
        >
          <IconButton
            onClick={onRowClick ? () => onRowClick(p.row.ibanValue) : undefined}
            data-testid={`open-${p.row.ibanValue}`}
            sx={{
              width: '100%',
              '&:hover': { backgroundColor: 'transparent !important' },
            }}
          >
            <ArrowForwardIos sx={{ color: 'primary.main', fontSize: '24px' }} />
          </IconButton>
        </Box>
      ),
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params.value,
  overrideStyle: CSSProperties = {}
) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingRight: '18px',
        paddingLeft: '18px',
        paddingTop: '-16px',
        paddingBottom: '-16px',

        WebkitBoxOrient: 'vertical' as const,
        ...overrideStyle,
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          width: '100%',
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
          fontSize: '14px',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export function showCustomHeader(params: GridColumnHeaderParams) {
  return (
    <React.Fragment>
      <Typography
        color="colorTextPrimary"
        variant="caption"
        sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 1 }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

export function showIbanValue(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 'fontWeightMedium',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                }}
              >
                {params.row.ibanValue}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

export function showStatus(params: GridRenderCellParams) {
  const now = new Date();
  const rowDate = new Date(params.row.publicationDate);
  const isEnabled = rowDate < now ? true : false;

  return renderCell(
    params,
    <Box>
      <Chip
        label={isEnabled ? 'Attivo' : 'Disattivo'}
        aria-label="Status"
        sx={{
          fontSize: '14px',
          fontWeight: 'fontWeightMedium',
          color: isEnabled ? '#FFFFFF' : '#17324D',
          backgroundColor: isEnabled ? 'primary.main' : 'warning.light',
          paddingBottom: '1px',
          height: '24px',
        }}
      />
    </Box>
  );
}
