/* eslint-disable functional/no-let */
import { GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import {
  colorType,
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';
import { formatDateToDDMMYYYY } from '../../../utils/common-utils';
import { StationMaintenanceResource } from '../../../api/generated/portal/StationMaintenanceResource';
import { StationMaintenanceState } from '../../../model/StationMaintenance';

const componentPath = 'stationMaintenancesPage.table.columns';
export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  filterState: StationMaintenanceState
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
            ? formatDateToDDMMYYYY(new Date(params.row.start_date_time))
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
            ? formatDateToDDMMYYYY(new Date(params.row.end_date_time))
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
      getActions: (params: any) => [
        <>TODO</>, // TODO ROWS ACTION
      ],
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

const getStatusChip = (t: TFunction<'translation'>, maintenance: StationMaintenanceResource) => {
  const dateToday = new Date();
  let chipColor: colorType;
  let label: StationMaintenanceState;
  if (maintenance.start_date_time.getTime() < dateToday.getTime()) {
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
