/* eslint-disable functional/immutable-data */
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_STATION_MAINTENANCES } from '../../../utils/constants';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import { StationMaintenanceState } from '../../../model/StationMaintenance';
import { StationMaintenanceListResource } from '../../../api/generated/portal/StationMaintenanceListResource';
import { buildColumnDefs } from './StationMaintenancesTableColumns';

const emptyList: StationMaintenanceListResource = {
  station_maintenance_list: [],
  page_info: {
    items_found: 0,
    limit: 0,
    page: 0,
    total_pages: 0,
  },
};

const componentPath = 'stationMaintenancesPage.table';
export default function StationMaintenancesTable({
  filterStationCode,
  filterYear,
  filterState,
  searchTrigger,
}: {
  filterStationCode: string;
  filterYear: number | null;
  filterState: StationMaintenanceState;
  searchTrigger: boolean;
}) {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_STATION_MAINTENANCES);
  const [stationMaintenancesList, setStationMaintenancesList] =
    useState<StationMaintenanceListResource>(emptyList);
  const addError = useErrorDispatcher();
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

  const getStationsMaintenances = (newPage?: number) => {
    setLoading(true);
    const toPage = newPage ?? 0;
    new Promise((resolve) => resolve(emptyList)) // TODO get maintenance list API integration
      .then((res: any) => {
        // TODO FIX RES TYPE
        if (res?.station_maintenance_list && res.station_maintenance_list.length > 0) {
          setStationMaintenancesList(res);
        } else {
          setStationMaintenancesList(emptyList);
        }
      })
      .catch((reason) => {
        addError({
          component: 'Toast',
          id: 'GET_STATION_MAINTENANCES',
          displayableTitle: t('general.errorTitle'),
          techDescription: "An error occured retrieving the station's maintenance list",
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: t(`${componentPath}.errorMessageMaintenanceList`),
        });
      })
      .finally(() => {
        setPage(toPage);
        setLoading(false);
      });
  };

  useEffect(() => {
    getStationsMaintenances();
  }, [searchTrigger]);

  const columns: Array<GridColDef> = buildColumnDefs(t, filterState);

  return (
    <Box
      id="stationMaintenancesTable"
      data-testid={'stationMaintenances-table'}
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      <TableDataGrid
        componentPath={"stationMaintenancesPage"}
        translationPathSuffix={filterState === StationMaintenanceState.FINISHED ? StationMaintenanceState.FINISHED : StationMaintenanceState.SCHEDULED}
        linkToRedirect={undefined} // TODO ROUTES TO NEW MAINTENANCE
        rows={
          stationMaintenancesList?.station_maintenance_list
            ? [...stationMaintenancesList.station_maintenance_list]
            : []
        }
        columns={columns}
        totalPages={stationMaintenancesList?.page_info?.total_pages}
        page={page}
        handleChangePage={(newPage: number) => getStationsMaintenances(newPage)}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        getRowId={(el) => el.maintenanceId}
      />
    </Box>
  );
}
