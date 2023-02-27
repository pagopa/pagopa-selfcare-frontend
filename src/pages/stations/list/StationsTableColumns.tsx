import { Typography, Grid, Box, Chip } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { StationsMenuOptions } from '../components/StationsMenuOptions';

export function buildColumnDefs(t: TFunction<'translation', undefined>) {
  return [
    {
      field: 'station_id',
      cellClassName: 'justifyContentBold',
      headerName: t('stationsPage.stationsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 485,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => showStationID(params),
      sortable: false,
      flex: 4,
    },
    {
      field: 'creation_date',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.creationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.creationDate, undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'last_edit_date',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.lastEditDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.lastEditDate, undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'activation_date',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.activationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 220,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params.row.activationDate, undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'status',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.status'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
      sortable: false,
      flex: 4,
    },
  ] as Array<GridColDef>;
}

function renderCell(
  params: GridRenderCellParams,
  value: ReactNode = params,
  overrideStyle: CSSProperties = {}
) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingRight: '16px',
        paddingLeft: '16px',
        paddingTop: '-16px',
        paddingBottom: '-16px',
        marginLeft: '11px',
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
          fontSize: '14px',
          variant: 'body2',
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
        sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 5 }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

function showStationID(params: GridRenderCellParams) {
  return (
    <React.Fragment>
      {renderCell(
        params,
        <>
          <Grid container sx={{ width: '100%' }}>
            <Grid item xs={9} sx={{ width: '100%' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 'fontWeightBold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                }}
              >
                {params.row.station_id}
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
    <Box sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
      <Chip
        label={
          params.row.status === 'ACTIVE'
            ? 'Attiva'
            : params.row.status === 'TO_EDIT'
            ? 'Da correggere'
            : 'In revisione'
        }
        aria-label="Status"
        sx={{
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 'fontWeightRegular',
          color: params.row.status === 'ACTIVE' ? '#FFFFFF' : '#17324D',
          backgroundColor:
            params.row.status === 'ACTIVE'
              ? 'primary.main'
              : params.row.status === 'TO_EDIT'
              ? 'warning.light'
              : '#EEEEEE',
          paddingBottom: '1px',
          height: '30px',
          marginY: 2,
          marginLeft: 2,
        }}
      />
      <StationsMenuOptions status={params.row.status} />
    </Box>,
    {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'left',
    }
  );
}
