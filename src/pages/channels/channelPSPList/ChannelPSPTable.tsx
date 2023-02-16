import { theme } from '@pagopa/mui-italia';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import ROUTES from '../../../routes';
import { ChannelsResource } from '../../../api/generated/portal/ChannelsResource';
import { getChannelPSPs } from '../../../services/channelService';
import { buildColumnDefs } from './ChannelPSPTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';

const rowHeight = 64;
const headerHeight = 56;

const emptyChannelsResource = {
  channels: [],
  page_info: { items_found: 0, limit: 0, page: 0, total_pages: 0 },
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

export default function ChannelPSPTable() {
  const { t } = useTranslation();
  const history = useHistory();

  const onRowClick = (channelIdRow: string) => {
    history.push(generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId: channelIdRow }));
  };

  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [channels, setChannels] = useState<ChannelsResource>(emptyChannelsResource);

  const fetchChannelPSPs = () => {
    setLoading(true);

    getChannelPSPs(0)
      .then((r) => {
        // setChannels(emptyChannelsResource);
        setChannels(r);
        setError(false);
      })
      .catch((reason) => {
        console.log('reason', reason);
        handleErrors([
          {
            id: `FETCH_CHANNELS_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching channels`,
            toNotify: false,
          },
        ]);
        setError(true);
        // setChannels(emptyChannelsResource);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => fetchChannelPSPs(), []);

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
          <> Empty message</>
        ) : (
          <CustomDataGrid
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
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
              NoRowsOverlay: () => <>{'NoRowsOverlay'}</>,
              NoResultsOverlay: () => <>{'NoResultsOverlay'}</>,
            }}
            componentsProps={{
              toolbar: {
                quickFilterProps: { debounceMs: 500 },
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
          />
        )}
      </Box>
    </React.Fragment>
  );
}
