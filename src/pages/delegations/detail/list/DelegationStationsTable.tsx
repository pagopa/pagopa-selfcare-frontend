import { Box, Pagination } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useLoading } from '@pagopa/selfcare-common-frontend';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CIBrokerStationPage } from '../../../../api/generated/portal/CIBrokerStationPage';
import { CIBrokerStationResource } from '../../../../api/generated/portal/CIBrokerStationResource';
import { CustomDataGrid } from '../../../../components/Table/CustomDataGrid';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { getCIBrokerStations } from '../../../../services/brokerService';
import { LOADING_TASK_CI_DELEGATION_STATIONS_LIST } from '../../../../utils/constants';
import { buildColumnDefs } from './DelegationStationsTableColumns';
import DelegationStationsTableEmpty from './DelegationStationsTableEmpty';


type Props = {
  ciTaxCode: string;
  filterByStationCode: string;
  setDrawerValue: (open: CIBrokerStationResource) => void;
};

const rowHeight = 64;
const headerHeight = 56;
const pageLimit = 5;

const emptyDelegationLStationist: CIBrokerStationPage = {
  ci_broker_stations: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const DelegationStationsTable = ({ ciTaxCode, filterByStationCode, setDrawerValue }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_CI_DELEGATION_STATIONS_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t, setDrawerValue);
  const [delegationStationsList, setDelegationStationsList] = useState<CIBrokerStationPage>(emptyDelegationLStationist);
  const [page, setPage] = useState(0);

  const getDelegationStationsList = () => {
    setLoading(true);
    getCIBrokerStations(
      selectedParty?.fiscalCode ?? '',
      ciTaxCode ?? '',
      filterByStationCode ?? '',
      pageLimit,
      page
    )
      .then((res: CIBrokerStationPage) => {
        if (res?.ci_broker_stations && res.ci_broker_stations.length > 0) {
          setDelegationStationsList(res);
        } else {
          setDelegationStationsList(emptyDelegationLStationist);
        }
      })
      .catch((reason) => setError(reason))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDelegationStationsList();
  }, [page, filterByStationCode]);

  function handleChangePage(value: number) {
    const newPage = value - 1;
    setPage(newPage);
  }
  // TODO generalize table box
  return (
    <Box
      id="delegationStationsTable"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      {error ? (
        <>{error}</>
      ) : !delegationStationsList?.ci_broker_stations ||
        delegationStationsList.ci_broker_stations?.length === 0 ? (
        <DelegationStationsTableEmpty />
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
                  count={delegationStationsList?.page_info?.total_pages ?? 1}
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
            getRowId={(r) => r.station_code}
            headerHeight={headerHeight}
            hideFooterSelectedRowCount={true}
            paginationMode="client"
            rowCount={delegationStationsList?.ci_broker_stations?.length}
            rowHeight={rowHeight}
            rows={delegationStationsList?.ci_broker_stations ?? []}
            sortingMode="client"
            // onSortModelChange={handleSortModelChange}
          />
        </div>
      )}
    </Box>
  );
};

export default DelegationStationsTable;
