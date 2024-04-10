import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import ROUTES from '../../../routes';
import { useAppDispatch } from '../../../redux/hooks';
import { CIBrokerDelegationResource } from '../../../api/generated/portal/CIBrokerDelegationResource';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';

export function buildColumnDefs(t: TFunction<'translation', undefined>) {
  return [
    {
      field: 'companyName',
      cellClassName: 'justifyContentBold',
      headerName: t('delegationsPage.column.companyName'),
      align: 'left',
      headerAlign: 'left',
      minWidth: 400,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.institution_name, mainCell: true }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'taxCode',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.taxCode'),
      align: 'left',
      headerAlign: 'left',
      maxWidth: 250,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: params.row.institution_tax_code }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'cbill',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.cbill'),
      align: 'left',
      headerAlign: 'left',
      width: 150,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: params.row.cbill_code }),
      sortable: true,
      flex: 4,
    },
    {
      field: 'stations',
      cellClassName: 'justifyContentNormal',
      headerName: t('delegationsPage.column.stations'),
      align: 'left',
      headerAlign: 'left',
      width: 100,
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCell({ value: params.row.institution_station_count }),
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
        <GridLinkActionDelegationDetails
          key={`Gestisci intermediario-${params.row.id}`}
          delegation={params.row}
        />,
      ],
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}

export const GridLinkActionDelegationDetails = ({
  delegation,
}: {
  delegation: CIBrokerDelegationResource;
}) => {
  const dispatcher = useAppDispatch();

  return (
    <GridLinkAction
      label="Gestisci intermediario"
      onClick={() => /* TODO ADD ON CLICK DETAILS */ {}}
      to={ROUTES.DELEGATIONS_LIST}
      icon={<ChevronRightIcon color="primary" />}
    />
  );
};
