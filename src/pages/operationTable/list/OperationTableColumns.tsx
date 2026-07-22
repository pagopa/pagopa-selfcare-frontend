import {Box, IconButton} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {ArrowForwardIos} from '@mui/icons-material';
import {renderCell, showCustomHeader} from '../../../components/Table/TableUtils';

export function buildColumnDefs(
    t: TFunction<'translation', undefined>,
    onRowClick: (ec_code: string) => void
) {
    return [
        {
            field: 'name',
            cellClassName: 'justifyContentBold',
            headerName: t('operationTableListPage.column.companyName'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) =>
                renderCell({
                    value: params.row.name,
                    color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
                }),
            sortable: false,
            flex: 4,
        },
        {
            field: 'fiscalCode',
            cellClassName: 'justifyContentNormal',
            headerName: t('operationTableListPage.column.taxCode'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) =>
                renderCell({
                    value: params.row.tax_code,
                    color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
                }),
            sortable: false,
            flex: 3,
        },
        {
            field: 'email',
            cellClassName: 'justifyContentNormal',
            headerName: t('operationTableListPage.column.email'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) =>
                renderCell({
                    value: params.row.email,
                    color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
                }),
            sortable: false,
            flex: 3,
        },
        {
            field: 'telephone',
            cellClassName: 'justifyContentNormal',
            headerName: t('operationTableListPage.column.phone'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) =>
                renderCell({
                    value: params.row.telephone,
                    color: params.row.status === 'SUSPENDED' ? 'text.disabled' : undefined,
                }),
            sortable: false,
            flex: 3,
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
                    sx={{cursor: 'pointer'}}
                >
                    <IconButton
                        onClick={onRowClick ? () => onRowClick(p.row.taxCode) : undefined}
                        data-testid={`open-${p.row.taxCode}`}
                        sx={{
                            width: '100%',
                            '&:hover': {backgroundColor: 'transparent !important'},
                        }}
                    >
                        <ArrowForwardIos sx={{color: 'primary.main', fontSize: '24px'}}/>
                    </IconButton>
                </Box>
            ),
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}
