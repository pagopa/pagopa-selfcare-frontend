import { Box, Link, Pagination, Typography } from '@mui/material';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { WrapperStationsResource } from '../../../api/generated/portal/WrapperStationsResource';
import { getStationsMerged } from '../../../services/stationService';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';
import TableEmptyState from '../../../components/Table/TableEmptyState';
import { useUserRole } from '../../../hooks/useUserRole';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CustomDataGrid } from '../../../components/Table/TableDataGrid';
import { buildColumnDefs } from './StationsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

const emptyStationsResource: WrapperStationsResource = {
  stationsList: [],
  pageInfo: {},
};

const componentPath = 'stationsPage';
export default function StationsTable({ stationCode }: Readonly<{ stationCode: string }>) {
  const { t } = useTranslation();
  const { userIsPagopaOperator } = useUserRole();
  const columns: Array<GridColDef> = buildColumnDefs(t);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const [stations, setStations] = useState<WrapperStationsResource>(emptyStationsResource);
  const [page, setPage] = useState(0);
  const [stationCodeSort, setStationCodeSort] = useState('ASC');

  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  useEffect(() => {
    if (brokerCode) {
      setLoading(true);
      getStationsMerged(
        page,
        brokerCode,
        stationCode ? stationCode : undefined,
        undefined,
        stationCodeSort
      )
        .then((res) => {
          setStations(res);
        })
        .catch((reason) => {
          addError({
            id: 'RETRIEVE_STATIONS_ERROR',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while retrieving stations`,
            toNotify: true,
          });
          setStations(emptyStationsResource);
        })
        .finally(() => setLoading(false));
    }
  }, [page, stationCode, brokerCode, stationCodeSort]);

  const handleSortModelChange = (sortModel: GridSortModel) => {
    setStationCodeSort(
      sortModel.find((column) => column.field === 'stationCode')?.sort?.toUpperCase() ?? 'ASC'
    );
  };

  return (
    <Box
      id="StationsSearchTableBox"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      {stations?.stationsList?.length === 0 ? (
        <TableEmptyState
          componentName={componentPath}
          linkToRedirect={!userIsPagopaOperator ? ROUTES.STATION_ADD : undefined}
        />
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
              <Pagination
                color="primary"
                count={stations?.pageInfo?.total_pages ?? 1}
                page={page + 1}
                onChange={(_event: ChangeEvent<unknown>, value: number) => setPage(value - 1)}
              />
            ),
          }}
          getRowId={(r) => r.stationCode}
          headerHeight={headerHeight}
          hideFooterSelectedRowCount={true}
          paginationMode="server"
          rowCount={stations.stationsList.length}
          rowHeight={rowHeight}
          rows={stations.stationsList}
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
        />
      )}
    </Box>
  );
}
