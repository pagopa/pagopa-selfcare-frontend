import { theme } from '@pagopa/mui-italia';
import { Box, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { IbansResource } from '../../../api/generated/portal/IbansResource';
import ROUTES from '../../../routes';
import { buildColumnDefs } from './IbanTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import IbanTableEmpty from './IbanTableEmpty';

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

type IbanTableProps = { ibanList: IbansResource; error: boolean; loading: boolean };

export default function IbanTable({ ibanList, error, loading }: IbanTableProps) {
  const { t } = useTranslation();
  const history = useHistory();

  const [_selectedIban, setSelectedIban] = useState<string>('');

  const onRowClick = (ibanRow: string) => {
    setSelectedIban(ibanRow);
    history.push(generatePath(ROUTES.IBAN_DETAIL, { ibanId: ibanRow }));
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
        ) : !error && !loading && ibanList.ibanList.length === 0 ? (
          <IbanTableEmpty />
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
                          <Trans i18nKey="ibanPage.list.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="ibanPage.list.noResults">No results</Trans>
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
                          <Trans i18nKey="ibanPage.list.loading">Loading...</Trans>
                        ) : (
                          <Trans i18nKey="ibanPage.list.noResults">No search results</Trans>
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
              getRowId={(r) => r.ibanValue}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="server"
              rowsPerPageOptions={[3]}
              pageSize={3}
              pagination
              rowHeight={rowHeight}
              rows={ibanList.ibanList ?? []}
              rowCount={ibanList.ibanList.length}
              sortingMode="server"
            />
          </>
        )}
      </Box>
    </>
  );
}
