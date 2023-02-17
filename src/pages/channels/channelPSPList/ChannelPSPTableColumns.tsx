import { Typography, Grid, Box, Chip, IconButton } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { RemoveCircle } from '@mui/icons-material';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (channelId: string) => void
) {
  return [
    {
      field: 'channel_code',
      cellClassName: 'justifyContentBold',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showChannelCode(params),
      sortable: true,
      flex: 4,
    },
    {
      field: 'broker_description',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.referent'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 3,
    },
    {
      field: 'broker_description2',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.contact'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 3,
    },
    {
      field: 'enabled',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.status'),
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
      field: 'azioni',
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
            onClick={onRowClick ? () => onRowClick(p.row.channel_code) : undefined}
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

function renderCell(
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
        cursor: 'pointer',
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

function showCustomHeader(params: GridColumnHeaderParams) {
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

function showChannelCode(params: GridRenderCellParams) {
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
                {params.row.channel_code}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </React.Fragment>
  );
}

function showStatus(params: GridRenderCellParams) {
  return renderCell(
    params,
    <Box sx={{ cursor: 'pointer' }}>
      <Chip
        label={params.row.enabled ? 'Attivo' : 'Disattivo'}
        aria-label="Status"
        sx={{
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'fontWeightMedium',
          color: params.row.enabled ? '#FFFFFF' : '#17324D',
          backgroundColor: params.row.enabled ? 'primary.main' : 'warning.light',
          paddingBottom: '1px',
          height: '24px',
        }}
      />
    </Box>
  );
}
