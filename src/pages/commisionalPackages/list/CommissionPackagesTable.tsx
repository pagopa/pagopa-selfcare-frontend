import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_COMMISSION_PACKAGE_LIST } from '../../../utils/constants';
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
  pageInfo: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const mapBundle = (packageType: string) => {
  switch (packageType) {
    case 'commissionPackagesPage.globalPackages':
      return 'GLOBAL';
    case 'commissionPackagesPage.publicPackages':
      return 'PUBLIC';
    case 'commissionPackagesPage.privatePackages':
      return 'PRIVATE';
    default:
      return '';
  }
};


const CommissionPackagesTable = ({ packageNameFilter, packageType }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  //   const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_PACKAGE_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [listFiltered, setListFiltered] = useState<Bundles>(emptyCommissionPackageList);
  const [page, setPage] = useState(0);
  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
  };

  const pageLimit = 5;
  const getBundleList = () => {
    setLoadingStatus(true);
    getBundleListByPSP(mapBundle(packageType), pageLimit, packageNameFilter, page, `PSP${brokerCode}`)
      .then((res) => {
        if (res?.bundles) {
          const formattedBundles = res?.bundles?.map((el, ind) => ({ ...el, id: `bundle-${ind}` }));
          setListFiltered({ bundles: formattedBundles, pageInfo: res.pageInfo });
        }
      })
      .catch((reason) => setError(reason))
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => {
    if (brokerCode) {
      const identifier = setTimeout(() => {
        getBundleList();
      }, 500);
      return () => {
        clearTimeout(identifier);
      };
    }
    return () => null;
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
        {error ? (
          <>{error}</>
        ) : listFiltered?.bundles?.length === 0 ? (
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
                    count={listFiltered?.pageInfo?.total_pages ?? 1}
                    page={page + 1}
                    onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
                  />
                </>
              ),
            }}
            componentsProps={{
              toolbar: {
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
