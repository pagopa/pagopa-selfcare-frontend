import { theme } from '@pagopa/mui-italia';
import { Box, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import ROUTES from '../../../routes';
import { TavoloOpResourceList } from '../../../api/generated/portal/TavoloOpResourceList';
import { buildColumnDefs } from './OperationTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import OperationTableEmpty from './OperationTableEmpty';

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

type OperationTableListProps = {
  operationTableList: TavoloOpResourceList;
  error: boolean;
  loading: boolean;
};

const OperationTableList = ({ operationTableList, error, loading }: OperationTableListProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [_selectedOperationTable, setSelectedOperationTable] = useState<string>('');

  const onRowClick = (operationTableRow: string) => {
    setSelectedOperationTable(operationTableRow);
    history.push(
      generatePath(ROUTES.OPERATION_TABLE_DETAILS, { operationTableId: operationTableRow })
    );
  };
  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);

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
        ) : !error && !loading && operationTableList.tavoloOpResourceList.length === 0 ? (
          <OperationTableEmpty />
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
                Pagination: () => <></>,
                Toolbar: () => (
                  <>
                    <GridToolbarQuickFilter></GridToolbarQuickFilter>
                  </>
                ),
                NoRowsOverlay: () => (
                  <>
                    <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                      <Typography variant="body2">
                        {loading ? (
                          <Trans i18nKey="operationTableListPage.list.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="operationTableListPage.list.noResults">No results</Trans>
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
                          <Trans i18nKey="operationTableListPage.list.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="operationTableListPage.list.noResults">
                            No search results
                          </Trans>
                        )}
                      </Typography>
                    </Box>
                  </>
                ),
              }}
              componentsProps={{
                toolbar: {
                  quickFilterProps: { debounceMs: 100 },
                },
              }}
              getRowId={(r) => r.taxCode}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="server"
              rowsPerPageOptions={[3]}
              pageSize={3}
              pagination
              rowHeight={rowHeight}
              rows={operationTableList.tavoloOpResourceList ?? []}
              rowCount={operationTableList.tavoloOpResourceList.length}
              sortingMode="server"
            />
          </>
        )}
      </Box>
    </>
  );
};

export default OperationTableList;
