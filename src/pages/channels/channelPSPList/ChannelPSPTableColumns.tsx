import { Box, Chip, IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { TFunction } from 'react-i18next';
import { RemoveCircle } from '@mui/icons-material';
import {
  renderCell,
  renderStatusChip,
  showCustomHeader,
} from '../../../components/Table/TableUtils';

const renderCellWithColor = (params: GridRenderCellParams) =>
  renderCell({
    value: params.value,
    color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
  });

export function buildColumnDefs(
  t: TFunction<'translation', undefined>,
  onRowClick: (psp_tax_code: string) => void
) {
  return [
    {
      field: 'business_name',
      cellClassName: 'justifyContentBold',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.name'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params: any) => renderCell({ value: params.row.business_name, mainCell: true }),
      sortable: false,
      flex: 4,
    },
    {
      field: 'referent',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.referent'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCellWithColor(params),
      sortable: false,
      flex: 3,
    },
    {
      field: 'contact',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.contact'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) => renderCellWithColor(params),
      sortable: false,
      flex: 3,
    },
    {
      field: 'enabled',
      cellClassName: 'justifyContentNormal',
      headerName: t('channelPSPList.channelsTableColumns.headerFields.status'),
      align: 'left',
      headerAlign: 'left',
      editable: false,
      disableColumnMenu: true,
      renderHeader: showCustomHeader,
      renderCell: (params) =>
        renderStatusChip({
          chipLabel: params.row.enabled ? 'Attivo' : 'Disattivo',
          chipColor: params.row.enabled ? 'primary' : 'default',
          cellColor: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
        }),
      sortable: false,
      flex: 2,
    },
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
            onClick={onRowClick ? () => onRowClick(p.row.tax_code) : undefined}
            data-testid={`dissociate-${p.row.tax_code}`}
            sx={{
              width: '100%',
              '&:hover': { backgroundColor: 'transparent !important' },
            }}
          >
            <RemoveCircle sx={{ color: 'error.dark', fontSize: '24px' }} />
          </IconButton>
        </Box>
      ),
      sortable: false,
      flex: 1,
    },
  ] as Array<GridColDef>;
}
