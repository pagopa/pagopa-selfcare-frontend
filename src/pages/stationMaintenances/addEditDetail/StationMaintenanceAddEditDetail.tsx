/* eslint-disable functional/no-let */
import { useEffect, useState } from 'react';
import { add } from 'date-fns';
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { ArrowBack, ArrowOutward } from '@mui/icons-material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GridSearchIcon } from '@mui/x-data-grid';
import { DesktopDatePicker, LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import ROUTES from '../../../routes';
import { StationMaintenanceActionType } from '../../../model/StationMaintenance';
import { datesAreOnSameDay } from '../../../utils/common-utils';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getStations } from '../../../services/stationService';
import { ConfigurationStatus } from '../../../model/Station';
import { WrapperStationResource } from '../../../api/generated/portal/WrapperStationResource';
import { WrapperStationsResource } from '../../../api/generated/portal/WrapperStationsResource';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../../utils/constants';

function mergeDateAndHours(date: string, hours: string) {
  const dateFinal = new Date(date);
  dateFinal.setHours(new Date(hours).getHours());
  dateFinal.setMinutes(new Date(hours).getMinutes());

  return dateFinal;
}

function getHoursDifference({
  hoursFrom,
  dateFrom,
  hoursTo,
  dateTo,
}: {
  hoursFrom: string;
  dateFrom: string;
  hoursTo: string;
  dateTo: string;
}) {
  const from = mergeDateAndHours(dateFrom, hoursFrom);
  const to = mergeDateAndHours(dateTo, hoursTo);

  const hours = ((to.getTime() - from.getTime()) / (1000 * 60 * 60)).toString();
  const decimalIndex = hours.indexOf('.');

  let hoursString;
  let minutesString;
  if (decimalIndex > 0) {
    hoursString = hours.substring(0, decimalIndex);
    minutesString = Number('0.' + hours.substring(decimalIndex + 1, decimalIndex + 3)) * 60;
  } else {
    hoursString = hours;
  }

  if (!hoursString || Number(hoursString) < 0) {
    return undefined;
  }
  return `${hoursString}:${minutesString ?? '00'}`;
}

enum SetDateType {
  HOURS_FROM,
  HOURS_TO,
  DATE_FROM,
  DATE_TO,
}

const componentPath = 'stationMaintenanceAddEditDetail';
// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export function StationMaintenanceAddEditDetail() {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { maintenanceId, action } = useParams<{
    maintenanceId: string;
    action: StationMaintenanceActionType;
  }>();

  const [stationCodeFilter, setStationCodeFilter] = useState<string | undefined>();
  const [stationList, setStationList] = useState<Array<WrapperStationResource>>([]);
  const [totalHours, setTotalHours] = useState<string | undefined>();

  const [hoursFrom, setHoursFrom] = useState<string | null>(null);
  const [hoursTo, setHoursTo] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string | null>(
    add(new Date(), { days: 3 }).toDateString()
  );
  const [dateTo, setDateTo] = useState<string | null>(add(new Date(), { days: 3 }).toDateString());
  const [standIn, setStandIn] = useState<boolean>(true);
  const [selectedStation, setSelectedStation] = useState<WrapperStationResource>();

  function handleSetDate(value: string | null, setDateType: SetDateType) {
    if (setDateType === SetDateType.DATE_FROM) {
      setDateFrom(value);
    } else if (setDateType === SetDateType.DATE_TO) {
      setDateTo(value);
    } else if (setDateType === SetDateType.HOURS_FROM) {
      setHoursFrom(value);
    } else if (setDateType === SetDateType.HOURS_TO) {
      setHoursTo(value);
    }
    calculateTotalHours(value, setDateType);
  }

  function calculateTotalHours(value: string | null, setDateType: SetDateType) {
    // eslint-disable-next-line functional/no-let
    let total;

    if (value) {
      if (setDateType === SetDateType.DATE_FROM && dateTo && hoursTo && hoursFrom) {
        total = getHoursDifference({ dateFrom: value, hoursFrom, dateTo, hoursTo });
      } else if (setDateType === SetDateType.DATE_TO && dateFrom && hoursTo && hoursFrom) {
        total = getHoursDifference({ dateFrom, hoursFrom, dateTo: value, hoursTo });
      } else if (setDateType === SetDateType.HOURS_FROM && dateTo && hoursTo && dateFrom) {
        total = getHoursDifference({ dateFrom, hoursFrom: value, dateTo, hoursTo });
      } else if (setDateType === SetDateType.HOURS_TO && dateTo && dateFrom && hoursFrom) {
        total = getHoursDifference({ dateFrom, hoursFrom, dateTo, hoursTo: value });
      }
    }
    setTotalHours(total);
  }

  function handleGetStations() {
    setLoading(true);
    getStations({
      page: 0,
      brokerCode: selectedParty?.fiscalCode ?? '',
      stationCode: stationCodeFilter,
      status: ConfigurationStatus.ACTIVE,
      limit: 25,
    })
      .then((res: WrapperStationsResource) => {
        if (res?.stationsList && res?.stationsList.length > 0) {
          setStationList([...res.stationsList]);
        } else {
          setStationList([]);
        }
      })
      .catch((reason) => {
        addError({
          id: 'RETRIEVE_STATIONS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving stations`,
          toNotify: true,
        });
        setStationList([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    handleGetStations();
  }, [stationCodeFilter]);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Box display="flex" alignItems="center">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => history.push(ROUTES.STATION_MAINTENANCES_LIST)}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px', fontSize: '16px', fontWeight: 'bold' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t(`${componentPath}.breadcrumb.title`)}</Typography>
            <Typography color={'text.disabled'}>
              {t(`${componentPath}.breadcrumb.${action}`)}
            </Typography>
          </Breadcrumbs>
        </Box>

        <TitleBox
          title={t(`${componentPath}.title.${action}`)}
          subTitle={t(`${componentPath}.subtitle.${action}`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={2}
          variantTitle="h4"
          variantSubTitle="body1"
        />

        {action === StationMaintenanceActionType.CREATE && (
          <Alert severity="info">
            <Box display="flex" alignItems="center">
              <Typography variant="body1" width="85%">
                {t(`${componentPath}.alert`)}
              </Typography>
              <Link
                target="_blank"
                href="https://developer.pagopa.it/pago-pa/guides/sanp/appendici/indicatori-di-qualita-per-i-soggetti-aderenti/livelli-di-servizio-enti-creditori"
                rel="noreferrer"
                sx={{ width: '15%', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none' }}
              >
                <Box display="flex" alignItems="center" justifyContent="center">
                  <ArrowOutward />
                  {t(`general.discoverMore`)}
                </Box>
              </Link>
            </Box>
          </Alert>
        )}

        <Paper
          elevation={5}
          sx={{
            mt: 2,
            borderRadius: 1,
            p: 4,
          }}
        >
          <Grid container item spacing={2}>
            <Grid item xs={12} mb={2}>
              <Typography variant="h5" mb={1}>
                {t(`${componentPath}.configuration.title`)}
              </Typography>
              <Typography variant="body1" mb={4}>
                {t(`${componentPath}.configuration.subtitle`)}
              </Typography>
              <Autocomplete
                noOptionsText={t('general.noOptions')}
                loadingText={t('general.loading')}
                id="station-selection"
                data-testid="station-selection"
                disabled={stationList.length === 0}
                value={selectedStation}
                onChange={(event, newSelectedStation: any | null) => {
                  // TODO TYPE
                  setSelectedStation(newSelectedStation ?? undefined);
                }}
                onInputChange={(event: any) => setStationCodeFilter(event?.target.value ?? '')}
                options={stationList}
                getOptionLabel={(optionStation: WrapperStationResource) =>
                  optionStation?.stationCode ?? ''
                }
                sx={{ width: '50%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(`${componentPath}.search`)}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <GridSearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} mb={2}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {t(`${componentPath}.configuration.hoursSection.title`)}
                  </Typography>
                  <Typography variant="body2" mb={2} fontWeight="light">
                    {t(`${componentPath}.configuration.hoursSection.subtitle`)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    height: 'fit-content',
                  }}
                  display="flex"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    {t(`${componentPath}.configuration.hoursSection.totalHours`)}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" ml={3}>
                    {totalHours ?? '-'}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" width="50%" mb={2} justifyContent="space-between">
                <HoursInput
                  label={t(`${componentPath}.configuration.hoursSection.fromHours`)}
                  hours={hoursFrom}
                  setHours={(value) => handleSetDate(value, SetDateType.HOURS_FROM)}
                />
                <DatePicker
                  date={dateFrom}
                  setDate={(value) => handleSetDate(value, SetDateType.DATE_FROM)}
                />
              </Box>
              <Box display="flex" width="50%" justifyContent="space-between">
                <HoursInput
                  label={t(`${componentPath}.configuration.hoursSection.toHours`)}
                  hours={hoursTo}
                  minTime={
                    dateTo && dateFrom && datesAreOnSameDay(new Date(dateFrom), new Date(dateTo))
                      ? hoursTo
                      : undefined
                  }
                  setHours={(value) => handleSetDate(value, SetDateType.HOURS_TO)}
                />
                <DatePicker
                  date={dateTo}
                  setDate={(value) => handleSetDate(value, SetDateType.DATE_TO)}
                  minDate={dateFrom}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="medium">
                {t(`${componentPath}.configuration.standInSection.title`)}
              </Typography>
              <Typography variant="body2" mb={2}>
                {t(`${componentPath}.configuration.standInSection.subtitle`)}
              </Typography>
              <FormControl>
                <RadioGroup
                  name="standIn"
                  onChange={(e) => setStandIn(e.target.value === 'true' ? true : false)}
                  data-testid="standIn-test"
                  value={`${standIn}`}
                >
                  <FormControlLabel
                    value={'true'}
                    control={<Radio sx={{ ml: 1 }} />}
                    label={t('general.yes')}
                    sx={{ pr: 8 }}
                  />
                  <FormControlLabel
                    value={'false'}
                    control={<Radio sx={{ ml: 1 }} />}
                    label={t('general.no')}
                    sx={{ pr: 8 }}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.push(ROUTES.STATION_MAINTENANCES_LIST)}
            data-testid="back-button-test"
          >
            {t('general.back')}
          </Button>
          <Button
            onClick={() => {
              /* TODO confirm */
            }}
            disabled={!dateFrom || !dateTo || !hoursFrom || !hoursTo || !selectedStation}
            color="primary"
            variant="contained"
            type="submit"
            data-testid="open-modal-button-test"
          >
            {t('general.confirm')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

const HoursInput = ({
  label,
  hours,
  setHours,
  minTime,
}: {
  label: string;
  hours: string | null;
  setHours: (value: string | null) => void;
  minTime?: string | null;
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopTimePicker
      label={label}
      views={['hours', 'minutes']}
      onChange={(value) => setHours(value)}
      value={hours}
      ampm={false}
      minutesStep={15}
      minTime={minTime}
      renderInput={(params: TextFieldProps) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            placeholder: '00:00',
            'data-testid': 'select-hours',
          }}
          id="hours"
          name="hours"
          type="time"
          size="small"
        />
      )}
    />
  </LocalizationProvider>
);

const DatePicker = ({
  date,
  setDate,
  minDate,
}: {
  date: string | null;
  setDate: (value: string | null) => void;
  minDate?: string | null;
}) => {
  const { t } = useTranslation();
  const defaultDate = add(new Date(), { days: 3 });
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={t(`${componentPath}.configuration.hoursSection.ofDay`)}
        inputFormat="dd/MM/yyyy"
        value={date ? new Date(date).toString() : null}
        onChange={(value) => setDate(value)}
        minDate={minDate ? minDate : defaultDate.toDateString()}
        maxDate={add(new Date(), { months: 6 }).toDateString()}
        renderInput={(params: TextFieldProps) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              placeholder: 'dd/MM/aaaa',
              'data-testid': 'date-test',
            }}
            id="date"
            name="date"
            type="date"
            size="small"
          />
        )}
      />
    </LocalizationProvider>
  );
};
