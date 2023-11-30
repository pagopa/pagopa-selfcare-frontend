import { theme } from '@pagopa/mui-italia';
import { Box, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { Ibans } from '../../../api/generated/portal/Ibans';
import ROUTES from '../../../routes';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { buildColumnDefs } from './IbanTableColumns';
import { GridToolbarQuickFilter } from './QuickFilterCustom';
import IbanTableEmpty from './IbanTableEmpty';

const rowHeight = 64;
const headerHeight = 56;

type IbanTableProps = { ibanList: Ibans; error: boolean; loading: boolean };

const IbanTable = ({ ibanList, error, loading }: IbanTableProps) => {
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
        ) : !error && !loading && ibanList.ibans_enhanced.length === 0 ? (
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
              getRowId={(r) => r.iban}
              headerHeight={headerHeight}
              hideFooterSelectedRowCount={true}
              paginationMode="server"
              rowsPerPageOptions={[3]}
              pageSize={3}
              pagination
              rowHeight={rowHeight}
              rows={ibanList.ibans_enhanced ?? []}
              rowCount={ibanList.ibans_enhanced.length}
              sortingMode="server"
            />
          </>
        )}
      </Box>
    </>
  );
};

export default IbanTable;
