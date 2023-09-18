import { theme } from '@pagopa/mui-italia';
import { Box, Pagination, styled, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import {
  CommissionPackageListResource,
  getCommissionPackagePsp,
} from '../../../services/__mocks__/commissionPackageService';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import CommissionPackagesEmpty from '../list/CommissionPackagesEmpty';
import { buildColumnDefs } from '../list/CommissionPackagesTableColumns';

type Props = {
  packageNameFilter: string;
  packageType: string;
};

const rowHeight = 64;
const headerHeight = 56;

const emptyCommissionPackageList: CommissionPackageListResource = {
  commPackagesList: [],
  pageInfo: {
    items_found: 0,
    limit: 0,
    page: 0,
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

const CommissionPackagesTable = ({ packageNameFilter, packageType }: Props) => {
  const { t } = useTranslation();

  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [loading, setLoadingTable] = useState(false);
  const [error, setError] = useState(false);
  //   const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const [commissionPackagePsp, setCommissionPackagePsp] = useState<CommissionPackageListResource>(
    emptyCommissionPackageList
  );

  const [listFiltered, setListFiltered] = useState<CommissionPackageListResource>(
    emptyCommissionPackageList
  );
  const [page, setPage] = useState(0);
  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingTable(status);
  };

  const filterList = (name: string) => {
    if (name !== '') {
      return commissionPackagePsp.commPackagesList.filter((item) =>
        item.packageName.toUpperCase().includes(name.toUpperCase())
      );
    }
    return commissionPackagePsp.commPackagesList;
  };

  useEffect(() => {
    if (brokerCode) {
      setLoadingStatus(true);
      getCommissionPackagePsp(brokerCode)
        .then((res) => {
          setCommissionPackagePsp(res);
        })
        .catch((reason) => console.error(reason))
        .finally(() => setLoadingStatus(false));
    }
  }, [page, brokerCode]);

  useEffect(() => {
    const filteredList = filterList(packageNameFilter);
    setListFiltered({ ...commissionPackagePsp, commPackagesList: [...filteredList] });
  }, [packageNameFilter, commissionPackagePsp]);

  return (
    <React.Fragment>
      <Box
        id="commissionPackagesTable"
        sx={{
          position: 'relative',
          width: '100% !important',
          border: 'none',
        }}
        justifyContent="start"
      >
        {error && !loading ? (
          <>{error}</>
        ) : !error && !loading && listFiltered.commPackagesList.length === 0 ? (
          <CommissionPackagesEmpty packageType={packageType} />
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
                    count={listFiltered.pageInfo.total_pages ?? 0}
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
            getRowId={(r) => r.packageName}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            paginationMode="client"
            rowCount={listFiltered.commPackagesList.length}
            rowHeight={rowHeight}
            rows={listFiltered.commPackagesList}
            sortingMode="client"
            // onSortModelChange={handleSortModelChange}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default CommissionPackagesTable;
