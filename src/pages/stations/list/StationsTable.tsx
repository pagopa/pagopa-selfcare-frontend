import {Box} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {WrapperStationsResource} from '../../../api/generated/portal/WrapperStationsResource';
import {getStations} from '../../../services/stationService';
import {LOADING_TASK_RETRIEVE_STATIONS} from '../../../utils/constants';
import {useUserRole} from '../../../hooks/useUserRole';
import {ConfigurationStatus} from '../../../model/Station';
import ROUTES from '../../../routes';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import {buildColumnDefs} from './StationsTableColumns';

const emptyStationsResource: WrapperStationsResource = {
    stationsList: [],
    pageInfo: {},
};

const componentPath = 'stationsPage';
export default function StationsTable({
                                          stationCode,
                                          statusFilter,
                                      }: Readonly<{ stationCode: string; statusFilter: ConfigurationStatus }>) {
    const {t} = useTranslation();
    const {userIsPagopaOperator} = useUserRole();
    const columns: Array<GridColDef> = buildColumnDefs(t, userIsPagopaOperator);
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
    const [stations, setStations] = useState<WrapperStationsResource>(emptyStationsResource);

    const [page, setPage] = useState(0);
    const [pageLimit, setPageLimit] = useState<number>(10);

    const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

    function handleGetStations(newPage?: number) {
        if (brokerCode) {
            if (newPage !== undefined) {
                setPage(newPage);
            }
            setLoading(true);
            getStations({
                page: newPage ?? page,
                brokerCode,
                stationCode,
                status: statusFilter,
                limit: pageLimit,
            })
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
    }

  function handleChangePage(newPage: number) {
    handleGetStations(newPage);
  }

    useEffect(() => {
        handleGetStations(0);
    }, [stationCode, brokerCode, statusFilter, pageLimit]);

  return (
    <Box id="StationsSearchTableBox">
      <TableDataGrid
        componentPath={componentPath}
        linkToRedirect={!userIsPagopaOperator ? ROUTES.STATION_ADD : undefined}
        rows={stations?.stationsList ? [...stations.stationsList] : []}
        columns={columns}
        totalPages={stations?.pageInfo?.total_pages}
        page={page}
        handleChangePage={(newPage: number) => handleChangePage(newPage)}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        getRowId={(r) => r.stationCode}
      />
    </Box>
  );
}
