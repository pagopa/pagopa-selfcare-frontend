import { Box, Pagination, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import CommissionPackagesEmpty from '../list/CommissionPackagesEmpty';
import { buildColumnDefs } from '../list/CommissionPackagesTableColumns';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { getBundleListByPSP } from '../../../services/bundleService';
import { Bundles } from '../../../api/generated/portal/Bundles';

type Props = {
  packageNameFilter: string;
  packageType: string;
};

const rowHeight = 64;
const headerHeight = 56;

const emptyCommissionPackageList: Bundles = {
  bundles: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const mapBundle = (packageType : string) => {
  switch(packageType) {
    case "commissionPackagesPage.globalPackages":
      return "GLOBAL";
    case"commissionPackagesPage.publicPackages":
      return "PUBLIC";
    case"commissionPackagesPage.privatePackages":
      return "PRIVATE";
    default:
      return "";
  }
};

const CommissionPackagesTable = ({ packageNameFilter, packageType }: Props) => {
  const { t } = useTranslation();

  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [loading, setLoadingTable] = useState(false);
  const [error, setError] = useState(false);
  //   const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);

  const [listFiltered, setListFiltered] = useState<Bundles>(emptyCommissionPackageList);
  const [page, setPage] = useState(0);
  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingTable(status);
  };

  const pageLimit = 5;
  useEffect(() => {
    if (brokerCode) {
      setLoadingStatus(true);
      getBundleListByPSP(mapBundle(packageType), pageLimit, packageNameFilter, page, brokerCode)
        .then((res) => {
            console.log("RSASDSADAS", res);
            setListFiltered(res);
        })
        .catch((reason) => setError(reason))
        .finally(() => setLoadingStatus(false));
    }
  }, [page, brokerCode]);

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
        ) : !error && !loading && listFiltered?.bundles?.length === 0 ? (
          <CommissionPackagesEmpty packageType={t(packageType)} />
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
                    count={listFiltered?.page_info?.total_pages ?? 0}
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
            rowCount={listFiltered?.bundles?.length}
            rowHeight={rowHeight}
            rows={listFiltered?.bundles ?? []}
            sortingMode="client"
            // onSortModelChange={handleSortModelChange}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default CommissionPackagesTable;
