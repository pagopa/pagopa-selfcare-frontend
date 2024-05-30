import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

import { Alert, FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { AvailableCodes } from '../../../api/generated/portal/AvailableCodes';
import { CreditorInstitutionInfo } from '../../../api/generated/portal/CreditorInstitutionInfo';
import { CreditorInstitutionInfoArray } from '../../../api/generated/portal/CreditorInstitutionInfoArray';
import { CreditorInstitutionStationDto } from '../../../api/generated/portal/CreditorInstitutionStationDto';
import ECSelection from '../../../components/Form/ECSelection';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { getAvailableCreditorInstitutionsForStation } from '../../../services/creditorInstitutionService';
import {
  associateEcToStation,
  getCreditorInstitutionSegregationCodes,
} from '../../../services/stationService';
import { extractProblemJson } from '../../../utils/client-utils';
import {
  LOADING_TASK_EC_AVAILABLE,
  LOADING_TASK_SEGREGATION_CODES_AVAILABLE,
} from '../../../utils/constants';

function StationAssociateECPage() {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_EC_AVAILABLE);
  const setLoadingList = useLoading(LOADING_TASK_SEGREGATION_CODES_AVAILABLE);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { stationId } = useParams<{ stationId: string }>();
  const [selectedEC, setSelectedEC] = useState<CreditorInstitutionInfo | undefined>();
  const [availableEC, setAvailableEC] = useState<CreditorInstitutionInfoArray>([]);
  const [segregationCodeList, setSegregationCodeList] = useState<AvailableCodes>({
    availableCodes: [],
  });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (selectedParty?.partyId) {
      getAvailableCreditorInstitutionsForStation(stationId, selectedParty.partyId)
        .then((data) => {
          if (data) {
            setAvailableEC(data);
          }
        })
        .catch((reason) =>
          addError({
            id: 'GET_AVAILABLE_DELEGATED_EC_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while getting delegated ec list`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
            ),
            component: 'Toast',
          })
        )
        .finally(() => setLoading(false));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedEC && selectedEC.ci_tax_code && selectedParty?.fiscalCode) {
      setLoadingList(true);
      getCreditorInstitutionSegregationCodes(selectedParty.fiscalCode, selectedEC.ci_tax_code)
        .then((data) => {
          if (data && Array.isArray(data.availableCodes)) {
            setSegregationCodeList(data);
          }
        })
        .catch((reason) => {
          const problemJson = extractProblemJson(reason);

          addError({
            id: 'GET_AVAILABLE_SEGREGATION_CODES_LIST',
            blocking: false,
            error: problemJson?.response?.detail ?? reason,
            techDescription:
              problemJson?.response?.title ??
              `An error occurred while getting segregation codes list`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              problemJson?.status === 404
                ? 'stationAssociateECPage.associationForm.errorMessageECNotValid'
                : 'stationAssociateECPage.associationForm.errorMessageSegregationCodesGet'
            ),
            component: 'Toast',
          });
        })
        .finally(() => setLoadingList(false));
    }
  }, [selectedEC]);

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    formik.setFieldValue('broadcast', event.target.checked);
  };

  const formik = useFormik<CreditorInstitutionStationDto>({
    initialValues: {
      auxDigit: 3,
      segregationCode: '',
      stationCode: stationId,
      broadcast: false,
    },
    onSubmit: async (values) => {
      submit(values);
    },
  });

  const history = useHistory();

  const goBack = () => {
    history.push(
      generatePath(ROUTES.STATION_EC_LIST, {
        stationId,
      })
    );
  };

  const enableSubmit = (values: CreditorInstitutionStationDto) =>
    values.stationCode !== '' &&
    values.auxDigit === 3 &&
    values.segregationCode !== '' &&
    selectedEC;

  const submit = (values: CreditorInstitutionStationDto) => {
    if (selectedEC && selectedEC.ci_tax_code) {
      setLoading(true);
      associateEcToStation(selectedEC.ci_tax_code!, { ...values, stationCode: stationId })
        .then((_) => {
          history.push(generatePath(ROUTES.STATION_EC_LIST, { stationId }), {
            alertSuccessMessage: t('stationAssociateECPage.associationForm.successMessage'),
          });
        })
        .catch((err: Error) => {
          const problemJson = extractProblemJson(err);
          // eslint-disable-next-line functional/no-let
          let displayedText = t('stationAssociateECPage.associationForm.errorMessageDesc');

          if (problemJson?.status === 404) {
            displayedText = t('stationAssociateECPage.associationForm.errorMessageECNotValid');
          } else if (problemJson?.status === 409) {
            displayedText = t(
              'stationAssociateECPage.associationForm.errorMessageAlreadyAssociated'
            );
          }

          return addError({
            id: 'ASSOCIATE_EC',
            blocking: false,
            error: problemJson?.response?.detail ?? err,
            techDescription:
              problemJson?.response?.title ?? 'An error occurred while ec association',
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: displayedText,
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Box justifyContent="center">
        <Grid item xs={12} mb={1} display="flex" justifyContent="center">
          <Typography variant="h3">
            <Trans i18nKey="stationAssociateECPage.associationForm.title">Associa EC</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} mb={4} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            <Trans i18nKey="stationAssociateECPage.associationForm.subTitle">
              Digita il nome del nuovo EC da associare alla stazione
            </Trans>{' '}
            <Typography component="span" fontWeight={'fontWeightMedium'}>
              {stationId}
            </Typography>
          </Typography>
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexGrow={0}
        mb={1}
        sx={{ width: '100%', maxWidth: '684px' }}
      >
        <Paper
          elevation={8}
          sx={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
          }}
        >
          <Grid item xs={12} p={3}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid container item alignContent="center" spacing={2} pb={4}>
                  <Grid item xs={12}>
                    <Typography variant="sidenav">
                      {t('stationAssociateECPage.institutionToAssociate')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: '100%', minWidth: '100%' }}>
                      <ECSelection
                        availableEC={availableEC}
                        selectedEC={selectedEC}
                        onECSelectionChange={(selectedEC: CreditorInstitutionInfo | undefined) => {
                          setSelectedEC(selectedEC);
                        }}
                      />
                    </FormControl>
                    <Box mt={1}>
                      <Alert
                        severity={'warning'}
                        data-testid="alert-warning-test"
                        variant="outlined"
                      >
                        {t('stationAssociateECPage.alert.noDelegations')}
                      </Alert>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <Typography variant="sidenav">
                      {t('stationAssociateECPage.associationParams')}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel size="small">
                        {t('stationAssociateECPage.associationForm.auxDigit')}
                      </InputLabel>
                      <Select
                        id="auxDigit"
                        name="auxDigit"
                        label={t('stationAssociateECPage.associationForm.auxDigit')}
                        size="small"
                        value={formik.values.auxDigit}
                        inputProps={{
                          'data-testid': 'aux-digit-test',
                        }}
                        disabled={true}
                      >
                        <MenuItem value={3}>3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel size="small">
                        {t('stationAssociateECPage.associationForm.segregationCode')}
                      </InputLabel>
                      <Select
                        disabled={selectedEC?.ci_tax_code === undefined}
                        id="segregationCode"
                        name="segregationCode"
                        label={t('stationAssociateECPage.associationForm.segregationCode')}
                        size="small"
                        value={formik.values.segregationCode}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.segregationCode && Boolean(formik.errors.segregationCode)
                        }
                        inputProps={{
                          'data-testid': 'segregation-code-test',
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: '200px', // Imposta l'altezza massima del menu
                            },
                          },
                        }}
                      >
                        {segregationCodeList?.availableCodes?.map((code, i) => (
                          <MenuItem key={i} value={code}>
                            {code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="sidenav">
                      {t('stationAssociateECPage.broadcast')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      sx={{ width: '100%' }}
                      control={
                        <Switch
                          name="broadcast"
                          checked={checked}
                          onChange={handleChange}
                          value={formik.values.broadcast}
                          inputProps={{
                            'aria-label': 'controlled',
                          }}
                          data-testid="broadcast-test"
                        />
                      }
                      label={checked ? 'Attivo' : 'Non attivo'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Paper>
      </Box>
      <Stack direction="row" justifyContent="space-between" mt={5} mb={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack} data-testid="back-btn-test">
            {t('stationAssociateECPage.associationForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => submit(formik.values)}
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            data-testid="confirm-btn-test"
          >
            {t('stationAssociateECPage.associationForm.confirmButton')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default StationAssociateECPage;
