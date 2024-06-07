import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {IconButton} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {CIBrokerStationResource} from '../../../../api/generated/portal/CIBrokerStationResource';
import {renderCell, showCustomHeader} from '../../../../components/Table/TableUtils';

export function buildColumnDefs(
    t: TFunction<'translation', undefined>,
    setDrawerValue: (open: CIBrokerStationResource) => void
) {
    return [
        {
            field: 'stationCode',
            cellClassName: 'justifyContentBold',
            headerName: t('delegationDetailPage.column.stationCode'),
            align: 'left',
            headerAlign: 'left',
            minWidth: 400,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params: any) => renderCell({value: params.row.station_code, mainCell: true}),
            sortable: true,
            flex: 4,
        },
        {
            field: 'auxDigit',
            cellClassName: 'justifyContentNormal',
            headerName: t('delegationDetailPage.column.auxDigit'),
            align: 'left',
            headerAlign: 'left',
            maxWidth: 250,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) => renderCell({value: params.row.aux_digit ?? 3}),
            sortable: true,
            flex: 4,
        },
        {
            field: 'segregationCode',
            cellClassName: 'justifyContentNormal',
            headerName: t('delegationDetailPage.column.segregationCode'),
            align: 'left',
            headerAlign: 'left',
            width: 150,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) => renderCell({value: params.row.segregation_code}),
            sortable: true,
            flex: 4,
        },
        {
            field: 'applicationCode',
            cellClassName: 'justifyContentNormal',
            headerName: t('delegationDetailPage.column.applicationCode'),
            align: 'left',
            headerAlign: 'left',
            width: 100,
            editable: false,
            disableColumnMenu: true,
            renderHeader: showCustomHeader,
            renderCell: (params) => renderCell({value: params.row.application_code}),
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
                <IconButton key={`station-detail-button-${params.row.station_code}`}
                            data-testid='column-station-detail-button' onClick={() => setDrawerValue(params.row)}>
                    <ChevronRightIcon color="primary"/>
                </IconButton>,
            ],
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}
