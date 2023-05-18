import { theme } from '@pagopa/mui-italia';
import { Box, Pagination, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { WrapperStationsResource } from '../../../api/generated/portal/WrapperStationsResource';
import { getStationsMerged } from '../../../services/stationService';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { buildColumnDefs } from './StationsTableColumns';
import StationTableEmpty from './StationTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

const emptyStationsResource: WrapperStationsResource = {
  stationsList: [],
  pageInfo: {},
};

const CustomDataGrid = styled(DataGrid)({
  border: 'none !important',
  '& .MuiDataGrid-main': {
    background: `${theme.palette.background.default}`,
    padding: '0 24px 24px 24px',
    marginTop: '24px',
  },
  '& .MuiDataGrid-main > div::first-of-type': {
    zIndex: 1,
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
    { outline: 'none' },
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
    lineHeight: '25px !important',
  },
  '&.MuiDataGrid-columnHeaders': { borderBottom: 'none !important', padding: '24px' },
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

export default function StationsTable({ stationCode }: { stationCode: string }) {
  const { t } = useTranslation();

  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [loading, setLoadingTable] = useState(false);
  const [error, setError] = useState(false);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const [stations, setStations] = useState<WrapperStationsResource>(emptyStationsResource);
  const [page, setPage] = useState(0);
  const [stationCodeSort, setStationCodeSort] = useState('ASC');

  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingTable(status);
  };

  useEffect(() => {
    if (brokerCode) {
      setLoadingStatus(true);
      getStationsMerged(page, brokerCode, stationCode, undefined, stationCodeSort)
        .then((res) => {
          setStations(res);
          setError(false);
        })
        .catch((reason) => {
          addError({
            id: 'RETRIEVE_STATIONS_ERROR',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving stations`,
            toNotify: true,
          });
          setError(true);
          setStations(emptyStationsResource);
        })
        .finally(() => setLoadingStatus(false));
    }
  }, [page, stationCode, brokerCode, stationCodeSort]);

  const handleSortModelChange = (sortModel: GridSortModel) => {
    setStationCodeSort(
      sortModel.find((column) => column.field === 'stationCode')?.sort?.toUpperCase() ?? 'ASC'
    );
  };

  return (
    <React.Fragment>
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
        ) : !error && !loading && stations.stationsList.length === 0 ? (
          <StationTableEmpty />
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
                    count={stations.pageInfo.total_pages ?? 0}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
                  />
                </>
              ),
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
              // eslint-disable-next-line sonarjs/no-identical-functions
              NoResultsOverlay: () => (
                <>
                  <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                    <Typography variant="body2">
                      {loading ? (
                        <Trans i18nKey="stationsPage.loading">Loading...</Trans>
                      ) : (
                        <Trans i18nKey="stationsPage.noResults">No results</Trans>
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
            getRowId={(r) => r.stationCode}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            paginationMode="server"
            rowCount={stations.stationsList.length}
            rowHeight={rowHeight}
            rows={stations.stationsList}
            sortingMode="server"
            onSortModelChange={handleSortModelChange}
          />
        )}
      </Box>
    </React.Fragment>
  );
}
