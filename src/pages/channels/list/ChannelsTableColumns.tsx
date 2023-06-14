import { Typography, Grid, Box } from '@mui/material';
import { GridColDef, GridColumnHeaderParams, GridRenderCellParams } from '@mui/x-data-grid';
import React, { CSSProperties, ReactNode } from 'react';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router';
import { FormAction } from '../../../model/Channel';
import ROUTES from '../../../routes';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import { StatusChip } from '../../../components/StatusChip';

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
      align: 'center',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,

      getActions: (params: any) => {
        const manageChannelAction = (
          <GridLinkAction
            key="Gestisci canale"
            label="Gestisci canale"
            to={generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId: params.row.channel_code })}
            showInMenu={true}
          />
        );
        const editChannelAction = (
          <GridLinkAction
            key="Modifica"
            label="Modifica"
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
              channelId: params.row.channel_code,
              actionId: FormAction.Edit,
            })}
            showInMenu={true}
          />
        );
        const duplicateChannelAction = (
          <GridLinkAction
            key="Duplica"
            label="Duplica"
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
              channelId: params.row.channel_code,
              actionId: FormAction.Duplicate,
            })}
            showInMenu={true}
          />
        );
        const manageChannelPSPAction = (
          <GridLinkAction
            key="Gestisci PSP"
            label="Gestisci PSP"
            to={generatePath(`${ROUTES.CHANNEL_PSP_LIST}`, { channelId: params.row.channel_code })}
            showInMenu={true}
          />
        );

        if (params.row.enabled) {
          return [manageChannelAction, manageChannelPSPAction, duplicateChannelAction];
        } else {
          return [manageChannelAction, editChannelAction];
        }
      },
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
        paddingRight: '16px',
        paddingLeft: '16px',
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
        sx={{ fontWeight: 'fontWeightBold', outline: 'none', paddingLeft: 0 }}
      >
        {params.colDef.headerName}
      </Typography>
    </React.Fragment>
  );
}

export function showChannelCode(params: GridRenderCellParams) {
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

export function showStatus(params: GridRenderCellParams) {
  return renderCell(
    params,
    <Box>
      <StatusChip status={params.row.wrapperStatus ?? params.row.wrapperStatus} size="small" />
    </Box>,
    {
      textAlign: 'left',
    }
  );
}
