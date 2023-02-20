import { Typography, Grid, Box, Chip } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router';
import ROUTES from '../../../routes';
import GridLinkAction from './GridLinkAction';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  _onRowClick: (channelId: string) => void
) {
  return [
    {
      field: 'channel_code',
      cellClassName: 'justifyContentBold',
      headerName: t('channelsPage.channelsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      width: 403,
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
      headerName: t('channelsPage.channelsTableColumns.headerFields.description'),
      align: 'left',
      headerAlign: 'left',
      width: 404,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell(params, undefined),
      sortable: false,
      flex: 4,
    },
    {
      field: 'enabled',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelsPage.channelsTableColumns.headerFields.status'),
      align: 'left',
      headerAlign: 'left',
      width: 404,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => showStatus(params),
      sortable: false,
      flex: 4,
    },
    {
      field: 'actions',
      cellClassName: 'justifyContentNormalRight',
      type: 'actions',
      headerName: '',
      align: 'left',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      getActions: (params: any) => {
        const manageChannelAction = (
          <GridLinkAction
            key="Gestisci canale"
            label="Gestisci canale"
            to={generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId: params.row.channel_code })}
            onClick={() => console.log(params)}
            showInMenu={true}
          />
        );
        const manageChannelPSPAction = (
          <GridLinkAction
            key="Gestisci PSP"
            label="Gestisci PSP"
            to={generatePath(`${ROUTES.CHANNEL_PSP_LIST}`, { channelId: params.row.channel_code })}
            onClick={() => console.log(params)}
            showInMenu={true}
          />
        );

        if (params.row.enabled) {
          return [
            manageChannelAction,
            manageChannelPSPAction,
            <GridActionsCellItem
              key="duplicate"
              label="Duplica"
              onClick={() => console.log(params)}
              showInMenu={true}
            />,
          ];
        } else {
          return [manageChannelAction];
        }
      },
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
        paddingRight: '24px',
        paddingLeft: '24px',
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
            <Grid item xs={7} sx={{ width: '100%' }}>
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
    </Box>,
    {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'left',
    }
  );
}
