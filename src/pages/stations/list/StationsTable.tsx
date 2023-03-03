import { theme } from '@pagopa/mui-italia';
import { Box, styled } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StationsResource } from '../../../api/generated/portal/StationsResource';
import { buildColumnDefs } from './StationsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

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

type Props = {
  stations: StationsResource;
};

export default function StationsTable({ stations }: Props) {
  const { t } = useTranslation();

  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [loading, _setLoading] = useState(true);
  const [error, _setError] = useState(false);

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
            getRowId={(r) => r.stationId}
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
