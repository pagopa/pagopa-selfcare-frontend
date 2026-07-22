/* eslint-disable sonarjs/cognitive-complexity */
import {
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { AvailableCodes } from '../../../api/generated/portal/AvailableCodes';
import { CreditorInstitutionInfo } from '../../../api/generated/portal/CreditorInstitutionInfo';
import { CreditorInstitutionInfoResource } from '../../../api/generated/portal/CreditorInstitutionInfoResource';
import { CreditorInstitutionResource } from '../../../api/generated/portal/CreditorInstitutionResource';
import { CreditorInstitutionStationDto } from '../../../api/generated/portal/CreditorInstitutionStationDto';
import ECSelection from '../../../components/Form/ECSelection';
import { StationECAssociateActionType } from '../../../model/Station';
import { useAppSelector, useAppSelectorWithRedirect } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { stationsSelectors } from '../../../redux/slices/stationsSlice';
import ROUTES from '../../../routes';
import { getAvailableCreditorInstitutionsForStation } from '../../../services/creditorInstitutionService';
import {
  associateEcToStation,
  getCreditorInstitutionSegregationCodes,
  updateEcAssociationToStation,
} from '../../../services/stationService';
import { extractProblemJson } from '../../../utils/client-utils';
import {
  LOADING_TASK_EC_AVAILABLE,
  LOADING_TASK_SEGREGATION_CODES_AVAILABLE,
} from '../../../utils/constants';

const availableEcEmptyState: CreditorInstitutionInfoResource = {
  creditor_institution_info_list: [],
};

function StationAssociateECPage() {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_EC_AVAILABLE);
  const setLoadingList = useLoading(LOADING_TASK_SEGREGATION_CODES_AVAILABLE);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { stationId, action } = useParams<{ stationId: string; action: string }>();
  const isEditMode = action === StationECAssociateActionType.EDIT;

  const [loadingCiList, setLoadingCiList] = useState<boolean>(false);
  const [inputCiName, setInputCiName] = useState<string>('');
  const reduxCiRelation: CreditorInstitutionResource = useAppSelectorWithRedirect({
    selector: stationsSelectors.selectSelectedStationCreditInstitution,
    routeToRedirect: isEditMode
      ? generatePath(ROUTES.STATION_EC_LIST, {
          stationId,
        })
      : undefined,
  });
  const [selectedEC, setSelectedEC] = useState<CreditorInstitutionInfo | undefined>(
    isEditMode
      ? {
          businessName: reduxCiRelation.businessName,
          ciTaxCode: reduxCiRelation.ciTaxCode,
        }
      : undefined
  );
  const [availableEC, setAvailableEC] =
    useState<CreditorInstitutionInfoResource>(availableEcEmptyState);
  const [segregationCodeList, setSegregationCodeList] = useState<AvailableCodes>({
    availableCodes: [],
  });

  useEffect(() => {
    if (selectedParty?.partyId && !isEditMode) {
      setLoadingCiList(true);
      setAvailableEC(availableEcEmptyState);
      const timeout = setTimeout(() => {
        getAvailableCreditorInstitutionsForStation({
          stationCode: stationId,
          brokerId: selectedParty.partyId,
          ciName: inputCiName,
        })
          .then((data) => {
            setAvailableEC(data);
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
          .finally(() => setLoadingCiList(false));
      }, 300);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [inputCiName]);

  useEffect(() => {
    if (selectedEC && selectedEC.ciTaxCode && selectedParty?.fiscalCode && !isEditMode) {
      setLoadingList(true);
      getCreditorInstitutionSegregationCodes(selectedParty.fiscalCode, selectedEC.ciTaxCode)
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
    } else if (isEditMode && reduxCiRelation?.segregationCode !== undefined) {
      setSegregationCodeList({ availableCodes: [reduxCiRelation.segregationCode] });
    }
  }, [selectedEC]);

  const handleChange = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    formik.setFieldValue('broadcast', event.target.checked);
  };

  const formik = useFormik<CreditorInstitutionStationDto>({
    initialValues: {
      auxDigit: isEditMode && reduxCiRelation.auxDigit ? Number(reduxCiRelation.auxDigit) : 3,
      segregationCode: isEditMode ? reduxCiRelation?.segregationCode ?? '' : '',
      applicationCode: isEditMode && reduxCiRelation.applicationCode ? Number(reduxCiRelation.applicationCode) : undefined,
      stationCode: stationId,
      mod4: isEditMode && reduxCiRelation.mod4 ? reduxCiRelation.mod4 === "true" : undefined,
      broadcast: isEditMode ? Boolean(reduxCiRelation?.broadcast) : false,
      stand_in: isEditMode ? Boolean(reduxCiRelation?.stand_in) : true,
      aca: isEditMode ? Boolean(reduxCiRelation?.aca) : true,
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
    values.auxDigit &&
    values.segregationCode !== '' &&
    selectedEC;

  const submit = (values: CreditorInstitutionStationDto) => {
    if (selectedEC && selectedEC.ciTaxCode && selectedParty?.partyId && selectedParty?.fiscalCode) {
      setLoading(true);
      const promise = isEditMode
        ? updateEcAssociationToStation(selectedEC.ciTaxCode, { ...values, stationCode: stationId })
        : associateEcToStation(selectedEC.ciTaxCode, { ...values, stationCode: stationId }, selectedParty.partyId, selectedParty.fiscalCode);
      promise
        .then((_) => {
          history.push(generatePath(ROUTES.STATION_EC_LIST, { stationId }), {
            alertSuccessMessage: t(
              `stationAssociateECPage.associationForm.successMessage${isEditMode ? 'Update' : 'Associate'}`
            ),
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
          <Typography variant="h3">{t('stationAssociateECPage.title')}</Typography>
        </Grid>
        <Grid item xs={12} mb={4} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            {t('stationAssociateECPage.subTitle') + ' '}
            <Typography component="span" fontWeight={'fontWeightMedium'}>
              {stationId}
            </Typography>
          </Typography>
        </Grid>
      </Box>
      <Box mb={3} sx={{ width: '100%', maxWidth: '684px' }}>
        <Paper
          elevation={8}
          sx={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
            padding: 3,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="sidenav">
                  {t('stationAssociateECPage.institutionToAssociate')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: '100%', minWidth: '100%' }}>
                  <ECSelection
                    availableEC={
                      availableEC?.creditor_institution_info_list
                        ? [...availableEC.creditor_institution_info_list]
                        : []
                    }
                    selectedEC={selectedEC}
                    onECSelectionChange={(selectedEC: CreditorInstitutionInfo | undefined) => {
                      setSelectedEC(selectedEC);
                    }}
                    onChangeInput={(event) => setInputCiName(event?.target?.value ?? '')}
                    loading={loadingCiList}
                    serverSide={true}
                    disabled={isEditMode}
                  />
                </FormControl>
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
                    <MenuItem value={formik.values.auxDigit}>{formik.values.auxDigit}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel size="small">
                    {t('stationAssociateECPage.associationForm.segregationCode')}
                  </InputLabel>
                  <Select
                    disabled={selectedEC?.ciTaxCode === undefined || isEditMode}
                    id="segregationCode"
                    name="segregationCode"
                    label={t('stationAssociateECPage.associationForm.segregationCode')}
                    size="small"
                    value={formik.values.segregationCode}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    error={formik.touched.segregationCode && Boolean(formik.errors.segregationCode)}
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
                <Typography variant="sidenav">{t('stationAssociateECPage.broadcast')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  sx={{ width: '100%' }}
                  control={
                    <Switch
                      name="broadcast"
                      checked={formik.values.broadcast}
                      onChange={handleChange}
                      inputProps={{
                        'aria-label': 'controlled',
                      }}
                      data-testid="broadcast-test"
                    />
                  }
                  label={formik.values.broadcast ? 'Attivo' : 'Non attivo'}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      <Box sx={{ width: '100%', maxWidth: '684px' }}>
        <Paper
          elevation={8}
          sx={{
            minWidth: '100%',
            borderRadius: theme.spacing(2),
            padding: 3,
          }}
        >
          <Typography variant="overline">
            {t('stationAssociateECPage.secondPaper.title')}
          </Typography>
          <Typography variant="body2">
            {t('stationAssociateECPage.secondPaper.subtitle')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('stationAssociateECPage.secondPaper.aca')}
          </Typography>
          <FormControl>
            <RadioGroup
              name="aca"
              onChange={async (e) => {
                const value = e.target.value;
                void formik.setFieldValue('aca', value === 'true' ? true : false);
                if (value === 'false') {
                  void formik.setFieldValue('stand_in', false);
                }
              }}
              data-testid="aca-test"
              value={`${formik.values.aca}`}
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
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t('stationAssociateECPage.secondPaper.standIn')}
          </Typography>
          <FormControl disabled={!formik.values.aca}>
            <RadioGroup
              name="standIn"
              onChange={(e) =>
                formik.setFieldValue('stand_in', e.target.value === 'true' ? true : false)
              }
              data-testid="standIn-test"
              value={`${formik.values.stand_in}`}
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
