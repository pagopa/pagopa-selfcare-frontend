import { theme } from '@pagopa/mui-italia';
import { Box, Pagination, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { LOADING_TASK_STATION_EC_TABLE } from '../../../utils/constants';
import { dissociateECfromStation, getECListByStationCode } from '../../../services/stationService';
import { CreditorInstitutionsResource } from '../../../api/generated/portal/CreditorInstitutionsResource';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { buildColumnDefs } from './StationECTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import StationECTableEmpty from './StationECTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

const emptyECList: CreditorInstitutionsResource = {
  creditor_institutions: [],
  page_info: {
    page: 0,
    limit: 50,
    items_found: 0,
    total_pages: 0,
  },
};

type StationECTableProps = { setAlertMessage: any };

export default function StationECTable({ setAlertMessage }: StationECTableProps) {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const setLoadingOverlay = useLoading(LOADING_TASK_STATION_EC_TABLE);
  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingOverlay(status);
  };

  const addError = useErrorDispatcher();

  const [ecListPage, setECListPage] = useState<CreditorInstitutionsResource>(emptyECList);
  const [page, setPage] = useState<number>(0);

  const [selectedECCode, setSelectedECCode] = useState<string>('');

  const { stationId } = useParams<{ stationId: string }>();

  const onRowClick = (ecIdRow: string) => {
    setSelectedECCode(ecIdRow);
    setShowConfirmModal(true);
  };
  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);

  const dissociateEC = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      await dissociateECfromStation(selectedECCode, stationId);
      setAlertMessage(t('stationECList.dissociateEcSuccessMessage'));
      fetchStationECs(page);
    } catch (reason) {
      addError({
        id: 'STATION_DELETE_RELATIONSHIP',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while deleting relationship between EC and Station`,
        toNotify: true,
        displayableTitle: t('stationECList.dissociateEcErrorTitle'),
        displayableDescription: t('stationECList.dissociateEcErrorMessage'),
        component: 'Toast',
      });
    } finally {
      setSelectedECCode('');
      setLoading(false);
    }
  };

  const fetchStationECs = (currentPage: number) => {
    setLoadingStatus(true);

    getECListByStationCode(stationId, currentPage)
      .then((r) => (r ? setECListPage(r) : setECListPage(emptyECList)))
      .catch((reason) => {
        handleErrors([
          {
            id: `FETCH_STATIONS_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching stations`,
            toNotify: false,
          },
        ]);
        setError(true);
        setECListPage(emptyECList);
      })
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => fetchStationECs(page), [page]);

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
        ) : !error && !loading && ecListPage.creditor_institutions?.length === 0 ? (
          <StationECTableEmpty stationId={stationId} />
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
                  ecListPage.page_info?.total_pages && ecListPage.page_info?.total_pages > 1 ? (
                    <Pagination
                      color="primary"
                      count={ecListPage.page_info?.total_pages ?? 0}
                      page={page + 1}
                      onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
                    />
                  ) : (
                    <></>
                  ),
                Toolbar: () => (
                  <>
                    <GridToolbarQuickFilter stationId={stationId}></GridToolbarQuickFilter>
                  </>
                ),
                NoRowsOverlay: () => (
                  <>
                    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                      <Typography variant="body2">
                        {loading ? (
                          <Trans i18nKey="stationECList.table.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="stationECList.noResults">No results</Trans>
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
                          <Trans i18nKey="stationECList.table.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="stationECList.noSearchResults">No search results</Trans>
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
              getRowId={(r) => r.creditorInstitutionCode}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="server"
              rowsPerPageOptions={[3]}
              onPageChange={(newPage) => setPage(newPage)}
              pageSize={3}
              pagination
              rowHeight={rowHeight}
              rows={ecListPage.creditor_institutions ?? []}
              rowCount={ecListPage!.page_info!.items_found}
              sortingMode="server"
            />
          </>
        )}
      </Box>
      <SessionModal
        open={showConfirmModal}
        title={t('stationECList.dissociateModal.title')}
        message={
          <Trans i18nKey="stationECList.dissociateModal.message">
            Se dissoci un EC, sarà disattivata la sua connessione al canale.
          </Trans>
        }
        onConfirmLabel={t('stationECList.dissociateModal.confirmButton')}
        onCloseLabel={t('stationECList.dissociateModal.cancelButton')}
        onConfirm={dissociateEC}
        handleClose={() => {
          setShowConfirmModal(false);
        }}
      />
    </>
  );
}
