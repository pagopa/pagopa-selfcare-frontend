import { theme } from '@pagopa/mui-italia';
import { Box, Pagination, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { SessionModal, useLoading } from '@pagopa/selfcare-common-frontend';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { LOADING_TASK_CHANNEL_PSP_TABLE } from '../../../utils/constants';
import { getChannelPSPs } from '../../../services/channelService';
import { ChannelPspListResource } from '../../../api/generated/portal/ChannelPspListResource';
import { buildColumnDefs } from './ChannelPSPTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import ChannelPSPTableEmpty from './ChannelPSPTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

const emptyPSPList: ChannelPspListResource = {
  payment_service_providers: [],
  page_info: {
    page: 0,
    limit: 50,
    items_found: 0,
    total_pages: 0,
  },
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
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const setLoadingOverlay = useLoading(LOADING_TASK_CHANNEL_PSP_TABLE);
  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingOverlay(status);
  };

  const [pspListPage, setPSPListPage] = useState<ChannelPspListResource>(emptyPSPList);
  const [page, setPage] = useState<number>(0);
  const [rowCountState, setRowCountState] = useState(
    pspListPage.page_info?.total_pages && pspListPage.page_info?.items_found
      ? pspListPage.page_info?.total_pages * pspListPage.page_info?.items_found
      : 0
  );

  const { channelId } = useParams<{ channelId: string }>();

  const onRowClick = (_pspIdRow: string) => {
    setShowConfirmModal(true);
  };
  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pspListPage.page_info?.total_pages && pspListPage.page_info?.items_found
        ? pspListPage.page_info?.total_pages * pspListPage.page_info?.items_found
        : prevRowCountState
    );
  }, [pspListPage.page_info?.total_pages, setRowCountState]);

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

  const fetchChannelPSPs = (currentPage: number) => {
    setLoadingStatus(true);

    getChannelPSPs(channelId, currentPage)
      .then((r) => (r ? setPSPListPage(r) : setPSPListPage(emptyPSPList)))
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
        setPSPListPage(emptyPSPList);
      })
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => fetchChannelPSPs(page), [page]);

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
        {error && !loading ? (
          <>{error}</>
        ) : !error && !loading && pspListPage.payment_service_providers?.length === 0 ? (
          <ChannelPSPTableEmpty channelId={channelId} />
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
                Pagination: () =>
                  pspListPage.page_info?.total_pages && pspListPage.page_info?.total_pages > 1 ? (
                    <Pagination
                      color="primary"
                      count={pspListPage.page_info?.total_pages ?? 0}
                      page={page + 1}
                      onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
                    />
                  ) : (
                    <></>
                  ),
                Toolbar: () => (
                  <>
                    <GridToolbarQuickFilter channelId={channelId}></GridToolbarQuickFilter>
                  </>
                ),
                NoRowsOverlay: () => (
                  <>
                    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                      <Typography variant="body2">
                        {loading ? (
                          <Trans i18nKey="channelPSPList.table.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="channelPSPList.noResults">No results</Trans>
                        )}
                      </Typography>
                    </Box>
                  </>
                ),
                NoResultsOverlay: () => (
                  <>
                    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                      <Typography variant="body2">
                        {loading ? (
                          <Trans i18nKey="channelPSPList.table.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="channelPSPList.noSearchResults">No search results</Trans>
                        )}
                      </Typography>
                    </Box>
                  </>
                ),
              }}
              componentsProps={{
                toolbar: {
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              getRowId={(r) => r.psp_code}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="server"
              rowsPerPageOptions={[3]}
              onPageChange={(newPage) => setPage(newPage)}
              pageSize={3}
              pagination
              rowHeight={rowHeight}
              rows={pspListPage.payment_service_providers ?? []}
              rowCount={rowCountState}
              sortingMode="server"
            />
          </>
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
