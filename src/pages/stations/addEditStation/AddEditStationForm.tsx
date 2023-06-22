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
import { generatePath, useHistory } from 'react-router-dom';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { RedirectProtocolEnum, StatusEnum } from '../../../api/generated/portal/StationDetailsDto';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from '../addEditStation/AddEditStationFormSectionTitle';
import ConfirmModal from '../../components/ConfirmModal';
import {
  createStation,
  createWrapperStation,
  getStationCode,
  updateStation,
  updateWrapperStationToCheck,
  updateWrapperStationToCheckUpdate,
} from '../../../services/stationService';
import {
  LOADING_TASK_GENERATION_STATION_CODE,
  LOADING_TASK_STATION_ADD_EDIT,
} from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { StationFormAction, StationOnCreation } from '../../../model/Station';
import { isOperator } from '../components/commonFunctions';
import { WrapperStatusEnum } from '../../../api/generated/portal/StationDetailResource';
import AddEditStationFormValidation from './components/AddEditStationFormValidation';

type Props = {
  goBack: () => void;
  stationDetail?: StationOnCreation;
  formAction: string;
};

const AddEditStationForm = ({ goBack, stationDetail, formAction }: Props) => {
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
  const operator = isOperator();

  useEffect(() => {
    if (formAction !== StationFormAction.Edit) {
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

  const initialFormData = (detail?: StationOnCreation) =>
    detail
      ? {
          brokerCode: detail.brokerCode ?? '',
          stationCode: detail.stationCode ?? '',
          status: detail?.wrapperStatus,
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
          version: detail.version ?? undefined,
          password: detail.password ?? '',
          newPassword: detail.newPassword ?? '',
          threadNumber: detail.threadNumber ?? undefined,
          protocol: detail.protocol ?? undefined,
          port: detail.port ?? undefined,
          ip: detail.ip ?? '',
          service: detail.service ?? '',
          pofService: detail.pofService ?? '',
          protocol4Mod: detail.protocol4Mod ?? undefined,
          ip4Mod: detail.ip4Mod ?? '',
          port4Mod: detail.port4Mod ?? undefined,
          service4Mod: detail.service4Mod ?? '',
          enabled: detail.enabled,
        }
      : {
          status: StatusEnum.TO_CHECK,
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
          version: stationDetail?.version ?? 0,
          password: '',
          newPassword: '',
          threadNumber: 0,
          protocol: undefined,
          port: 0,
          ip: '',
          service: '',
          pofService: '',
          protocol4Mod: undefined,
          ip4Mod: '',
          port4Mod: 0,
          service4Mod: '',
        };

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const validatePrimitiveVersion = (primitiveVersion: number) => {
    if (primitiveVersion) {
      return primitiveVersion > 0 && primitiveVersion <= 2 ? false : true;
    }
    return false;
  };

  const validate = (values: StationOnCreation) =>
    Object.fromEntries(
      Object.entries({
        ...{
          stationCode: !values.stationCode ? 'Campo obbligatorio' : undefined,
          brokerCode:
            operator && formAction !== StationFormAction.Create
              ? ''
              : !values.brokerCode
              ? 'Campo obbligatorio'
              : '',
          primitiveVersion: !values.primitiveVersion
            ? 'Campo obbligatorio'
            : validatePrimitiveVersion(values.primitiveVersion)
            ? t('addEditStationPage.validation.overVersion')
            : undefined,
          redirectProtocol: !values.redirectProtocol ? 'Campo obbligatorio' : undefined,
          redirectPort: !values.redirectPort
            ? 'Campo obbligatorio'
            : isNaN(values.redirectPort)
            ? 'Non Valido, l’input dev’essere un numero'
            : undefined,
          redirectIp: !values.redirectIp ? 'Campo obbligatorio' : undefined,
          redirectPath: !values.redirectPath ? 'Campo obbligatorio' : undefined,
          redirectQueryString: !values.redirectQueryString ? 'Campo obbligatorio' : undefined,
          targetHost:
            !values.targetHost &&
            !values.targetHostPof &&
            !values.targetPathPof &&
            !values.targetPortPof
              ? 'Campo obbligatorio'
              : undefined,
          targetPath:
            !values.targetPath &&
            !values.targetHostPof &&
            !values.targetPathPof &&
            !values.targetPortPof
              ? 'Campo obbligatorio'
              : undefined,
          targetPort:
            !values.targetPort &&
            !values.targetHostPof &&
            !values.targetPathPof &&
            !values.targetPortPof
              ? 'Campo obbligatorio'
              : isNaN(values.targetPort)
              ? 'Non Valido, l’input dev’essere un numero'
              : undefined,
          targetHostPof:
            !values.targetHostPof && !values.targetHost && !values.targetPath && !values.targetPort
              ? 'Campo obbligatorio'
              : undefined,
          targetPathPof:
            !values.targetPathPof && !values.targetHost && !values.targetPath && !values.targetPort
              ? 'Campo obbligatorio'
              : undefined,
          targetPortPof:
            !values.targetPortPof && !values.targetHost && !values.targetPath && !values.targetPort
              ? 'Campo obbligatorio'
              : typeof values.targetPortPof !== 'undefined' && isNaN(values.targetPortPof)
              ? 'Non Valido, l’input dev’essere un numero'
              : undefined,
        },
        ...(operator && formAction !== StationFormAction.Create
          ? {
              version: !values.version
                ? 'Campo obbligatorio'
                : validatePrimitiveVersion(values.version)
                ? t('addEditStationPage.validation.overVersion')
                : undefined,
              password: !values.password ? 'Campo obbligatorio' : undefined,
              threadNumber: !values.threadNumber ? 'Campo obbligatorio' : undefined,
              protocol: !values.protocol ? 'Campo obbligatorio' : undefined,
              ip: !values.ip ? 'Campo obbligatorio' : undefined,
              port: !values.port
                ? 'Campo obbligatorio'
                : typeof values.port !== 'undefined' && isNaN(values.port)
                ? 'Non Valido, l’input dev’essere un numero'
                : undefined,

              service: !values.service ? 'Campo obbligatorio' : undefined,
              pofService: !values.pofService ? 'Campo obbligatorio' : undefined,
            }
          : null),
      }).filter(([_key, value]) => value)
    );

  const enableSubmit = (values: StationOnCreation) => {
    const isTargetSectionComplete =
      values.targetHost !== '' && values.targetPath !== '' && values.targetPort.toString() !== '';

    const isTargetPofSectionComplete =
      values.targetHostPof !== '' &&
      values.targetPathPof !== '' &&
      values.targetPortPof?.toString() !== '';

    const isTargetSectionEmpty =
      values.targetHost === '' && values.targetPath === '' && values.targetPort?.toString() === '';

    const isTargetPofSectionEmpty =
      values.targetHostPof === '' &&
      values.targetPathPof === '' &&
      values.targetPortPof?.toString() === '';

    const baseConditions =
      values.stationCode !== '' &&
      values.brokerCode !== '' &&
      values.primitiveVersion.toString() !== '' &&
      values.redirectProtocol.toString() !== '' &&
      values.redirectPort.toString() !== '' &&
      values.redirectIp !== '' &&
      values.redirectPath !== '' &&
      values.redirectQueryString !== '';

    const operatorConditions =
      values.version?.toString() !== '' &&
      values.password !== '' &&
      values.threadNumber?.toString() !== '' &&
      values.protocol?.toString() !== '' &&
      values.ip !== '' &&
      values.port?.toString() !== '' &&
      values.service !== '' &&
      values.pofService !== '';

    if (!baseConditions) {
      return false;
    }

    const targetFields = () => {
      if (isTargetPofSectionEmpty && isTargetSectionEmpty) {
        return false;
      } else if (isTargetSectionComplete && isTargetPofSectionComplete) {
        return true;
      } else if (isTargetSectionComplete && isTargetPofSectionEmpty) {
        return true;
      } else if (isTargetPofSectionComplete && isTargetSectionEmpty) {
        return true;
      } else if (isTargetSectionComplete && !isTargetPofSectionEmpty) {
        return false;
      } else if (!isTargetSectionEmpty && isTargetPofSectionComplete) {
        return false;
      } else {
        return false;
      }
    };

    const targetCondition = targetFields();

    if (!operator) {
      return baseConditions && targetCondition;
    } else if (operator && baseConditions && targetCondition && operatorConditions) {
      return true;
    } else {
      return false;
    }
  };

  const redirect = (stCode: string) => {
    if (operator) {
      history.push(generatePath(ROUTES.STATION_DETAIL, { stationId: stCode }));
    } else {
      history.push(ROUTES.STATIONS);
    }
  };

  const submit = async (values: StationOnCreation) => {
    setLoading(true);
    const stationCode = stationDetail?.stationCode ? stationDetail.stationCode : '';
    const stationCode4Redirect =
      formAction === StationFormAction.Create ? stationCodeGenerated : stationCode;

    try {
      const validationUrl = `${window.location.origin}${generatePath(ROUTES.STATION_DETAIL, {
        stationId: formik.values.stationCode,
      })}`;
      if (formAction === StationFormAction.Create || formAction === StationFormAction.Duplicate) {
        await createWrapperStation(values, validationUrl);
        redirect(stationCode4Redirect);
      }

      if (formAction === StationFormAction.Edit) {
        switch (stationDetail?.wrapperStatus) {
          case WrapperStatusEnum.TO_CHECK:
            if (operator) {
              await createStation(values);
              redirect(stationCode4Redirect);
            } else {
              await updateWrapperStationToCheck(values, validationUrl);
              redirect(stationCode4Redirect);
            }
            break;
          case WrapperStatusEnum.APPROVED:
          case WrapperStatusEnum.TO_CHECK_UPDATE:
            if (operator) {
              await updateStation(values, stationCode);
              redirect(stationCode4Redirect);
            } else {
              await updateWrapperStationToCheckUpdate(values, validationUrl);
              redirect(stationCode4Redirect);
            }
            break;
          case WrapperStatusEnum.TO_FIX:
            await updateWrapperStationToCheck(values, validationUrl);
            redirect(stationCode4Redirect);
            break;
          default:
            redirect(stationCode4Redirect);
            break;
        }
      }
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
    } else {
      setShowConfirmModal(false);
    }
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
          {t('stationDetailPageValidation.configuration.subtitle')}
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
              {operator && formAction !== StationFormAction.Create ? (
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="brokerCode"
                    name="brokerCode"
                    label={t('addEditStationPage.addForm.fields.brokerCode')}
                    placeholder={t('addEditStationPage.addForm.fields.brokerCode')}
                    size="small"
                    value={formik.values.brokerCode}
                    disabled
                    onChange={(e) => formik.handleChange(e)}
                    error={formik.touched.brokerCode && Boolean(formik.errors.brokerCode)}
                    helperText={formik.touched.brokerCode && formik.errors.brokerCode}
                    inputProps={{
                      'data-testid': 'broker-code-test',
                    }}
                  />
                </Grid>
              ) : null}
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="primitiveVersion"
                  name="primitiveVersion"
                  label={t('addEditStationPage.addForm.fields.primitiveVersion')}
                  placeholder={t('addEditStationPage.addForm.fields.primitiveVersion')}
                  size="small"
                  disabled={formAction !== StationFormAction.Create || operator}
                  InputLabelProps={{ shrink: formik.values.primitiveVersion ? true : false }}
                  value={formik.values.primitiveVersion === 0 ? '' : formik.values.primitiveVersion}
                  onChange={(e) => handleChangeNumberOnly(e, 'primitiveVersion', formik)}
                  error={formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)}
                  helperText={formik.touched.primitiveVersion && formik.errors.primitiveVersion}
                  inputProps={{
                    type: 'number',
                    min: 1,
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
                    defaultValue={formik.values.protocol}
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
                  label={t('addEditStationPage.addForm.fields.targetHost')}
                  placeholder={t('addEditStationPage.addForm.fields.targetHost')}
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
                  label={t('addEditStationPage.addForm.fields.targetPath')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPath')}
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
                  type="number"
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
                  InputLabelProps={{ shrink: formik.values.targetHostPof ? true : false }}
                  label={t('addEditStationPage.addForm.fields.targetHostPof')}
                  placeholder={t('addEditStationPage.addForm.fields.targetHostPof')}
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
                  InputLabelProps={{ shrink: formik.values.targetPathPof ? true : false }}
                  label={t('addEditStationPage.addForm.fields.targetPathPof')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPathPof')}
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
                  type="number"
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
                  label={t('addEditStationPage.addForm.fields.targetPortPof')}
                  placeholder={t('addEditStationPage.addForm.fields.targetPortPof')}
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

      {operator && formAction !== StationFormAction.Create ? (
        <AddEditStationFormValidation
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
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
          >
            {operator
              ? t('addEditStationPage.addForm.continueButton')
              : t('addEditStationPage.addForm.confirmButton')}
          </Button>
        </Stack>
      </Stack>
      <ConfirmModal
        title={
          operator
            ? t('addEditStationPage.confirmModal.titleOperator')
            : t('addEditStationPage.confirmModal.title')
        }
        message={
          operator ? (
            <Trans i18nKey="addEditStationPage.confirmModal.messageStationOperator">
              L’ente riceverà una notifica di conferma attivazione della stazione.
              <br />
            </Trans>
          ) : (
            <Trans i18nKey="addEditStationPage.confirmModal.messageStation">
              Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
              approvare. Riceverai una notifica a revisione completata.
              <br />
            </Trans>
          )
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={
          operator
            ? t('addEditStationPage.confirmModal.confirmButtonOpe')
            : t('addEditStationPage.confirmModal.confirmButton')
        }
        onCloseLabel={t('addEditStationPage.confirmModal.cancelButton')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
        isOperator={undefined}
      />
    </>
  );
};

export default AddEditStationForm;
