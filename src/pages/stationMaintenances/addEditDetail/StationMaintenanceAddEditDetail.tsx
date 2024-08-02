/* eslint-disable functional/no-let */
import { useEffect, useState } from 'react';
import { add } from 'date-fns';
import {
  Alert,
  AlertColor,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
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
import {
  mapStationMaintenanceState,
  StationMaintenanceActionType,
  StationMaintenanceState,
} from '../../../model/StationMaintenance';
import { datesAreOnSameDay, removeDateZoneInfoGMT2 } from '../../../utils/common-utils';
import { useAppSelector, useAppSelectorWithRedirect } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getStations } from '../../../services/stationService';
import { ConfigurationStatus } from '../../../model/Station';
import { WrapperStationResource } from '../../../api/generated/portal/WrapperStationResource';
import { WrapperStationsResource } from '../../../api/generated/portal/WrapperStationsResource';
import {
  LOADING_TASK_RETRIEVE_STATIONS,
  LOADING_TASK_STATION_MAINTENANCES_ACTION,
} from '../../../utils/constants';
import {
  createStationMaintenance,
  updateStationMaintenance,
} from '../../../services/stationMaintenancesService';
import { CreateStationMaintenance } from '../../../api/generated/portal/CreateStationMaintenance';
import {
  StationMaintenanceReduxState,
  stationMaintenanceSelectors,
} from '../../../redux/slices/stationMaintenancesSlice';
import { extractProblemJson } from '../../../utils/client-utils';

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

  return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
}

function getHoursDifferenceFormatted({
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
  const hours = getHoursDifference({
    hoursFrom,
    dateFrom,
    hoursTo,
    dateTo,
  }).toString();
  const decimalIndex = hours.indexOf('.');

  let hoursString;
  let minutesString;
  if (decimalIndex >= 0) {
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

const alertTypes = {
  info: {
    severity: 'info',
    description: `${componentPath}.alert.info`,
  },
  warning: {
    severity: 'warning',
    description: `${componentPath}.alert.warning`,
  },
};

const minDateFromToday = add(new Date(), { days: 3 }).toString();
// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export default function StationMaintenanceAddEditDetail() {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_RETRIEVE_STATIONS);
  const setLoadingAction = useLoading(LOADING_TASK_STATION_MAINTENANCES_ACTION);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { maintenanceId, action } = useParams<{
    maintenanceId: string;
    action: StationMaintenanceActionType;
  }>();
  const isInProgress = action === StationMaintenanceActionType.EDIT_IN_PROGRESS;
  const isEdit = isInProgress || action === StationMaintenanceActionType.EDIT_SCHEDULED;
  const isDetail = action === StationMaintenanceActionType.DETAILS;
  const selectedMaintenanceState: StationMaintenanceReduxState =
    useAppSelectorWithRedirect({
      selector: stationMaintenanceSelectors.selectStationMaintenanceState,
      routeToRedirect: isEdit ? ROUTES.STATION_MAINTENANCES_LIST : undefined,
    }) ?? {};

  const [alert, setAlert] = useState(
    action === StationMaintenanceActionType.CREATE ? alertTypes.info : undefined
  );

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

  const [errorDate, setErrorDate] = useState<string | undefined>();

  function handleSetDate(value: string | null, setDateType: SetDateType) {
    setErrorDate(undefined);
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

  // eslint-disable-next-line complexity
  function calculateTotalHours(value: string | null, setDateType: SetDateType) {
    // eslint-disable-next-line functional/no-let
    let total;

    let tempHoursFrom = hoursFrom;
    let tempHoursTo = hoursTo;
    let tempDateFrom = dateFrom;
    let tempDateTo = dateTo;
    if (value) {
      if (setDateType === SetDateType.DATE_FROM && dateTo && hoursTo && hoursFrom) {
        total = getHoursDifferenceFormatted({ dateFrom: value, hoursFrom, dateTo, hoursTo });
        tempDateFrom = value;
      } else if (setDateType === SetDateType.DATE_TO && dateFrom && hoursTo && hoursFrom) {
        total = getHoursDifferenceFormatted({ dateFrom, hoursFrom, dateTo: value, hoursTo });
        tempDateTo = value;
      } else if (setDateType === SetDateType.HOURS_FROM && dateTo && hoursTo && dateFrom) {
        total = getHoursDifferenceFormatted({ dateFrom, hoursFrom: value, dateTo, hoursTo });
        tempHoursFrom = value;
      } else if (setDateType === SetDateType.HOURS_TO && dateTo && dateFrom && hoursFrom) {
        total = getHoursDifferenceFormatted({ dateFrom, hoursFrom, dateTo, hoursTo: value });
        tempHoursTo = value;
      }
    }
    setTotalHours(total);
    if (tempHoursFrom && tempHoursTo && tempDateTo && tempDateFrom) {
      handleRemainingHoursAlert(tempHoursFrom, tempHoursTo, tempDateTo, tempDateFrom);
    }
  }

  function handleRemainingHoursAlert(
    hoursFrom: string,
    hoursTo: string,
    dateTo: string,
    dateFrom: string
  ) {
    const difference = getHoursDifference({
      hoursFrom,
      hoursTo,
      dateFrom,
      dateTo,
    });
    const remainingHours = selectedMaintenanceState?.hoursRemaining;
    if (remainingHours !== undefined && difference !== undefined && remainingHours < difference) {
      setAlert(alertTypes.warning);
      setStandIn(true);
    } else if (action === StationMaintenanceActionType.CREATE) {
      setAlert(alertTypes.info);
    } else {
      setAlert(undefined);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function handleConfirmAction() {
    if (dateTo && hoursTo && dateFrom && hoursFrom && selectedStation) {
      if (getHoursDifference({ hoursFrom, hoursTo, dateFrom, dateTo }) <= 0) {
        setErrorDate(t(`${componentPath}.configuration.hoursSection.error`));
        return;
      } else {
        setErrorDate(undefined);
      }
      let promise;
      const body: CreateStationMaintenance = {
        end_date_time: removeDateZoneInfoGMT2(mergeDateAndHours(dateTo, hoursTo))!,
        stand_in: standIn,
        start_date_time: removeDateZoneInfoGMT2(mergeDateAndHours(dateFrom, hoursFrom))!,
        station_code: selectedStation?.stationCode ?? '',
      };
      if (action === StationMaintenanceActionType.CREATE) {
        promise = createStationMaintenance({
          brokerTaxCode: selectedParty?.fiscalCode ?? '',
          createStationMaintenance: body,
        });
      } else if (isEdit) {
        promise = updateStationMaintenance({
          brokerTaxCode: selectedParty?.fiscalCode ?? '',
          maintenanceId: Number(maintenanceId),
          createStationMaintenance: body,
        });
      }

      if (promise) {
        setLoadingAction(true);
        promise
          .then(() => {
            history.push(ROUTES.STATION_MAINTENANCES_LIST, {
              alertSuccessMessage: t(
                `${componentPath}.success${isEdit ? 'Update' : 'Create'}`
              ),
            });
          })
          .catch((reason) => {
            const problem = extractProblemJson(reason);
            let errorDesc = t(`${componentPath}.configuration.hoursSection.errorGeneric`);

            if (problem?.response?.status === 502 && problem?.status !== 409) {
              setErrorDate(t(`${componentPath}.configuration.hoursSection.errorMinDate`));
            } else {
              if (problem?.status === 409) {
                errorDesc = t(`${componentPath}.configuration.hoursSection.errorConflict`);
              }
              addError({
                id: 'ACTION_ON_MAINTENANCE_ERROR',
                blocking: false,
                error: reason,
                techDescription: `An error occurred while creating or updating the maintenance`,
                toNotify: true,
                displayableDescription: errorDesc,
                component: 'Toast',
              });
            }
          })
          .finally(() => setLoadingAction(false));
      }
    }
  }

  function handleGetStations(newStationCodeFilter?: string) {
    if (newStationCodeFilter !== undefined) {
      setStationCodeFilter(newStationCodeFilter);
    } else {
      setLoading(true);
    }
    getStations({
      page: 0,
      brokerCode: selectedParty?.fiscalCode ?? '',
      stationCode: newStationCodeFilter ?? stationCodeFilter,
      status: ConfigurationStatus.ACTIVE,
      limit: 25,
    })
      .then((res: WrapperStationsResource) => {
        const resList = res?.stationsList;
        if (resList && resList.length > 0) {
          setStationList([...res.stationsList]);
        } else {
          setStationList([]);
        }
        if (selectedMaintenanceState) {
          initFromReduxState([...resList]);
        }
      })
      .catch((reason) => {
        addError({
          id: 'RETRIEVE_STATIONS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving stations`,
          toNotify: true,
          displayableDescription: t(`${componentPath}.configuration.errorGetStations`),
          component: 'Toast',
        });
        setStationList([]);
      })
      .finally(() => setLoading(false));
  }

  function initFromReduxState(stationList: Array<WrapperStationResource>) {
    const initStationCode = selectedMaintenanceState?.stationMaintenance?.station_code;
    if (initStationCode) {
      setSelectedStation(stationList.find((el) => el.stationCode === initStationCode));
    }
    const initStartDate = selectedMaintenanceState?.stationMaintenance?.start_date_time;
    const initEndDate = selectedMaintenanceState?.stationMaintenance?.end_date_time;

    let tempDateFrom;
    let tempDateTo;
    if (initStartDate) {
      tempDateFrom = initStartDate.toString();
      setDateFrom(tempDateFrom);
      setHoursFrom(tempDateFrom);
    }
    if (initEndDate) {
      tempDateTo = initEndDate.toString();
      setDateTo(tempDateTo);
      setHoursTo(tempDateTo);
    }
    if (tempDateFrom && tempDateTo) {
      setTotalHours(
        getHoursDifferenceFormatted({
          dateFrom: tempDateFrom,
          hoursFrom: tempDateFrom,
          dateTo: tempDateTo,
          hoursTo: tempDateTo,
        })
      );
    }
    const initStandIn = selectedMaintenanceState?.stationMaintenance?.stand_in;
    if (initStandIn) {
      setStandIn(initStandIn);
    }
    const initHoursRemaining = selectedMaintenanceState?.hoursRemaining;
    if (initHoursRemaining !== undefined && initHoursRemaining <= 0 && isEdit) {
      setAlert(alertTypes.warning);
      setStandIn(true);
    }
    verifyActionAndMaintenanceState();
  }

  function verifyActionAndMaintenanceState() {
    const stateMaintenance = selectedMaintenanceState?.stationMaintenance;
    if (
      stateMaintenance?.maintenance_id &&
      stateMaintenance.end_date_time &&
      stateMaintenance.start_date_time
    ) {
      const maintenanceStatus = mapStationMaintenanceState(stateMaintenance);
      if (
        isEdit &&
        ((maintenanceStatus === StationMaintenanceState.IN_PROGRESS &&
          action !== StationMaintenanceActionType.EDIT_IN_PROGRESS) ||
          (maintenanceStatus === StationMaintenanceState.SCHEDULED &&
            action !== StationMaintenanceActionType.EDIT_SCHEDULED))
      ) {
        history.push(ROUTES.STATION_MAINTENANCES_LIST);
      }
    }
  }

  useEffect(() => {
    handleGetStations();
  }, []);

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

        {alert && (
          <Alert severity={alert.severity as AlertColor} data-testid={`alert-${alert.severity}`}>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" width="85%">
                {t(alert.description)}
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
                filterOptions={(x) => x}
                disabled={(stationList.length === 0 && !stationCodeFilter) || isEdit || isDetail}
                value={selectedStation ?? null}
                onChange={(event, newSelectedStation: WrapperStationResource | null) => {
                  setSelectedStation(newSelectedStation ?? undefined);
                }}
                onInputChange={(event: any) => {
                  handleGetStations(event?.target?.value ?? '');
                }}
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
              <Grid item container xs={6} mb={2} spacing={3}>
                <Grid item xs={6}>
                  <HoursInput
                    label={t(`${componentPath}.configuration.hoursSection.fromHours`)}
                    hours={hoursFrom}
                    setHours={(value) => handleSetDate(value, SetDateType.HOURS_FROM)}
                    disabled={isInProgress || isDetail}
                    error={errorDate}
                    minTime={isEdit ? minDateFromToday : undefined}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    date={dateFrom}
                    setDate={(value) => handleSetDate(value, SetDateType.DATE_FROM)}
                    disabled={isInProgress || isDetail}
                    minDate={isEdit ? minDateFromToday : undefined}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={6} spacing={3}>
                <Grid item xs={6}>
                  <HoursInput
                    label={t(`${componentPath}.configuration.hoursSection.toHours`)}
                    hours={hoursTo}
                    minTime={
                      dateTo && dateFrom && datesAreOnSameDay(new Date(dateFrom), new Date(dateTo))
                        ? hoursFrom
                        : undefined
                    }
                    setHours={(value) => handleSetDate(value, SetDateType.HOURS_TO)}
                    disabled={isDetail}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    date={dateTo}
                    setDate={(value) => handleSetDate(value, SetDateType.DATE_TO)}
                    minDate={dateFrom}
                    disabled={isDetail}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="medium">
                {t(`${componentPath}.configuration.standInSection.title`)}
              </Typography>
              <Typography variant="body2" mb={2}>
                {t(`${componentPath}.configuration.standInSection.subtitle`)}
              </Typography>
              <FormControl disabled={isInProgress || isDetail || alert === alertTypes.warning}>
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
          {!isDetail && (
            <Button
              onClick={() => handleConfirmAction()}
              disabled={!dateFrom || !dateTo || !hoursFrom || !hoursTo || !selectedStation}
              color="primary"
              variant="contained"
              type="submit"
              data-testid="confirm-button-test"
            >
              {t('general.confirm')}
            </Button>
          )}
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
  disabled,
  error,
}: {
  label: string;
  hours: string | null;
  setHours: (value: string | null) => void;
  minTime?: string | null;
  disabled?: boolean;
  error?: string;
}) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopTimePicker
      label={label}
      views={['hours', 'minutes']}
      onChange={(value) => setHours(value)}
      value={hours}
      ampm={false}
      minutesStep={15}
      minTime={minTime ? minTime : minDateFromToday}
      disabled={disabled}
      renderInput={(params: TextFieldProps) => (
        <TextField
          {...params}
          inputProps={{
            ...params.inputProps,
            placeholder: '00:00',
            'data-testid': 'select-hours',
            readOnly: true,
          }}
          sx={{ width: '100%' }}
          id="hours"
          name="hours"
          type="time"
          size="small"
          helperText={error}
          error={disabled ? false : Boolean(error)}
        />
      )}
    />
  </LocalizationProvider>
);

const DatePicker = ({
  date,
  setDate,
  minDate,
  disabled,
  error,
}: {
  date: string | null;
  setDate: (value: string | null) => void;
  minDate?: string | null;
  disabled?: boolean;
  error?: string;
}) => {
  const { t } = useTranslation();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={t(`${componentPath}.configuration.hoursSection.ofDay`)}
        value={date ? new Date(date).toString() : null}
        inputFormat="dd/MM/yyyy"
        onChange={(value) => setDate(value)}
        minDate={minDate ? minDate : minDateFromToday}
        maxDate={add(new Date(), { months: 6 }).toDateString()}
        disabled={disabled}
        renderInput={(params: TextFieldProps) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              placeholder: 'dd/MM/aaaa',
              'data-testid': 'date-test',
              readOnly: true,
            }}
            sx={{ width: '100%' }}
            id="date"
            name="date"
            type="date"
            size="small"
            error={disabled ? false : Boolean(error)}
            helperText={error}
          />
        )}
      />
    </LocalizationProvider>
  );
};
