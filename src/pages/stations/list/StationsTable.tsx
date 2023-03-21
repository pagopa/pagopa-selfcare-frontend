import { theme } from '@pagopa/mui-italia';
import { Box, Link, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { StationsResource } from '../../../api/generated/portal/StationsResource';
import ROUTES from '../../../routes';
import { getStations } from '../../../services/stationService';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import { buildColumnDefs } from './StationsTableColumns';
import { CustomStationSearchBar } from './CustomStationSearchBar';
import StationTableEmpty from './StationTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

const emptyStationsResource: StationsResource = {
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

export default function StationsTable() {
  const { t } = useTranslation();

  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [loading, _setLoading] = useState(true);
  const [error, _setError] = useState(false);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const [stations, setStations] = useState<StationsResource>(emptyStationsResource);

  useEffect(() => {
    setLoading(true);
    getStations(0)
      .then((retrievedStations) => {
        console.log('retrievedStations: ', retrievedStations);
        setStations(retrievedStations);
      })
      .catch((reason) =>
        addError({
          id: 'RETRIEVE_STATIONS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving stations`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  }, []);

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
              Pagination: () => <></>,
              Toolbar: () => (
                <>
                  <CustomStationSearchBar />
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
              NoResultsOverlay: () => (
                <>
                  <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                    <Typography variant="body2">
                      <Trans i18next="stationsPage.notFoundStations">
                        Non sono ancora presenti stazioni in ambiente di collaudo.
                        <Link
                          component={RouterLink}
                          sx={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontWeight: '700',
                            color: theme.palette.primary.main,
                            whiteSpace: 'pre',
                          }}
                          to={generatePath(ROUTES.STATION_ADD)}
                        >
                          <strong> Crea stazione</strong>
                        </Link>
                      </Trans>
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
          />
        )}
      </Box>
    </React.Fragment>
  );
}
