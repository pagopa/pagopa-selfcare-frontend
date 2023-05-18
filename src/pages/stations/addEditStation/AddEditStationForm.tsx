/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { theme } from '@pagopa/mui-italia';
import { FormikProps, useFormik } from 'formik';
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
import { RedirectProtocolEnum } from '../../../api/generated/portal/StationDetailsDto';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from '../addEditStation/AddEditStationFormSectionTitle';
import ConfirmModal from '../../components/ConfirmModal';
import {
  /* associateEcToStation, */
  createStation,
  createWrapperStation,
  getStationCode,
} from '../../../services/stationService';
import {
  LOADING_TASK_GENERATION_STATION_CODE,
  LOADING_TASK_STATION_ADD_EDIT,
} from '../../../utils/constants';
import { StationDetailResource } from '../../../api/generated/portal/StationDetailResource';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
// import { CreditorInstitutionStationDto } from '../../../api/generated/portal/CreditorInstitutionStationDto';
// import { WrapperStationDetailsDto } from '../../../api/generated/portal/WrapperStationDetailsDto';
import { StationStatusEnum } from '../../../api/generated/portal/StationResource';
import { StationFormAction, StationOnCreation } from '../../../model/Station';
import AddEdiitStationFormValidation from './components/AddEditStationFormValidation';

type Props = {
  goBack: () => void;
  stationDetail?: StationOnCreation;
  formAction: string;
  isOperator: boolean;
};

const AddEditStationForm = ({ goBack, stationDetail, formAction, isOperator }: Props) => {
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
    if (formAction === StationFormAction.Create) {
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
    }
  }, []);

  // const bodyStationDto: CreditorInstitutionStationDto = { stationCode: stationCodeGenerated };
  const stationActive = stationDetail ? stationDetail.enabled : false;
  const status = stationDetail ? stationDetail.stationStatus : StationStatusEnum.ON_REVISION;

  const initialFormData = (detail?: StationOnCreation) =>
    detail
      ? {
          ...{
            enabled: stationActive,
            brokerCode: brokerCodeCleaner,
            stationCode: detail.stationCode ?? '',
            stationStatus: detail.stationStatus ?? undefined,
            primitiveVersion: detail.primitiveVersion ?? undefined,
            redirectProtocol: detail.redirectProtocol ?? '',
            redirectPort: detail.redirectPort ?? undefined,
            redirectIp: detail.redirectIp ?? '',
            redirectPath: detail.redirectPath ?? '',
            redirectQueryString: detail.redirectQueryString ?? '',
            targetHost: detail.targetHost ?? '',
            targetPath: detail.targetPath ?? '',
            targetPort: detail.targetPort ?? undefined,
            targetHostPof: detail.targetHostPof ?? '',
            targetPathPof: detail.targetPathPof ?? '',
            targetPortPof: detail.targetPortPof ?? undefined,
          },
          ...(isOperator && {
            version: detail.version ?? undefined,
            password: detail.password ?? '',
            newPassword: detail.newPassword ?? '',
            protocol: detail.protocol ?? undefined,
            port: detail.port ?? undefined,
            ip: detail.ip ?? '',
            service: detail.service ?? '',
            pofService: detail.pofService ?? '',
            endpointIp: detail.endpointIp ?? '',
            endpointPath: detail.endpointPath ?? '',
            endpointPort: detail.endpointPort ?? undefined,
            protocol4Mod: detail.protocol4Mod ?? undefined,
            ip4Mod: detail.ip4Mod ?? '',
            port4Mod: detail.port4Mod ?? undefined,
            service4Mod: detail.service4Mod ?? '',
          }),
        }
      : {
          ...{
            enabled: stationActive,
            stationStatus: status,
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
          },
          ...(isOperator && {
            version: 0,
            password: '',
            newPassword: '',
            protocol: undefined,
            port: 0,
            ip: '',
            service: '',
            pofService: '',
            endpointIp: '',
            endpointPath: '',
            endpointPort: 0,
            protocol4Mod: undefined,
            ip4Mod: '',
            port4Mod: 0,
            service4Mod: '',
          }),
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

  const validate = (values: StationDetailResource) =>
    Object.fromEntries(
      Object.entries({
        ...{
          stationCode: !values.stationCode ? 'Campo obbligatorio' : undefined,
          brokerCode: !values.brokerCode ? 'Campo obbligatorio' : '',
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
          targetHostPof: !values.targetHostPof ? 'Campo obbligatorio' : undefined,
          targetPathPof: !values.targetPathPof ? 'Campo obbligatorio' : undefined,
          targetPortPof: !values.targetPortPof
            ? 'Campo obbligatorio'
            : validatePortRange(values.targetPortPof)
            ? t('addEditStationPage.validation.overPort')
            : undefined,
        },
        ...(isOperator && {
          version: !values.version
            ? 'Campo obbligatorio'
            : validatePrimitiveVersion(values.version)
            ? t('addEditStationPage.validation.overVersion')
            : undefined,
          password: !values.password ? 'Campo obbligatorio' : undefined,
          newPassword: !values.newPassword ? 'Campo obbligatorio' : undefined,
          protocol: !values.protocol ? 'Campo obbligatorio' : undefined,
          port: !values.port
            ? 'Campo obbligatorio'
            : validatePortRange(values.targetPort)
            ? t('addEditStationPage.validation.overPort')
            : undefined,
          ip: '',
          service: '',
          pofService: '',
        }),
      }).filter(([_key, value]) => value)
    );

  const submit = async (values: StationOnCreation) => {
    setLoading(true);
    try {
      if (isOperator) {
        await createStation(values);
      }
      await createWrapperStation(values);

      // const create = await createStation(values);
      // if (create) {
      //   await associateEcToStation(stationCodeCleaner, bodyStationDto);
      // }
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

  const formik = useFormik<StationOnCreation>({
    initialValues: initialFormData(stationDetail),
    validate,
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  useEffect(() => {
    console.log('stationDetail', stationDetail);
    console.log('FORMIK', formik);
  }, [formik]);

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<StationOnCreation>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

  const openConfirmModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    }
    setShowConfirmModal(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          p: 3,
          minWidth: '100%',
          mb: 4,
        }}
      >
        <Typography variant="h6" mb={3}>
          {t('addEditStationPage.title')}
        </Typography>

        <Typography variant="body2" mb={3}>
          {t('addEditStationPage.subTitle')}
        </Typography>

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
                  onChange={(e) => handleChangeNumberOnly(e, 'primitiveVersion', formik)}
                  error={formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)}
                  helperText={formik.touched.primitiveVersion && formik.errors.primitiveVersion}
                  inputProps={{
                    type: 'number',
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
                    min: 0,
                    max: 65556,
                    'data-testid': 'redirect-port-test',
                  }}
                  label={t('addEditStationPage.addForm.fields.redirectPort')}
                  placeholder={t('addEditStationPage.addForm.fields.redirectPort')}
                  size="small"
                  value={formik.values.redirectPort === 0 ? '' : formik.values.redirectPort}
                  onChange={(e) => handleChangeNumberOnly(e, 'redirectPort', formik)}
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
              title={t('addEditStationPage.addForm.sections.targetService')}
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
                    min: 0,
                    max: 65556,
                    'data-testid': 'target-port-test',
                  }}
                  label={t('addEditStationPage.addForm.fields.targetPort')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPort')}
                  size="small"
                  value={formik.values.targetPort === 0 ? '' : formik.values.targetPort}
                  onChange={(e) => handleChangeNumberOnly(e, 'targetPort', formik)}
                  error={formik.touched.targetPort && Boolean(formik.errors.targetPort)}
                  helperText={formik.touched.targetPort && formik.errors.targetPort}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <AddEditStationFormSectionTitle
              title={t('addEditStationPage.addForm.sections.targetServicePof')}
              icon={<MenuBook />}
              isRequired
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetHostPof"
                  name="targetHostPof"
                  label={t('addEditStationPage.addForm.fields.targetAddress')}
                  size="small"
                  value={formik.values.targetHostPof}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetHostPof && Boolean(formik.errors.targetHostPof)}
                  helperText={formik.touched.targetHostPof && formik.errors.targetHostPof}
                  inputProps={{
                    'data-testid': 'target-address-pof-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetPathPof"
                  name="targetPathPof"
                  label={t('addEditStationPage.addForm.fields.targetService')}
                  size="small"
                  value={formik.values.targetPathPof}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetPathPof && Boolean(formik.errors.targetPathPof)}
                  helperText={formik.touched.targetPathPof && formik.errors.targetPathPof}
                  inputProps={{
                    'data-testid': 'target-service-pof-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetPortPof"
                  name="targetPortPof"
                  InputLabelProps={{ shrink: formik.values.targetPortPof ? true : false }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 65556,
                    'data-testid': 'target-port-pof-test',
                  }}
                  label={t('addEditStationPage.addForm.fields.targetPort')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPort')}
                  size="small"
                  value={formik.values.targetPortPof === 0 ? '' : formik.values.targetPortPof}
                  onChange={(e) => handleChangeNumberOnly(e, 'targetPortPof', formik)}
                  error={formik.touched.targetPortPof && Boolean(formik.errors.targetPortPof)}
                  helperText={formik.touched.targetPortPof && formik.errors.targetPortPof}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {isOperator ? (
        <AddEdiitStationFormValidation
          formik={formik}
          handleChangeNumberOnly={handleChangeNumberOnly}
          inputGroupStyle={inputGroupStyle}
        />
      ) : (
        <></>
      )}
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack}>
            {t('addEditStationPage.addForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              openConfirmModal();
              formik.handleSubmit();
            }}
            disabled={!formik.isValid}
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
          <Trans i18nKey="addEditStationPage.confirmModal.messageStation">
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
