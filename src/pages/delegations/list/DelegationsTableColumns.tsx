import {InfoOutlined as InfoOutlinedIcon} from '@mui/icons-material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import {GridColDef} from '@mui/x-data-grid';
import {TFunction} from 'react-i18next';
import {CIBrokerDelegationResource} from '../../../api/generated/portal/CIBrokerDelegationResource';
import GridLinkAction from '../../../components/Table/GridLinkAction';
import {renderCell, showCustomHeader} from '../../../components/Table/TableUtils';
import {useAppDispatch} from '../../../redux/hooks';
import {delegationDetailActions} from '../../../redux/slices/delegationDetailSlice';
import ROUTES from '../../../routes';

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
            renderCell: (params: any) =>
                renderCell({value: params.row.institution_name, mainCell: true}),
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
            renderCell: (params) => renderCell({value: params.row.institution_tax_code}),
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
            renderCell: (params) => renderCell({value: params.row.cbill_code}),
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
            renderCell: (params) => renderCell({value: params.row.institution_station_count}),
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
                    t={t}
                />,
            ],
            sortable: false,
            flex: 1,
        },
    ] as Array<GridColDef>;
}

export const GridLinkActionDelegationDetails = ({
                                                    delegation,
                                                    t,
                                                }: {
    delegation: CIBrokerDelegationResource;
    t: TFunction<'translation', undefined>;
}) => {
    const dispatcher = useAppDispatch();

    return (
        <>
            {delegation.is_institution_signed_in ? (
                <GridLinkAction
                    label="Gestisci intermediario"
                    onClick={() => dispatcher(delegationDetailActions.setDelegationDetailState(delegation))}
                    data-testid='column-go-to-delegation-detail'
                    to={ROUTES.DELEGATIONS_DETAIL}
                    icon={<ChevronRightIcon color="primary"/>}
                />
            ) : (
                <Tooltip title={t('delegationsPage.table.info')} placement="right">
                    <InfoOutlinedIcon fontSize="small" color="primary"/>
                </Tooltip>
            )}
        </>
    );
};
