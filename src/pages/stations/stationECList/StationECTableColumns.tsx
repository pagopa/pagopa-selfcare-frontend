import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { formatBooleanValueToYesOrNo, formatCodeInDoubleDigit } from '../../../utils/common-utils';
import {
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';
import { useAppDispatch } from '../../../redux/hooks';
import { CreditorInstitutionResource } from '../../../api/generated/portal/CreditorInstitutionResource';

import { stationCIActions } from '../../../redux/slices/stationCISlice';

import ROUTES from '../../../routes';
import { StationECAssociateActionType } from '../../../model/Station';

const getAuxDigit = (station: any) => {
  const hasSegregationCode = station.segregationCode !== undefined;
  const hasApplicationCode = station.applicationCode !== undefined;
  if (hasSegregationCode && !hasApplicationCode) {
    return '3';
  } else if (!hasSegregationCode && hasApplicationCode) {
    return '0';
  } else if (hasSegregationCode && hasApplicationCode) {
    return '0/3';
  } else if (station.auxDigit) {
    return station.auxDigit;
  } else {
    return '-';
  }
};

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (ec_code: string) => void,
  stationId: string
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
      renderCell: (params: any) => renderCell({ value: params.row.businessName, mainCell: true }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'fiscalCode',
      cellClassName: 'justifyContentBold',
      headerName: t('stationECList.stationsTableColumns.headerFields.fiscalCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.ciTaxCode, mainCell: true }),
      sortable: false,
      flex: 3,
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
      renderCell: (params) =>
        renderCell({
          value: getAuxDigit(params.row),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
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
      renderCell: (params) =>
        renderCell({
          value: formatCodeInDoubleDigit(params.row.segregationCode),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
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
      renderCell: (params) =>
        renderCell({
          value: formatCodeInDoubleDigit(params.row.applicationCode),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
    },
    {
      field: 'aca',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.aca'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: formatBooleanValueToYesOrNo(params.row.aca, t),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
    },
    {
      field: 'standIn',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.standIn'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: formatBooleanValueToYesOrNo(params.row.standIn, t),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
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
      renderCell: (params) =>
        renderStatusChip({
          chipLabel: params.row.broadcast ? 'Attivo' : 'Non attivo',
          chipColor: params.row.broadcast ? 'primary' : 'default',
        }),
      sortable: false,
      flex: 2,
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
      sortable: false,
      flex: 1,
      getActions: (p: any) => gridLinkActionEdit({ t, stationId, ci: p.row, onRowClick }),
    },
  ] as Array<GridColDef>;
}

export const gridLinkActionEdit = ({
  ci,
  stationId,
  t,
  onRowClick,
}: {
  ci: CreditorInstitutionResource;
  stationId: string;
  t: TFunction<'translation', undefined>;
  onRowClick: (ec_code: string) => void;
}) => {
  const dispatcher = useAppDispatch();
  const history = useHistory();

  function handleOnClick() {
    dispatcher(stationCIActions.setStationCIState(ci));

    history.push(
      generatePath(ROUTES.STATION_ASSOCIATE_EC, {
        stationId,
        action: StationECAssociateActionType.EDIT,
      })
    );
  }

  return [
    <GridActionsCellItem
      key="editAction"
      label={t('general.modify')}
      showInMenu
      onClick={() => handleOnClick()}
    />,
    <GridActionsCellItem
      label={t('stationECList.stationsTableColumns.headerFields.action')}
      onClick={onRowClick ? () => onRowClick(ci.ciTaxCode) : undefined}
      data-testid={`dissociate-${ci.ciTaxCode}`}
      key="dissociateAction"
      showInMenu
      sx={{ color: '#D85757' }}
    />,
  ];
};
