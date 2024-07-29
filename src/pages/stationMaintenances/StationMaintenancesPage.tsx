import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { Add } from '@mui/icons-material';
import { theme } from '@pagopa/mui-italia';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StationMaintenanceState } from '../../model/StationMaintenance';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../components/Table/TableSearchBar';
import StationMaintenancesTable from './list/StationMaintenancesTable';

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

const componentPath = 'stationMaintenancesPage';
export default function StationMaintenancesPage() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<number>(todaysYear);
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
      setSelectedYear(new Date(newYear).getFullYear());
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
    if ((value === 0 && selectedYear < todaysYear) || (value === 1 && selectedYear > todaysYear)) {
      setSelectedYear(todaysYear);
    }
  };

  const resetFilters = () => {
    if (filterState !== StationMaintenanceState.FINISHED) {
      setFilterState(StationMaintenanceState.SCHEDULED_AND_IN_PROGRESS);
    }
    setSelectedYear(todaysYear);
    setFilterStationCode('');
  };
  return (
    <SideMenuLayout>
      <Stack direction="row" justifyContent="space-between">
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <TitleBox
            title={t(`${componentPath}.title`)}
            subTitle={t(`${componentPath}.subTitle`)}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
        </Stack>
        <Stack display="flex" justifyContent="flex-end" mb={5}>
          <Button
            variant="contained"
            onClick={() => {
              /* TODO ROUTE TO CREATE MAINTENANCE PAGE */
            }}
            endIcon={<Add />}
            color="primary"
            sx={{
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: theme.spacing(0.5),
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t(`${componentPath}.createButton`)}
          </Button>
        </Stack>
      </Stack>

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
            value={selectedYear ? `01/01/${selectedYear}` : null}
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
      <StationMaintenancesTable
        filterStationCode={filterStationCode}
        filterYear={selectedYear}
        filterState={filterState}
        searchTrigger={searchTrigger}
      />
    </SideMenuLayout>
  );
}
