import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { renderCell, showCustomHeader } from '../../../../../components/Table/TableUtils';
import { SubscriptionStateType } from '../../../../../model/CommissionBundle';
import { getSubscriptionStatusChip } from './CommissionBundleDetailSubscriptionDrawer';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  filterState: SubscriptionStateType,
  setDrawerValue: (bool: boolean) => void,
  componentPath: string
) {
  return [
    {
      field: 'name',
      cellClassName: 'justifyContentBold',
      headerName: t('commissionBundlesPage.commissionBundleDetail.subscriptionsTable.businessName'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 300,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.business_name, mainCell: true }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'taxCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionBundlesPage.commissionBundleDetail.subscriptionsTable.taxCode'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 300,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: t(params.row.creditor_institution_code) }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'state',
      cellClassName: 'justifyContentNormal',
      headerName: t('commissionBundlesPage.commissionBundleDetail.subscriptionsTable.state'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 200,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => getSubscriptionStatusChip(t, filterState,componentPath, params.row.on_removal ),
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
      getActions: (params: any) => [
        <IconButton
          key={`request-detail-button-${params.row.creditor_institution_code}`}
          data-testid="request-detail-button"
          onClick={() => setDrawerValue(params.row)}
        >
          <ChevronRightIcon color="primary" />
        </IconButton>,
      ],
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}
