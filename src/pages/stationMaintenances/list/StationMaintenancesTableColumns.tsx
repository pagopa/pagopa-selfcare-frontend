/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { Cancel, Delete, Edit, Info } from '@mui/icons-material';
import {
  colorType,
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';
import { formatDateToDDMMYYYYhhmm } from '../../../utils/common-utils';
import {
  mapStationMaintenanceState,
  StationMaintenanceActionType,
  StationMaintenanceState,
} from '../../../model/StationMaintenance';
import { StationMaintenanceResource } from '../../../api/generated/portal/StationMaintenanceResource';

const componentPath = 'stationMaintenancesPage.table.columns';
export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  filterState: StationMaintenanceState,
  handleOnRowActionClick: ({
    maintenance,
    routeAction,
  }: {
    maintenance: StationMaintenanceResource;
    routeAction: StationMaintenanceActionType | false;
  }) => void
) {
  return [
    {
      field: 'stationCode',
      cellClassName: 'justifyContentBold',
      headerName: t(`${componentPath}.stationCode`),
      align: 'left',
      headerAlign: 'left',
      minWidth: 400,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.station_code, mainCell: true }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'startDateTime',
      cellClassName: 'justifyContentNormal',
      headerName: t(`${componentPath}.startDateTime`),
      align: 'left',
      headerAlign: 'left',
      minWidth: 300,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.start_date_time
            ? formatDateToDDMMYYYYhhmm(new Date(params.row.start_date_time))
            : undefined,
        }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'endDateTime',
      cellClassName: 'justifyContentNormal',
      headerName: t(`${componentPath}.endDateTime`),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.end_date_time
            ? formatDateToDDMMYYYYhhmm(new Date(params.row.end_date_time))
            : undefined,
        }),
      sortable: false,
      flex: 4,
    },
    ...[
      filterState === StationMaintenanceState.FINISHED
        ? {}
        : {
            field: 'state',
            cellClassName: 'justifyContentNormal',
            headerName: t(`${componentPath}.state`),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) => getStatusChip(t, params.row),
            sortable: false,
            flex: 4,
          },
    ],
    {
      field: 'actions',
      cellClassName: 'justifyContentNormalRight',
      type: 'actions',
      headerName: '',
      align: 'center',
      hideSortIcons: true,
      minWidth: 170,
      disableColumnMenu: true,
      editable: false,
      getActions: (params: any) => getRowActions(t, params.row, handleOnRowActionClick),
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export const getRowActions = (
  t: TFunction<'translation'>,
  maintenance: StationMaintenanceResource,
  handleOnRowActionClick: ({
    maintenance,
    routeAction,
  }: {
    maintenance: StationMaintenanceResource;
    routeAction: StationMaintenanceActionType | false;
  }) => void
) => {
  const baseActions = [
    <GridActionsCellItem
      key="detailAction"
      label={t(`${componentPath}.actions.details`)}
      onClick={() =>
        handleOnRowActionClick({ maintenance, routeAction: StationMaintenanceActionType.DETAILS })
      }
      showInMenu
      icon={<Info sx={{ mr: 1 }} fontSize="small" />}
      data-testid="detail-action"
    />,
  ];

  const maintenanceState = mapStationMaintenanceState(maintenance);

  if (maintenanceState !== StationMaintenanceState.FINISHED) {
    baseActions.push(
      <GridActionsCellItem
        key="editAction"
        label={t(`${componentPath}.actions.edit`)}
        onClick={() =>
          handleOnRowActionClick({ maintenance, routeAction: StationMaintenanceActionType.EDIT })
        }
        showInMenu
        icon={<Edit sx={{ mr: 1 }} fontSize="small" />}
        data-testid="edit-action"
      />
    );
    const actionType =
      maintenanceState === StationMaintenanceState.IN_PROGRESS ? 'terminate' : 'delete';
    baseActions.push(
      <GridActionsCellItem
        key={`${actionType}Action`}
        label={t(`${componentPath}.actions.${actionType}`)}
        onClick={() => handleOnRowActionClick({ maintenance, routeAction: false })}
        showInMenu
        data-testid={`${actionType}-action`}
        sx={{ color: '#D85757' }}
        icon={
          actionType === 'delete' ? (
            <Delete sx={{ mr: 1 }} fontSize="small" color="error" />
          ) : (
            <Cancel sx={{ mr: 1 }} fontSize="small" color="error" />
          )
        }
      />
    );
  }

  return baseActions;
};

export const getStatusChip = (
  t: TFunction<'translation'>,
  maintenance: StationMaintenanceResource
) => {
  let chipColor: colorType;
  let label: StationMaintenanceState;
  if (mapStationMaintenanceState(maintenance) === StationMaintenanceState.IN_PROGRESS) {
    chipColor = 'primary';
    label = StationMaintenanceState.IN_PROGRESS;
  } else {
    chipColor = 'default';
    label = StationMaintenanceState.SCHEDULED;
  }

  return renderStatusChip({
    chipColor,
    chipLabel: t(`${componentPath}.chipStates.${label}`),
    dataTestId: `${chipColor}-state-chip`,
  });
};
