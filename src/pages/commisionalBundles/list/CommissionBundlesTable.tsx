import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_COMMISSION_BUNDLE_LIST } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { Bundles } from '../../../api/generated/portal/Bundles';
import { getBundleListByPSP } from '../../../services/bundleService';
import { buildColumnDefs } from './CommissionBundlesTableColumns';
import CommissionBundlesEmpty from './CommissionBundlesEmpty';

type Props = {
  bundleNameFilter: string;
  bundleType: string;
};

const rowHeight = 64;
const headerHeight = 56;

const emptyCommissionBundleList: Bundles = {
  bundles: [],
  pageInfo: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const mapBundle = (bundleType: string) => {
  switch (bundleType) {
    case 'commissionBundlesPage.globalBundles':
      return 'GLOBAL';
    case 'commissionBundlesPage.publicBundles':
      return 'PUBLIC';
    case 'commissionBundlesPage.privateBundles':
      return 'PRIVATE';
    default:
      return '';
  }
};

const CommissionBundlesTable = ({ bundleNameFilter, bundleType }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  //   const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [listFiltered, setListFiltered] = useState<Bundles>(emptyCommissionBundleList);
  const [page, setPage] = useState(0);
  const brokerCode = selectedParty?.fiscalCode ?? '';
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
  };

  const pageLimit = 5;
  const getBundleList = (newPage?: number) => {
    setLoadingStatus(true);
    if (isFirstRender) {
      setIsFirstRender(false);
    }
    getBundleListByPSP(
      mapBundle(bundleType),
      pageLimit,
      bundleNameFilter,
      newPage ?? page,
      `PSP${brokerCode}`
    )
      .then((res) => {
        if (res?.bundles) {
          const formattedBundles = res?.bundles?.map((el, ind) => ({ ...el, id: `bundle-${ind}` }));
          setListFiltered({ bundles: formattedBundles, pageInfo: res.pageInfo });
        } else {
          setListFiltered([]);
        }
      })
      .catch((reason) => setError(reason))
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => {
    const identifier = setTimeout(
      () => {
        getBundleList();
      },
      isFirstRender ? 0 : 500
    );
    return () => {
      clearTimeout(identifier);
    };
  }, [bundleNameFilter, brokerCode]);

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
    getBundleList(newPage);
  }

  return (
    <Box
      id="commissionBundlesTable"
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
        <CommissionBundlesEmpty bundleType={t(bundleType)} />
      ) : (
        <div data-testid="data-grid">
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
                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                      handleChangePage(value)
                    }
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
        </div>
      )}
    </Box>
  );
};

export default CommissionBundlesTable;
