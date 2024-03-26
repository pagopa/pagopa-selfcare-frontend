import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { usePermissions } from '../../../hooks/usePermissions';
import { LOADING_TASK_COMMISSION_BUNDLE_LIST } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { BundlesResource } from '../../../api/generated/portal/BundlesResource';
import { getCIBrokerDelegation } from '../../../services/brokerService';
import DelegationsTableEmpty from './DelegationsTableEmpty';
import { buildColumnDefs } from './DelegationsTableColumns';

type Props = {
  filterByName: string;
};

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const emptyCommissionBundleList: BundlesResource = {
  bundles: [],
  pageInfo: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const DelegationsTable = ({ filterByName }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [delegationsList, setDelegationsList] = useState<any>([]);
  const [page, setPage] = useState(0);

  const getDelegationsList = () => {
    setLoading(true);

    getCIBrokerDelegation(
      selectedParty?.fiscalCode ?? '',
      selectedParty?.partyId ?? '',
      filterByName ?? '',
      pageLimit,
      page
    )
      .then((res) => {
        if (res && res.length > 0) {
          setDelegationsList(res);
        } else {
          setDelegationsList([]);
        }
      })
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDelegationsList();
  }, [page]);

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
  }

  return (
    <Box
      id="delegationsTable"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      {error ? (
        <>{error}</>
      ) : delegationsList?.length === 0 ? (
        <DelegationsTableEmpty />
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
                <Pagination
                  color="primary"
                  count={delegationsList?.total_pages ?? 1}
                  page={page + 1}
                  onChange={(_event: ChangeEvent<unknown>, value: number) =>
                    handleChangePage(value)
                  }
                />
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
            rowCount={delegationsList?.length}
            rowHeight={rowHeight}
            rows={delegationsList ?? []}
            sortingMode="client"
            // onSortModelChange={handleSortModelChange}
          />
        </div>
      )}
    </Box>
  );
};

export default DelegationsTable;
