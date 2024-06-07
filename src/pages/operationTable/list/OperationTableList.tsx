import {Box, Typography} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import {useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {generatePath, useHistory} from 'react-router-dom';
import ROUTES from '../../../routes';
import {TavoloOpResourceList} from '../../../api/generated/portal/TavoloOpResourceList';
import {CustomDataGrid} from '../../../components/Table/TableDataGrid';
import {buildColumnDefs} from './OperationTableColumns';
import {GridToolbarQuickFilter} from './QuickFilterCustom';
import OperationTableEmpty from './OperationTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

type OperationTableListProps = {
    operationTableList: TavoloOpResourceList;
    error: boolean;
    loading: boolean;
};

const OperationTableList = ({operationTableList, error, loading}: OperationTableListProps) => {
    const {t} = useTranslation();
    const history = useHistory();

    const [_selectedOperationTable, setSelectedOperationTable] = useState<string>('');

    const onRowClick = (operationTableRow: string) => {
        setSelectedOperationTable(operationTableRow);
        history.push(
            generatePath(ROUTES.OPERATION_TABLE_DETAILS, {operationTableId: operationTableRow})
        );
    };
    const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);

    return (
        <>
            <Box
                id="StationsSearchTableBox"
                sx={{
                    position: 'relative',
                    width: '100% !important',
                    border: 'none',
                }}
                justifyContent="start"
            >
                {error && !loading ? (
                    <>{error}</>
                ) : !error && !loading && operationTableList.tavoloOpResourceList.length === 0 ? (
                    <OperationTableEmpty/>
                ) : (
                    <>
                        <CustomDataGrid
                            disableColumnFilter
                            disableColumnSelector
                            disableDensitySelector
                            disableSelectionOnClick
                            autoHeight={true}
                            className="CustomDataGrid"
                            columnBuffer={6}
                            columns={columns}
                            components={{
                                Pagination: () => <></>,
                                Toolbar: () => (
                                    <>
                                        <GridToolbarQuickFilter></GridToolbarQuickFilter>
                                    </>
                                ),
                                NoRowsOverlay: () => (
                                    <>
                                        <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
                                            <Typography variant="body2">
                                                {loading ? (
                                                    <Trans
                                                        i18nKey="operationTableListPage.list.loading">Loading...</Trans>
                                                ) : (
                                                    <Trans i18nKey="operationTableListPage.list.noResults">No
                                                        results</Trans>
                                                )}
                                            </Typography>
                                        </Box>
                                    </>
                                ),
                                NoResultsOverlay: () => (
                                    <>
                                        <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
                                            <Typography variant="body2">
                                                {loading ? (
                                                    <Trans
                                                        i18nKey="operationTableListPage.list.loading">Loading...</Trans>
                                                ) : (
                                                    <Trans i18nKey="operationTableListPage.list.noResults">
                                                        No search results
                                                    </Trans>
                                                )}
                                            </Typography>
                                        </Box>
                                    </>
                                ),
                            }}
                            componentsProps={{
                                toolbar: {
                                    quickFilterProps: {debounceMs: 100},
                                },
                            }}
                            getRowId={(r) => r.taxCode}
                            headerHeight={headerHeight}
                            hideFooterSelectedRowCount={true}
                            paginationMode="server"
                            rowsPerPageOptions={[3]}
                            pageSize={3}
                            pagination
                            rowHeight={rowHeight}
                            rows={operationTableList.tavoloOpResourceList ?? []}
                            rowCount={operationTableList.tavoloOpResourceList.length}
                            sortingMode="server"
                        />
                    </>
                )}
            </Box>
        </>
    );
};

export default OperationTableList;
