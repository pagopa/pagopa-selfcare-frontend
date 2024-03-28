import { Typography, Grid, Box } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router';
import { FormAction } from '../../../model/Channel';
import ROUTES from '../../../routes';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import { StatusChip } from '../../../components/StatusChip';
import { StatusEnum } from '../../../api/generated/portal/ChannelDetailsDto';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';

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
      width: 404,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) =>
        renderCell({
          value: params.row.channel_code,
          mainCell: true,
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'createdAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelsPage.channelsTableColumns.headerFields.creationDate'),
      align: 'left',
      headerAlign: 'left',
      width: 404,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.createdAt?.toLocaleDateString('en-GB'),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'modifiedAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelsPage.channelsTableColumns.headerFields.lastEditDate'),
      align: 'left',
      headerAlign: 'left',
      width: 404,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.modifiedAt?.toLocaleDateString('en-GB'),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
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

        if (params.row.wrapperStatus === StatusEnum.APPROVED) {
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

export function showStatus(params: GridRenderCellParams) {
  return renderCell({
    value: (
        <StatusChip status={params.row.wrapperStatus ?? params.row.wrapperStatus} />
    ),
    overrideStyle: {
      textAlign: 'left',
    },
  });
}
