import { theme } from '@pagopa/mui-italia';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildColumnDefs } from './StationsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

const emptyStationsResource = {
  stations: [],
  page_info: { items_found: 0, limit: 0, page: 0, total_pages: 0 },
};

export const mockedStations = {
  stations: [
    {
      creationDate: '01/01/2023',
      lastEditDate: '01/02/2023',
      activationDate: '01/01/2023',
      station_id: '97735020584_01',
      status: 'TO_EDIT',
    },
    {
      creationDate: '01/02/2023',
      lastEditDate: '01/03/2023',
      activationDate: '01/02/2023',
      station_id: '97735020584_02',
      status: 'REVIEW',
    },
    {
      creationDate: '01/03/2023',
      lastEditDate: '01/04/2023',
      activationDate: '01/03/2023',
      station_id: '97735020584_03',
      status: 'ACTIVE',
    },
  ],
  page_info: { items_found: 3, limit: 0, page: 0, total_pages: 0 },
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

  const [stations, setStations] = useState<any>(emptyStationsResource);

  useEffect(() => {
    setStations(mockedStations);
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
        ) : !error && !loading && stations.stations.length === 0 ? (
          <></>
        ) : (
          <CustomDataGrid
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            autoHeight={true}
            className="CustomDataGrid"
            columnBuffer={5}
            columns={columns}
            components={{
              Pagination: () => <></>,
              Toolbar: () => <></>,
            }}
            componentsProps={{
              toolbar: {
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            getRowId={(r) => r.station_id}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            paginationMode="server"
            rowCount={stations.stations.length}
            rowHeight={rowHeight}
            rows={stations.stations}
            sortingMode="server"
          />
        )}
      </Box>
    </React.Fragment>
  );
}
