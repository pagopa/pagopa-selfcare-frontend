/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { theme } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Badge as BadgeIcon, MenuBook } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import {
  RedirectProtocolEnum,
  StationDetailsDto,
} from '../../../api/generated/portal/StationDetailsDto';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from '../addEditStation/AddEditStationFormSectionTitle';
import ConfirmModal from '../../components/ConfirmModal';
import {
  associateEcToStation,
  createStation,
  getStationCode,
} from '../../../services/stationService';
import {
  LOADING_TASK_GENERATION_STATION_CODE,
  LOADING_TASK_STATION_ADD_EDIT,
} from '../../../utils/constants';
import { StationDetailResource } from '../../../api/generated/portal/StationDetailResource';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { CreditorInstitutionStationDto } from '../../../api/generated/portal/CreditorInstitutionStationDto';
import { ENV } from '../../../utils/env';

type Props = {
  goBack: () => void;
  stationDetail?: StationDetailResource;
  formAction: string;
};

const AddEditStationForm = ({ goBack /* stationDetail, formAction */ }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_STATION_ADD_EDIT);
  const setLoadingGeneration = useLoading(LOADING_TASK_GENERATION_STATION_CODE);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [stationCodeGenerated, setStationCodeGenerated] = useState('');

  const stationCodeCleaner = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';
  const brokerCodeCleaner = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  useEffect(() => {
    setLoadingGeneration(true);
    getStationCode(stationCodeCleaner)
      .then((res) => {
        setStationCodeGenerated(res.stationCode);
      })
      .catch((error) => {
        addError({
          id: 'GENERATE_STATION_CODE',
          blocking: false,
          error,
          techDescription: `An error occurred while generating station code`,
          toNotify: true,
          displayableTitle: t('addEditStationPage.errorMessageStationCodeTitle'),
          displayableDescription: t('addEditStationPage.errorMessageStationCodeDesc'),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoadingGeneration(false);
      });
  }, []);

  const bodyStationDto: CreditorInstitutionStationDto = { stationCode: stationCodeGenerated };

  const initialFormData: StationDetailsDto = {
    brokerCode: brokerCodeCleaner,
    stationCode: stationCodeGenerated,
    primitiveVersion: 0,
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    redirectPort: 0,
    redirectIp: '',
    redirectPath: '',
    redirectQueryString: '',
    targetHost: '',
    targetPath: '',
    targetPort: 0,
  };

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const validatePortRange = (redirectPort: number | undefined) => {
    if (redirectPort) {
      return redirectPort > 0 && redirectPort < 65556 ? false : true;
    }
    return false;
  };

  const validatePrimitiveVersion = (primitiveVersion: number) => {
    if (primitiveVersion) {
      return primitiveVersion > 0 && primitiveVersion <= 2 ? false : true;
    }
    return false;
  };

  const validate = (values: StationDetailsDto) =>
    Object.fromEntries(
      Object.entries({
        brokerCode: !values.brokerCode ? 'Campo obbligatorio' : undefined,
        stationCode: !values.stationCode ? 'Campo obbligatorio' : undefined,
        primitiveVersion: !values.primitiveVersion
          ? 'Campo obbligatorio'
          : validatePrimitiveVersion(values.primitiveVersion)
          ? t('addEditStationPage.validation.overVersion')
          : undefined,
        redirectProtocol: !values.redirectProtocol ? 'Campo obbligatorio' : undefined,
        redirectPort: !values.redirectPort
          ? 'Campo obbligatorio'
          : validatePortRange(values.redirectPort)
          ? t('addEditStationPage.validation.overPort')
          : undefined,
        redirectIp: !values.redirectIp ? 'Campo obbligatorio' : undefined,
        redirectPath: !values.redirectPath ? 'Campo obbligatorio' : undefined,
        redirectQueryString: !values.redirectQueryString ? 'Campo obbligatorio' : undefined,
        targetHost: !values.targetHost ? 'Campo obbligatorio' : undefined,
        targetPath: !values.targetPath ? 'Campo obbligatorio' : undefined,
        targetPort: !values.targetPort
          ? 'Campo obbligatorio'
          : validatePortRange(values.targetPort)
          ? t('addEditStationPage.validation.overPort')
          : undefined,
      }).filter(([_key, value]) => value)
    );

  const submit = async (values: StationDetailsDto) => {
    setLoading(true);
    try {
      const create = await createStation(values);
      if (create) {
        await associateEcToStation(stationCodeCleaner, bodyStationDto);
      }
      history.push(ROUTES.STATIONS, {
        alertSuccessMessage: t('addEditStationPage.successMessage'),
      });
    } catch (reason) {
      addError({
        id: 'ADD_EDIT_STATION',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing station`,
        toNotify: true,
        displayableTitle: t('addEditStationPage.errorMessageTitle'),
        displayableDescription: t('addEditStationPage.errorMessageDesc'),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<StationDetailsDto>({
    initialValues: initialFormData,
    validate,
    onSubmit: async () => {
      setShowConfirmModal(false);
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
          minWidth: '100%',
        }}
      >
        <Typography variant="h6" mb={3}>
          {t('addEditStationPage.title')}
        </Typography>

        {ENV.ENV === 'UAT' ? (
          <Typography variant="body2" mb={3}>
            {t('addEditStationPage.subTitle')}
          </Typography>
        ) : null}

        <Box>
          <Box sx={inputGroupStyle}>
            <AddEditStationFormSectionTitle
              title={t('addEditStationPage.addForm.sections.registry')}
              icon={<BadgeIcon />}
              isRequired
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="stationCode"
                  name="stationCode"
                  label={t('addEditStationPage.addForm.fields.stationCode')}
                  placeholder={t('addEditStationPage.addForm.fields.stationCode')}
                  size="small"
                  value={formik.values.stationCode}
                  disabled
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.stationCode && Boolean(formik.errors.stationCode)}
                  helperText={formik.touched.stationCode && formik.errors.stationCode}
                  inputProps={{
                    'data-testid': 'station-code-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="primitiveVersion"
                  name="primitiveVersion"
                  label={t('addEditStationPage.addForm.fields.primitiveVersion')}
                  placeholder={t('addEditStationPage.addForm.fields.primitiveVersion')}
                  size="small"
                  InputLabelProps={{ shrink: formik.values.primitiveVersion ? true : false }}
                  value={formik.values.primitiveVersion === 0 ? '' : formik.values.primitiveVersion}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)}
                  helperText={formik.touched.primitiveVersion && formik.errors.primitiveVersion}
                  inputProps={{
                    type: 'number',
                    min: 0,
                    max: 2,
                    'data-testid': 'primitive-version-test',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <AddEditStationFormSectionTitle
              title={t('addEditStationPage.addForm.sections.redirect')}
              icon={<MenuBook />}
              isRequired
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('addEditStationPage.addForm.fields.redirectProtocol')}
                  </InputLabel>
                  <Select
                    fullWidth
                    id="redirectProtocol"
                    name="redirectProtocol"
                    label={t('addEditStationPage.addForm.fields.redirectProtocol')}
                    size="small"
                    defaultValue={formik.values.redirectProtocol}
                    value={
                      formik.values.redirectProtocol === RedirectProtocolEnum.HTTPS
                        ? 'HTTPS'
                        : 'HTTP'
                    }
                    onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.redirectProtocol && Boolean(formik.errors.redirectProtocol)
                    }
                    inputProps={{
                      'data-testid': 'redirect-protocol-test',
                    }}
                  >
                    {['HTTPS', 'HTTP'].map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirectPort"
                  name="redirectPort"
                  InputLabelProps={{ shrink: formik.values.redirectPort ? true : false }}
                  inputProps={{
                    step: 1,
                    type: 'number',
                    min: 0,
                    max: 65556,
                    'data-testid': 'redirect-port-test',
                  }}
                  label={t('addEditStationPage.addForm.fields.redirectPort')}
                  placeholder={t('addEditStationPage.addForm.fields.redirectPort')}
                  size="small"
                  value={formik.values.redirectPort === 0 ? '' : formik.values.redirectPort}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.redirectPort && Boolean(formik.errors.redirectPort)}
                  helperText={
                    formik.touched.redirectPort &&
                    formik.errors.redirectPort &&
                    t('addEditStationPage.validation.overPort')
                  }
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirectPath"
                  name="redirectPath"
                  label={t('addEditStationPage.addForm.fields.redirectService')}
                  size="small"
                  value={formik.values.redirectPath}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.redirectPath && Boolean(formik.errors.redirectPath)}
                  helperText={formik.touched.redirectPath && formik.errors.redirectPath}
                  inputProps={{
                    'data-testid': 'redirect-service-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirectIp"
                  name="redirectIp"
                  label={t('addEditStationPage.addForm.fields.redirectIp')}
                  size="small"
                  value={formik.values.redirectIp}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.redirectIp && Boolean(formik.errors.redirectIp)}
                  helperText={formik.touched.redirectIp && formik.errors.redirectIp}
                  inputProps={{
                    'data-testid': 'redirect-ip-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="redirectQueryString"
                  name="redirectQueryString"
                  label={t('addEditStationPage.addForm.fields.redirectParameters')}
                  size="small"
                  value={formik.values.redirectQueryString}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.redirectQueryString && Boolean(formik.errors.redirectQueryString)
                  }
                  helperText={
                    formik.touched.redirectQueryString && formik.errors.redirectQueryString
                  }
                  inputProps={{
                    'data-testid': 'redirect-parameters-test',
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <AddEditStationFormSectionTitle
              title={t('addEditStationPage.addForm.sections.target')}
              icon={<MenuBook />}
              isRequired
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetHost"
                  name="targetHost"
                  label={t('addEditStationPage.addForm.fields.targetAddress')}
                  size="small"
                  value={formik.values.targetHost}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetHost && Boolean(formik.errors.targetHost)}
                  helperText={formik.touched.targetHost && formik.errors.targetHost}
                  inputProps={{
                    'data-testid': 'target-address-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetPath"
                  name="targetPath"
                  label={t('addEditStationPage.addForm.fields.targetService')}
                  size="small"
                  value={formik.values.targetPath}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetPath && Boolean(formik.errors.targetPath)}
                  helperText={formik.touched.targetPath && formik.errors.targetPath}
                  inputProps={{
                    'data-testid': 'target-service-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetPort"
                  name="targetPort"
                  InputLabelProps={{ shrink: formik.values.targetPort ? true : false }}
                  inputProps={{
                    step: 1,
                    type: 'number',
                    min: 0,
                    max: 65556,
                    'data-testid': 'target-port-test',
                  }}
                  label={t('addEditStationPage.addForm.fields.targetPort')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPort')}
                  size="small"
                  value={formik.values.targetPort === 0 ? '' : formik.values.targetPort}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetPort && Boolean(formik.errors.targetPort)}
                  helperText={formik.touched.targetPort && formik.errors.targetPort}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack}>
            {t('addEditStationPage.addForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => setShowConfirmModal(true)}
            disabled={!formik.dirty || !formik.isValid}
            color="primary"
            variant="contained"
            type="submit"
          >
            {t('addEditStationPage.addForm.continueButton')}
          </Button>
        </Stack>
      </Stack>
      <ConfirmModal
        title={t('addEditStationPage.confirmModal.title')}
        message={
          <Trans i18nKey="addEditStationPage.confirmModal.message">
            Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
            approvare. Riceverai una notifica a revisione completata.
            <br />
          </Trans>
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={t('addEditStationPage.confirmModal.confirmButton')}
        onCloseLabel={t('addEditStationPage.confirmModal.cancelButton')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
};

export default AddEditStationForm;
