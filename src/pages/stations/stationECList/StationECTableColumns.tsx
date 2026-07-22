import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { formatBooleanValueToYesOrNo, formatCodeInDoubleDigit } from '../../../utils/common-utils';
import {
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';
import { CreditorInstitutionResource } from '../../../api/generated/portal/CreditorInstitutionResource';
import { getAuxDigit } from '../../../utils/station-utils';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (ec_code: string) => void,
  onLinkClick: (ci: CreditorInstitutionResource) => void
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
          value: getAuxDigit({
            segregationCode: params.row.segregationCode,
            applicationCode: params.row.applicationCode,
            auxDigit: params.row.auxDigit,
          }),
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
      field: 'stand_in',
      cellClassName: 'justifyContentNormal',
      headerName: t('stationECList.stationsTableColumns.headerFields.standIn'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: formatBooleanValueToYesOrNo(params.row.stand_in, t),
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
      getActions: (p: any) => gridLinkActionEdit({ t, ci: p.row, onRowClick, onLinkClick }),
    },
  ] as Array<GridColDef>;
}

export const gridLinkActionEdit = ({
  ci,
  t,
  onRowClick,
  onLinkClick,
}: {
  ci: CreditorInstitutionResource;
  t: TFunction<'translation', undefined>;
  onRowClick: (ec_code: string) => void;
  onLinkClick: (ci: CreditorInstitutionResource) => void;
}) => [
  <GridActionsCellItem
    key="editAction"
    label={t('general.modify')}
    showInMenu
    onClick={() => onLinkClick(ci)}
    data-testid="editAction"
  />,
  <GridActionsCellItem
    label={t('stationECList.stationsTableColumns.headerFields.action')}
    onClick={() => onRowClick(ci.ciTaxCode)}
    key="dissociateAction"
    showInMenu
    sx={{ color: '#D85757' }}
    data-testid="dissociate-action"
  />,
];
