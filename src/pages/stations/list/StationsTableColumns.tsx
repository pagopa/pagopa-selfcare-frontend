<<<<<<< HEAD
import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {generatePath} from 'react-router-dom';
=======
import { GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { generatePath } from 'react-router-dom';
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
import GridLinkAction from '../../../components/Table/GridLinkAction';
import {FormAction} from '../../../model/Station';
import ROUTES from '../../../routes';
<<<<<<< HEAD
import {StatusEnum} from '../../../api/generated/portal/StationDetailsDto';
import {renderCell, showCustomHeader} from '../../../components/Table/TableUtils';
import {StatusChip} from '../../../components/StatusChip';
=======
import { StatusEnum } from '../../../api/generated/portal/StationDetailsDto';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';
import { StatusChip } from '../../../components/StatusChip';
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))

export function buildColumnDefs(
    t: TFunction<'translation', undefined>,
    userIsPagopaOperator: boolean
) {
    return [
        {
            field: 'stationCode',
            cellClassName: 'justifyContentBold',
            headerName: t('stationsPage.stationsTableColumns.headerFields.name'),
            align: 'left',
            headerAlign: 'left',
            minWidth: userIsPagopaOperator ? 900 : 485,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) => renderCell({value: params.row.stationCode, mainCell: true}),
            sortable: false,
            flex: 4,
        },
        {
            field: 'connectionType',
            cellClassName: 'justifyContentNormal',
            headerName: t('stationsPage.stationsTableColumns.headerFields.connection'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) =>
                renderCell({
                    value: t(
                        `stationsPage.stationsTableColumns.rows.${
                            params.row.isConnectionSync ? 'sync' : 'async'
                        }`
                    ),
                }),
            sortable: false,
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
                renderCell({value: params.row.createdAt?.toLocaleDateString('en-GB')}),
            sortable: false,
            flex: 4,
        },
        ...(userIsPagopaOperator
            ? []
            : [
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
                    renderCell: (params: any) =>
                        renderCell({value: params.row.modifiedAt?.toLocaleDateString('en-GB')}),
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
                    renderCell: (params: any) =>
                        renderCell({value: params.row.activationDate?.toLocaleDateString('en-GB')}),
                    sortable: false,
                    flex: 4,
                },
            ]),
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
            renderCell: (params) => <StatusChip status={params.row.wrapperStatus}/>,
            sortable: false,
            flex: 4,
<<<<<<< HEAD
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

            getActions: (params: any) => getRowActions(params, userIsPagopaOperator),
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}

export const getRowActions = (params: any, userIsPagopaOperator: boolean) => {
    const stationCode = params.row.stationCode;
    if (params.row.wrapperStatus === StatusEnum.APPROVED) {
        if (userIsPagopaOperator) {
            return [manageStationAction(stationCode), manageStationECAction(stationCode)];
        }
        return [
            manageStationAction(stationCode),
            manageStationECAction(stationCode),
            duplicateStationAction(stationCode),
        ];
    } else {
        return [manageStationAction(stationCode), editStationAction(stationCode)];
    }
};

export const manageStationAction = (stationCode: string) => (
    <GridLinkAction
        key="Gestisci stazione"
        label="Gestisci stazione"
        to={generatePath(`${ROUTES.STATION_DETAIL}`, {
            stationId: stationCode,
        })}
        showInMenu={true}
    />
);
export const editStationAction = (stationCode: string) => (
    <GridLinkAction
        key="Modifica"
        label="Modifica"
        to={generatePath(`${ROUTES.STATION_EDIT}`, {
            stationId: stationCode,
            actionId: FormAction.Edit,
        })}
        showInMenu={true}
    />
);
export const duplicateStationAction = (stationCode: string) => (
    <GridLinkAction
        key="Duplica"
        label="Duplica"
        to={generatePath(`${ROUTES.STATION_EDIT}`, {
            stationId: stationCode,
            actionId: FormAction.Duplicate,
        })}
        showInMenu={true}
    />
);
export const manageStationECAction = (stationCode: string) => (
    <GridLinkAction
        key="Gestisci EC"
        label="Gestisci EC"
        to={generatePath(`${ROUTES.STATION_EC_LIST}`, {stationId: stationCode})}
        showInMenu={true}
    />
=======
          },
        ]),
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
      renderCell: (params) => <StatusChip status={params.row.wrapperStatus} />,
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

      getActions: (params: any) => getRowActions(params, userIsPagopaOperator),
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export const getRowActions = (params: any, userIsPagopaOperator: boolean) => {
  const stationCode = params.row.stationCode;
  if (params.row.wrapperStatus === StatusEnum.APPROVED) {
    if (userIsPagopaOperator) {
      return [manageStationAction(stationCode), manageStationECAction(stationCode)];
    }
    return [
      manageStationAction(stationCode),
      manageStationECAction(stationCode),
      duplicateStationAction(stationCode),
    ];
  } else {
    return [manageStationAction(stationCode), editStationAction(stationCode)];
  }
};

export const manageStationAction = (stationCode: string) => (
  <GridLinkAction
    key="Gestisci stazione"
    label="Gestisci stazione"
    to={generatePath(`${ROUTES.STATION_DETAIL}`, {
      stationId: stationCode,
    })}
    showInMenu={true}
  />
);
export const editStationAction = (stationCode: string) => (
  <GridLinkAction
    key="Modifica"
    label="Modifica"
    to={generatePath(`${ROUTES.STATION_EDIT}`, {
      stationId: stationCode,
      actionId: FormAction.Edit,
    })}
    showInMenu={true}
  />
);
export const duplicateStationAction = (stationCode: string) => (
  <GridLinkAction
    key="Duplica"
    label="Duplica"
    to={generatePath(`${ROUTES.STATION_EDIT}`, {
      stationId: stationCode,
      actionId: FormAction.Duplicate,
    })}
    showInMenu={true}
  />
);
export const manageStationECAction = (stationCode: string) => (
  <GridLinkAction
    key="Gestisci EC"
    label="Gestisci EC"
    to={generatePath(`${ROUTES.STATION_EC_LIST}`, { stationId: stationCode })}
    showInMenu={true}
  />
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
);
