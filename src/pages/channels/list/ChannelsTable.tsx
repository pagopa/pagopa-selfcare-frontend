import {Box, Pagination} from '@mui/material';
import {GridColDef, GridSortModel} from '@mui/x-data-grid';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useLoading} from '@pagopa/selfcare-common-frontend';
import {useHistory} from 'react-router';
import {generatePath} from 'react-router-dom';
import {handleErrors} from '@pagopa/selfcare-common-frontend/services/errorService';
import TableEmptyState from '../../../components/Table/TableEmptyState';
import {useUserRole} from '../../../hooks/useUserRole';
import {LOADING_TASK_CHANNELS_LIST} from '../../../utils/constants';
import ROUTES from '../../../routes';
import {getChannelsMerged} from '../../../services/channelService';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {WrapperChannelsResource} from '../../../api/generated/portal/WrapperChannelsResource';
import {useAppSelector} from '../../../redux/hooks';
import {CustomDataGrid} from '../../../components/Table/TableDataGrid';
import {buildColumnDefs} from './ChannelsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

const emptyChannelsResource: WrapperChannelsResource = {
    channels: [],
    page_info: {},
};
const componentPath = 'channelsPage';
export default function ChannelsTable({channelCodeFilter}: { channelCodeFilter: string }) {
    const {t} = useTranslation();
    const history = useHistory();
    const {userIsPagopaOperator} = useUserRole();
    const partySelected = useAppSelector(partiesSelectors.selectPartySelected);

    const onRowClick = (channelIdRow: string) => {
        history.push(generatePath(`${ROUTES.CHANNEL_DETAIL}`, {channelId: channelIdRow}));
    };

    const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);
    const setLoadingOverlay = useLoading(LOADING_TASK_CHANNELS_LIST);

    const [channels, setChannels] = useState<WrapperChannelsResource>(emptyChannelsResource);
    const [page, setPage] = useState(0);
    const [pagePaginator, setPagePaginator] = useState(0);
    const [channelCodeSort, setChannelCodeSort] = useState<string | undefined>(undefined);

    const brokerCode = typeof partySelected !== 'undefined' ? partySelected.fiscalCode : '';

    useEffect(() => {
        fetchChannels(page);
    }, [page, brokerCode, channelCodeSort]);

    useEffect(() => {
        setPagePaginator(0);
        fetchChannels(0);
    }, [channelCodeFilter]);

    const fetchChannels = (pageParam: number) => {
        if (brokerCode) {
            setLoadingOverlay(true);
            getChannelsMerged(
                pageParam,
                brokerCode,
                channelCodeFilter,
                10,
                channelCodeSort ?? channelCodeSort
            )
                .then((r) => {
                    setChannels(r);
                })
                .catch((reason) => {
                    handleErrors([
                        {
                            id: `FETCH_CHANNELS_ERROR`,
                            blocking: false,
                            error: reason,
                            techDescription: `An error occurred while fetching channels`,
                            toNotify: true,
                        },
                    ]);
                    setChannels(emptyChannelsResource);
                })
                .finally(() => setLoadingOverlay(false));
        }
    };

    const handleSortModelChange = (sortModel: GridSortModel) => {
        setChannelCodeSort(
            sortModel.find((column) => column.field === 'channel_code')?.sort?.toUpperCase()
        );
    };

    return (
        <Box
            id="ChannelsSearchTableBox"
            sx={{
                position: 'relative',
                width: '100% !important',
                border: 'none',
            }}
            justifyContent="start"
        >
            {channels?.channels?.length === 0 ? (
                <TableEmptyState
                    componentName={componentPath}
                    linkToRedirect={!userIsPagopaOperator ? ROUTES.CHANNEL_ADD : undefined}
                />
            ) : (
                <CustomDataGrid
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    disableSelectionOnClick
                    autoHeight={true}
                    className="CustomDataGrid"
                    columnBuffer={5}
                    columns={columns}
                    components={{
                        Pagination: () => (
                            <Pagination
                                color="primary"
                                count={channels?.page_info?.total_pages ?? 1}
                                page={pagePaginator + 1}
                                onChange={(_event: ChangeEvent<unknown>, value: number) => {
                                    setPage(value - 1);
                                    setPagePaginator(value - 1);
                                }}
                            />
                        ),
                    }}
                    componentsProps={{
                        basePopper: {
                            sx: {
                                '& .MuiDataGrid-menuList': {
                                    boxShadow: `0px 0px 45px rgba(0, 0, 0, 0.1)`,
                                },
                            },
                        },
                    }}
                    getRowId={(r) => r.channel_code}
                    headerHeight={headerHeight}
                    hideFooterSelectedRowCount={true}
                    paginationMode="server"
                    rowCount={channels.channels!.length}
                    rowHeight={rowHeight}
                    rows={channels.channels as any}
                    sortingMode="server"
                    onSortModelChange={handleSortModelChange}
                />
            )}
        </Box>
    );
}
