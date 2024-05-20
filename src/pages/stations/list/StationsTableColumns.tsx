import { Box, Chip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router-dom';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import { FormAction } from '../../../model/Station';
import ROUTES from '../../../routes';
import { StatusEnum } from '../../../api/generated/portal/StationDetailsDto';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';
import { StatusChip } from '../../../components/StatusChip';

export function buildColumnDefs(t: TFunction<'translation', undefined>) {
  return [
    {
      field: 'stationCode',
      cellClassName: 'justifyContentBold',
      headerName: t('stationsPage.stationsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 485,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.stationCode, mainCell: true }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'createdAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.creationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({ value: params.row.createdAt?.toLocaleDateString('en-GB') }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'modifiedAt',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.lastEditDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({ value: params.row.modifiedAt?.toLocaleDateString('en-GB') }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'activationDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.activationDate'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 220,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({ value: params.row.activationDate?.toLocaleDateString('en-GB') }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'wrapperStatus',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationsPage.stationsTableColumns.headerFields.status'),
      align: 'left',
      headerAlign: 'left',
      width: 145,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => (<StatusChip status={params.row.status} />),
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
        const manageStationAction = (
          <GridLinkAction
            key="Gestisci stazione"
            label="Gestisci stazione"
            to={generatePath(`${ROUTES.STATION_DETAIL}`, {
              stationId: params.row.stationCode,
            })}
            showInMenu={true}
          />
        );
        const editStationAction = (
          <GridLinkAction
            key="Modifica"
            label="Modifica"
            to={generatePath(`${ROUTES.STATION_EDIT}`, {
              stationId: params.row.stationCode,
              actionId: FormAction.Edit,
            })}
            showInMenu={true}
          />
        );
        const duplicateStationAction = (
          <GridLinkAction
            key="Duplica"
            label="Duplica"
            to={generatePath(`${ROUTES.STATION_EDIT}`, {
              stationId: params.row.stationCode,
              actionId: FormAction.Duplicate,
            })}
            showInMenu={true}
          />
        );
        const manageStationECAction = (
          <GridLinkAction
            key="Gestisci EC"
            label="Gestisci EC"
            to={generatePath(`${ROUTES.STATION_EC_LIST}`, { stationId: params.row.stationCode })}
            showInMenu={true}
          />
        );

        if (params.row.wrapperStatus === StatusEnum.APPROVED) {
          return [manageStationAction, manageStationECAction, duplicateStationAction];
        } else {
          return [manageStationAction, editStationAction];
        }
      },
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}
