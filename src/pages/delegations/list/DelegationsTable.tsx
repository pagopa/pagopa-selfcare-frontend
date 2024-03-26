import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_CI_DELEGATIONS_LIST } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CustomDataGrid } from '../../../components/Table/CustomDataGrid';
import { CIBrokerDelegationPage } from '../../../api/generated/portal/CIBrokerDelegationPage';
import { getCIBrokerDelegation } from '../../../services/brokerService';
import DelegationsTableEmpty from './DelegationsTableEmpty';
import { buildColumnDefs } from './DelegationsTableColumns';


type Props = {
  filterByName: string;
};

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const emptyDelegationList: CIBrokerDelegationPage = {
  ci_broker_delegations: [],
  page_info: {
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
  const setLoading = useLoading(LOADING_TASK_CI_DELEGATIONS_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t);
  const [delegationsList, setDelegationsList] = useState<any>(emptyDelegationList);
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
      .then((res: CIBrokerDelegationPage) => {
        if (res?.ci_broker_delegations && res.ci_broker_delegations.length > 0) {
          setDelegationsList(res);
        } else {
          setDelegationsList(emptyDelegationList);
        }
      })
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDelegationsList();
  }, [page, filterByName]);

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
  }
  // TODO generalize table box
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
      ) : !delegationsList?.ci_broker_delegation ||
        delegationsList.ci_broker_delegation?.length === 0 ? (
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
            rowCount={delegationsList?.ci_broker_delegation?.length}
            rowHeight={rowHeight}
            rows={delegationsList?.ci_broker_delegation ?? []}
            sortingMode="client"
            // onSortModelChange={handleSortModelChange}
          />
        </div>
      )}
    </Box>
  );
};

export default DelegationsTable;
