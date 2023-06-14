import { theme } from '@pagopa/mui-italia';
import { Box, Pagination, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router';
import { generatePath } from 'react-router-dom';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { LOADING_TASK_CHANNELS_LIST } from '../../../utils/constants';
import ROUTES from '../../../routes';
import { getChannelsMerged } from '../../../services/channelService';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { WrapperChannelsResource } from '../../../api/generated/portal/WrapperChannelsResource';
import { useAppSelector } from '../../../redux/hooks';
import { buildColumnDefs } from './ChannelsTableColumns';
import ChannelTableEmpty from './ChannelTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

const emptyChannelsResource: WrapperChannelsResource = {
  channels: [],
  page_info: {},
};

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '& .MuiDataGrid-main': {
    background: `${theme.palette.background.default}`,
    padding: '0 24px 24px 24px',
    marginTop: '24px',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
    { outline: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
  },
  '& .MuiDataGrid-columnHeaders': { borderBottom: 'none !important', padding: '24px' },
  '& .MuiDataGrid-columnHeader': { paddingLeft: '16px', paddingRight: '16px' },
  '.justifyContentBold': {
    fontSize: '16px',
    fontWeight: '600',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.MuiDataGrid-columnSeparator': { display: 'none' },
  '.MuiDataGrid-cell ': { padding: '0px', borderBottom: 'none' },
  '.MuiDataGrid-columnHeaders': { borderBottom: 'none' },
  '.MuiDataGrid-row': {
    backgroundColor: 'white',
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '&:hover': { backgroundColor: 'transparent' },
    },
    '&:hover': {
      backgroundColor: 'rgba(23, 50, 77, 0.04)',
    },
  },
  '.justifyContentNormal': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
    },
  },
  '.justifyContentNormalRight': {
    fontSize: '16px',
    fontWeight: 'normal',
    '&>div': {
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'right',
    },
  },
});

export default function ChannelsTable({ channelCodeFilter }: { channelCodeFilter: string }) {
  const { t } = useTranslation();
  const history = useHistory();

  const partySelected = useAppSelector(partiesSelectors.selectPartySelected);

  const onRowClick = (channelIdRow: string) => {
    history.push(generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId: channelIdRow }));
  };

  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);
  const [loading, setLoading] = useState(false);
  const setLoadingOverlay = useLoading(LOADING_TASK_CHANNELS_LIST);
  const [error, setError] = useState(false);

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingOverlay(status);
  };

  const [channels, setChannels] = useState<WrapperChannelsResource>(emptyChannelsResource);
  const [page, setPage] = useState(0);
  const [channelCodeSort, setChannelCodeSort] = useState<string | undefined>(undefined);

  const brokerCode = typeof partySelected !== 'undefined' ? partySelected.fiscalCode : '';

  useEffect(() => {
    if (brokerCode) {
      setLoadingStatus(true);
      getChannelsMerged(
        page,
        brokerCode,
        '14847241008',
        undefined,
        channelCodeSort ?? channelCodeSort
      )
        .then((r) => {
          setChannels(r);
          setError(false);
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
          setError(true);
          setChannels(emptyChannelsResource);
        })
        .finally(() => setLoadingStatus(false));
    }
  }, [page, channelCodeFilter, brokerCode, channelCodeSort]);

  const handleSortModelChange = (sortModel: GridSortModel) => {
    console.log(sortModel.find((column) => column.field === 'channel_code')?.sort?.toUpperCase());
    setChannelCodeSort(
      sortModel.find((column) => column.field === 'channel_code')?.sort?.toUpperCase()
    );
  };

  return (
    <React.Fragment>
      <Box
        id="ChannelsSearchTableBox"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        {error && !loading ? (
          <>{error}</>
        ) : !error && !loading && channels.channels.length === 0 ? (
          <>
            <ChannelTableEmpty></ChannelTableEmpty>
          </>
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
                <>
                  <Pagination
                    color="primary"
                    count={channels.page_info.total_pages ?? 0}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
                  />
                </>
              ),
              Toolbar: () => <></>,
              NoRowsOverlay: () => (
                <>
                  <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                    <Typography variant="body2">
                      {loading ? (
                        <Trans i18nKey="channelsPage.table.loading">Loading...</Trans>
                      ) : (
                        <Trans i18nKey="channelsPage.table.noResults">No results</Trans>
                      )}
                    </Typography>
                  </Box>
                </>
              ),
              NoResultsOverlay: () => (
                <>
                  <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                    <Typography variant="body2">
                      <Trans i18nKey="channelsPage.table.noResults">Nessun risultato</Trans>
                    </Typography>
                  </Box>
                </>
              ),
            }}
            componentsProps={{
              toolbar: {
                quickFilterProps: { debounceMs: 500 },
              },
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
            rowCount={channels.channels.length}
            rowHeight={rowHeight}
            rows={channels.channels}
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
          />
        )}
      </Box>
    </React.Fragment>
  );
}
