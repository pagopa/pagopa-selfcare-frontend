import {Box, IconButton} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {RemoveCircle} from '@mui/icons-material';
import {formatCodeInDoubleDigit} from '../../../utils/common-utils';
import {
    renderCell,
    renderStatusChip,
    showCustomHeader
} from '../../../components/Table/TableUtils';

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
    onRowClick: (ec_code: string) => void
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
            renderCell: (params: any) => renderCell({value: params.row.businessName, mainCell: true}),
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
            renderCell: (params: any) => renderCell({value: params.row.creditorInstitutionCode, mainCell: true}),
            sortable: false,
            flex: 4,
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
            flex: 3,
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
            flex: 3,
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
            flex: 3,
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
                        onClick={onRowClick ? () => onRowClick(p.row.creditorInstitutionCode) : undefined}
                        data-testid={`dissociate-${p.row.creditorInstitutionCode}`}
                        sx={{
                            width: '100%',
                            '&:hover': {backgroundColor: 'transparent !important'},
                        }}
                    >
                        <RemoveCircle sx={{color: 'error.dark', fontSize: '24px'}}/>
                    </IconButton>
                </Box>
            ),
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}
