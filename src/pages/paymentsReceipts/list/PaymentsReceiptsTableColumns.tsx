import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {Box, Button} from '@mui/material';
import {renderCell, showCustomHeader} from '../../../components/Table/TableUtils';
import {formatDateToDDMMYYYY} from '../../../utils/common-utils';

export function buildColumnDefs(
    t: TFunction<'translation', undefined>,
    downloadReceipt: (iuv: string) => void
) {
    return [
        {
            field: 'iuv',
            cellClassName: 'justifyContentBold',
            headerName: t('paymentsReceiptsPage.column.iuv'),
            align: 'left',
            headerAlign: 'left',
            minWidth: 400,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) => renderCell({value: params.row.iuv, mainCell: true}),
            sortable: true,
            flex: 4,
        },
        {
            field: 'taxCode',
            cellClassName: 'justifyContentNormal',
            headerName: t('paymentsReceiptsPage.column.taxCode'),
            align: 'left',
            headerAlign: 'left',
            minWidth: 300,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) => renderCell({value: params.row.debtor}),
            sortable: true,
            flex: 4,
        },
        {
            field: 'paymentDateTime',
            cellClassName: 'justifyContentNormal',
            headerName: t('paymentsReceiptsPage.column.paymentDate'),
            align: 'left',
            headerAlign: 'left',
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) => renderCell({value: params.row.paymentDateTime ? formatDateToDDMMYYYY(new Date(params.row.paymentDateTime)) : undefined}),
            sortable: true,
            flex: 4,
        },
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
                <Box key={`DownloadReceipts-${params.row.iuv}`} pr={1}>
                    <Button
                        onClick={() => downloadReceipt(params.row.iuv)}
                        color="primary"
                        variant="contained"
                        data-testid="download-receipt"
                    >
                        {t('paymentsReceiptsPage.column.downloadButton')}
                    </Button>
                </Box>,
            ],
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}
