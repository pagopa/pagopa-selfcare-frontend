/* eslint-disable functional/immutable-data */
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  TextFieldProps,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TableSearchBar from '../../../components/Table/TableSearchBar';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { LOADING_TASK_STATION_MAINTENANCES } from '../../../utils/constants';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import { getStationMaintenances } from '../../../services/stationMaintenancesService';
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

const todaysYear = new Date().getFullYear();

const stateOption = [
  StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS,
  StationMaintenanceState.SCHEDULED,
  StationMaintenanceState.IN_PROGRESS,
];

const baseInputStyle = {
  backgroundColor: '#FFFFFF',
  ml: 1,
  '.MuiOutlinedInput-root': {
    height: '48px',
  },
  '.MuiInputLabel-root': {
    paddingTop: '2px',
  },
};

const componentPath = 'stationMaintenancesPage.table';
export default function StationMaintenancesTable() {
  const { t } = useTranslation();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_STATION_MAINTENANCES);
  const [stationMaintenancesList, setStationMaintenancesList] =
    useState<StationMaintenanceListResource>(emptyList);
  const addError = useErrorDispatcher();
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

  const [filterYear, setFilterYear] = useState<number>(todaysYear);
  const [filterStationCode, setFilterStationCode] = useState<string>('');
  const [filterState, setFilterState] = useState<StationMaintenanceState>(
    StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS
  );
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  const handleSearchTrigger = (stationCode: string) => {
    setFilterStationCode(stationCode);
    setSearchTrigger((prev: boolean) => !prev);
  };

  function handleSetYear(newYear: string | null) {
    if (newYear) {
      setFilterYear(new Date(newYear).getFullYear());
    }
  }

  const tabList = [
    {
      label: t(`${componentPath}.search.tabScheduled`),
      'data-testid': 'scheduled',
      value: StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS,
    },
    {
      label: t(`${componentPath}.search.tabFinished`),
      'data-testid': 'finished',
      value: StationMaintenanceState.FINISHED,
    },
  ];

  const handleTabFilter = (value: number) => {
    setFilterState(
      value === 0
        ? StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS
        : StationMaintenanceState.FINISHED
    );
    setSearchTrigger((prev) => !prev);
    if ((value === 0 && filterYear < todaysYear) || (value === 1 && filterYear > todaysYear)) {
      setFilterYear(todaysYear);
    }
  };

  const resetFilters = () => {
    if (filterState !== StationMaintenanceState.FINISHED) {
      setFilterState(StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS);
    }
    setFilterYear(todaysYear);
    setFilterStationCode('');
    setSearchTrigger((prev) => !prev);
  };

  const getStationsMaintenances = (newPage?: number) => {
    setLoading(true);
    const toPage = newPage ?? 0;
    getStationMaintenances({
      brokerTaxCode: selectedParty?.fiscalCode ?? '',
      stationCode: filterStationCode,
      state: filterState,
      year: filterYear,
      limit: pageLimit,
      page,
    })
      .then((res: StationMaintenanceListResource) => {
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
    <>
      <TableSearchBar
        setExternalSearchInput={setFilterStationCode}
        handleSearchTrigger={handleSearchTrigger}
        componentName={componentPath}
        setActiveTab={handleTabFilter}
        resetFilters={resetFilters}
        activeTab={filterState === StationMaintenanceState.FINISHED ? 1 : 0}
        listTabFilter={tabList}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={t('general.year')}
            views={['year']}
            onChange={(value) => handleSetYear(value)}
            value={filterYear ? `01/01/${filterYear}` : null}
            minDate={
              filterState === StationMaintenanceState.FINISHED
                ? '01/01/2024'
                : `01/01/${todaysYear}`
            }
            maxDate={
              filterState === StationMaintenanceState.FINISHED
                ? `01/01/${todaysYear}`
                : `01/01/${todaysYear + 1}`
            }
            renderInput={(params: TextFieldProps) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: 'aaaa',
                  'data-testid': 'select-year',
                }}
                id="year"
                name="year"
                type="date"
                size="small"
                sx={baseInputStyle}
              />
            )}
          />
        </LocalizationProvider>
        {filterState !== StationMaintenanceState.FINISHED && (
          <FormControl sx={{ ml: 1, minWidth: '200px' }}>
            <InputLabel id="stateSelectLabel">{t(`${componentPath}.search.state`)}</InputLabel>
            <Select
              id={'stateSelect'}
              labelId={'stateSelectLabel'}
              name={`stateSelect`}
              label={t(`${componentPath}.search.state`)}
              size="small"
              value={filterState}
              onChange={(e) => setFilterState(e?.target?.value as StationMaintenanceState)}
              data-testid="page-limit-select"
              sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
            >
              {stateOption.map((option: any) => (
                <MenuItem key={'state-option' + String(option)} value={option}>
                  {t(`${componentPath}.search.select.${option}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </TableSearchBar>
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
          componentPath={'stationMaintenancesPage'}
          translationPathSuffix={
            filterState === StationMaintenanceState.FINISHED
              ? StationMaintenanceState.FINISHED
              : StationMaintenanceState.SCHEDULED
          }
          linkToRedirect={
            filterState === StationMaintenanceState.FINISHED
              ? undefined
              : ROUTES.STATION_MAINTENANCES_LIST
          } // TODO ROUTES TO NEW MAINTENANCE
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
          getRowId={(el) => el.maintenance_id}
        />
      </Box>
    </>
  );
}
