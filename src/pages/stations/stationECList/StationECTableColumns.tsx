import { Box, Chip, Grid, IconButton, Typography } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { RemoveCircle } from '@mui/icons-material';
import { formatCodeInDoubleDigit } from '../../../utils/common-utils';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (ec_code: string) => void
) {
  return [
    {
      field: 'businessName',
      cellClassName: 'justifyContentBold',
      headerName: t('stationECList.stationsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showEcName(params),
      sortable: false,
      flex: 4,
    },
    {
      field: 'auxDigit',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.auxdigit'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, params.row.auxDigit ?? '0'),
      sortable: false,
      flex: 3,
    },
    {
      field: 'segregationCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.segregationCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, formatCodeInDoubleDigit(params.row.segregationCode)),
      sortable: false,
      flex: 3,
    },
    {
      field: 'applicationCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.appCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, formatCodeInDoubleDigit(params.row.applicationCode)),
      sortable: false,
      flex: 3,
    },
    {
      field: 'broadcast',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.broadcast'),
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
            onClick={onRowClick ? () => onRowClick(p.row.creditorInstitutionCode) : undefined}
            data-testid={`dissociate-${p.row.creditorInstitutionCode}`}
            sx={{
              width: '100%',
              '&:hover': { backgroundColor: 'transparent !important' },
            }}
          >
            <RemoveCircle sx={{ color: 'error.dark', fontSize: '24px' }} />
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

export function showEcName(params: GridRenderCellParams) {
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
                {params.row.businessName}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

export function showStatus(params: GridRenderCellParams) {
  return renderCell(
    params,
    <Box>
      <Chip
        label={params.row.broadcast ? 'Attivo' : 'Disattivo'}
        aria-label="Status"
        sx={{
          fontSize: '14px',
          fontWeight: 'fontWeightMedium',
          color: params.row.broadcast ? '#FFFFFF' : '#17324D',
          backgroundColor: params.row.broadcast ? 'primary.main' : 'warning.light',
          paddingBottom: '1px',
          height: '24px',
        }}
      />
    </Box>
  );
}
