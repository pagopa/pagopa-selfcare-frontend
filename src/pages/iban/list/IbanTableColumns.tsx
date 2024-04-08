import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { ArrowForwardIos } from '@mui/icons-material';
import { renderCell, showCustomHeader } from '../../../components/Table/TableUtils';

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (ec_code: string) => void
) {
  return [
    {
      field: 'iban',
      cellClassName: 'justifyContentBold',
      headerName: t('ibanPage.list.column.ibanCode'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) =>
        renderCell({
          value: params.row.iban,
          mainCell: true,
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'description',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.description'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.description,
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 3,
    },
    {
      field: 'activeDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.activeDate'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.validity_date!.substring(0, 10),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 3,
    },
    {
      field: 'dueDate',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.dueDate'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderCell({
          value: params.row.due_date!.substring(0, 10),
          color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 3,
    },
    /* 
    {
      field: 'enabled',
      cellClassName: 'justifyContentNormal',
      headerName: t('ibanPage.list.column.status'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderStatusChip({
        params, 
        chipLabel:params.row.active ? 'Abilitato' : 'Disabilitato',
         chipColor:params.row.active ? '#FFFFFF' : '#17324D',
         chipBgColor: new Date(params.row.due_date) > new Date() ? 'primary.main' : 'error.light',
         cellColor:  params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined
        }),
      sortable: false,
      flex: 2,
    },
    */
    {
      field: 'actions',
      cellClassName: 'justifyContentNormalRight',
      headerName: '',
      align: 'right',
      hideSortIcons: true,
      disableColumnMenu: true,
      editable: false,
      renderCell: (p) => (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
          mr={2}
          sx={{ cursor: 'pointer' }}
        >
          <IconButton
            onClick={onRowClick ? () => onRowClick(p.row.iban) : undefined}
            data-testid={`open-${p.row.iban}`}
            sx={{
              width: '100%',
              '&:hover': { backgroundColor: 'transparent !important' },
            }}
          >
            <ArrowForwardIos sx={{ color: 'primary.main', fontSize: '24px' }} />
          </IconButton>
        </Box>
      ),
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}
