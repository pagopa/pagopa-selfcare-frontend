import { Typography, Box, IconButton } from '@mui/material';
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
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: t('operationTableListPage.column.companyName'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell(params, params.row.name),
      sortable: false,
      flex: 4,
    },
    {
      field: 'fiscalCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('operationTableListPage.column.taxCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, params.row.tax_code),
      sortable: false,
      flex: 3,
    },
    {
      field: 'email',
      cellClassName: 'justifyContentNormal',
      headerName: t('operationTableListPage.column.email'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, params.row.email),
      sortable: false,
      flex: 3,
    },
    {
      field: 'telephone',
      cellClassName: 'justifyContentNormal',
      headerName: t('operationTableListPage.column.phone'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, params.row.telephone),
      sortable: false,
      flex: 3,
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
            onClick={onRowClick ? () => onRowClick(p.row.taxCode) : undefined}
            data-testid={`open-${p.row.taxCode}`}
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
