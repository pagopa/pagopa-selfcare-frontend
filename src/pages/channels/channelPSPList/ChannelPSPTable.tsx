import { theme } from '@pagopa/mui-italia';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { SessionModal, useLoading } from '@pagopa/selfcare-common-frontend';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { LOADING_TASK_CHANNEL_PSP_TABLE } from '../../../utils/constants';
import { ChannelsResource } from '../../../api/generated/portal/ChannelsResource';
import { getChannelPSPs } from '../../../services/channelService';
import { buildColumnDefs } from './ChannelPSPTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import ChannelPSPTableEmpty from './ChannelPSPTableEmpty';

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

type ChannelPSPTableProps = { setAlertMessage: any };

export default function ChannelPSPTable({ setAlertMessage }: ChannelPSPTableProps) {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { channelId } = useParams<{ channelId: string }>();

  const onRowClick = (_pspIdRow: string) => {
    setShowConfirmModal(true);
  };

  const dissociatePSP = () => {
    setShowConfirmModal(false);
    // TODO: connect to the services when they are ready
    /*                
    setLoading(true);
    dissociatePSPfromChannel(channelId, selectedPSPCode)
      .then((_r) => {
        // setChannels(emptyChannelsResource);
        setChannels(_r);
      })
      .catch((reason) => {
        console.error('reason', reason);
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
       */

    setAlertMessage(t('channelPSPList.dissociatePSPsuccessMessage'));
  };

  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);
  const setLoading = useLoading(LOADING_TASK_CHANNEL_PSP_TABLE);
  const [error, setError] = useState(false);

  const [channels, setChannels] = useState<ChannelsResource>(emptyChannelsResource);

  const fetchChannelPSPs = () => {
    setLoading(true);

    getChannelPSPs(0)
      .then((_r) => {
        // setChannels(emptyChannelsResource);
        setChannels(_r);
      })
      .catch((reason) => {
        console.error('reason', reason);
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
    <>
      <Box
        id="ChannelsSearchTableBox"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        {error ? (
          <>{error}</>
        ) : channels.channels.length === 0 ? (
          <ChannelPSPTableEmpty channelId={channelId} />
        ) : (
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
                  <GridToolbarQuickFilter channelId={channelId}></GridToolbarQuickFilter>
                </>
              ),
              NoRowsOverlay: () => <>{'NoRowsOverlay'}</>,
              NoResultsOverlay: () => <></>,
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
      <SessionModal
        open={showConfirmModal}
        title={t('channelPSPList.dissociateModal.title')}
        message={
          <Trans i18nKey="channelPSPList.dissociateModal.message">
            Se dissoci un PSP, sarà disattivata la sua connessione al canale.
          </Trans>
        }
        onConfirmLabel={t('channelPSPList.dissociateModal.confirmButton')}
        onCloseLabel={t('channelPSPList.dissociateModal.cancelButton')}
        onConfirm={dissociatePSP}
        handleClose={() => {
          setShowConfirmModal(false);
        }}
      />
    </>
  );
}
