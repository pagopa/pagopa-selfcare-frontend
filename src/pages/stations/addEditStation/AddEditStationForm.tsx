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
import {
  GPDConfigs,
  IGPDConfig,
  INewConnConfig,
  NewConnConfigs,
  StationCategory,
  StationFormAction,
  StationOnCreation,
} from '../../../model/Station';
import { isOperator } from '../../components/commonFunctions';
import { WrapperStatusEnum } from '../../../api/generated/portal/StationDetailResource';
import {
  alterStationValuesToFitCategories,
  getStationCategoryFromDetail,
  splitURL,
} from '../../../utils/station-utils';
import { ENV } from '../../../utils/env';
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
  const env: string = ENV.ENV;
  const gpdAddresses = GPDConfigs[ENV.ENV as keyof IGPDConfig];
  const forwarderAddresses = NewConnConfigs[ENV.ENV as keyof INewConnConfig];
  const [newConn, setNewConn] = useState<boolean>(false);
  const [gdp, setGDP] = useState<boolean>(false);

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
  }, [stationCodeCleaner]);

  useEffect(() => {
    if (stationDetail) {
      const category = getStationCategoryFromDetail(stationDetail, env);
      if (category === StationCategory.AsyncGPD) {
        setGDP(true);
      }
      if (category === StationCategory.SyncNewConn) {
        setNewConn(true);
      }
    }
  }, [stationDetail]);

  const initialFormData = (detail?: StationOnCreation) =>
    detail
      ? {
          brokerCode: detail.brokerCode ?? '',
          enabled: detail.enabled,
          ip: detail.ip ?? '',
          password: detail.password ?? '',
          port: detail.port ?? 443,
          primitiveVersion: detail.primitiveVersion ?? 2,
          protocol: detail.protocol ?? undefined,
          proxyConcat: `${detail.proxyHost ?? ''}${
            detail.proxyPort ? ':'.concat(detail.proxyPort.toString()) : ''
          }`,
          proxyHost: detail.proxyHost ?? '',
          proxyPort: detail.proxyPort ?? undefined,
          proxyEnabled: detail.proxyEnabled ?? false,
          redirectIp: detail.redirectIp ?? '',
          redirectPath: detail.redirectPath ?? '',
          redirectPort: detail.redirectPort ?? 443,
          redirectProtocol: detail.redirectProtocol ?? '',
          redirectQueryString: detail.redirectQueryString ?? '',
          service: detail.service ?? '',
          stationCode:
            formAction === StationFormAction.Duplicate
              ? stationCodeGenerated
              : detail.stationCode ?? '',
          status: detail?.wrapperStatus,
          targetHost: detail.targetHost ?? '',
          targetPath: detail.targetPath ?? '',
          targetPort: detail.targetPort ?? undefined,
          targetConcat: `${detail.targetHost ?? ''}${
            detail.targetPort && detail.targetPort !== 443
              ? ':'.concat(detail.targetPort.toString())
              : ''
          }${detail.targetPath ?? ''}`,

          timeoutA: detail.timeoutA ?? 15,
          timeoutB: detail.timeoutB ?? 30,
          timeoutC: detail.timeoutC ?? 120,
          version: detail.version ?? undefined,
          newConnConcat:
            Object.entries(forwarderAddresses)
              .map(([key, value]) => value)
              .find((d) =>
                detail.service && detail.service !== '' && detail.service !== '/'
                  ? d.includes(detail.service)
                  : false
              ) ?? '',
          gdpConcat:
            Object.entries(gpdAddresses)
              .map(([key, value]) => value)
              .find((gpd) =>
                detail.service && detail.service !== '' && detail.service !== '/'
                  ? gpd.includes(detail.service)
                  : false
              ) ?? '',
          threadNumber: 1,
        }
      : {
          brokerCode: brokerCodeCleaner,
          ip: '',
          password: '',
          port: 443,
          primitiveVersion: 2,
          protocol: undefined,
          proxyConcat: '',
          proxyHost: '',
          proxyPort: undefined,
          proxyEnabled: false,
          redirectIp: '',
          redirectPath: '',
          redirectPort: 443,
          redirectProtocol: RedirectProtocolEnum.HTTPS,
          redirectQueryString: '',
          service: '',
          stationCode: stationCodeGenerated,
          status: StatusEnum.TO_CHECK,
          targetConcat: '',
          targetHost: '',
          targetPath: '',
          targetPort: 443,
          timeoutA: 15,
          timeoutB: 30,
          timeoutC: 120,
          version: stationDetail?.version ?? 0,
          newConnConcat: '',
          gdpConcat: '',
          threadNumber: 1,
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

  const validateURL = (urlToValidate: string) => {
    if (urlToValidate === '') {
      return undefined;
    }
    try {
      const url = new URL(urlToValidate);
      // eslint-disable-next-line sonarjs/prefer-single-boolean-return
      if (!(url.protocol.toString() === 'http:' || url.protocol.toString() === 'https:')) {
        return 'Protocollo non valido';
      }
      return undefined;
    } catch (e) {
      console.error(e);
      return 'URL non valido';
    }
  };

  const validate = (values: StationOnCreation) =>
    Object.fromEntries(
      Object.entries({
        ...{
          stationCode: !values.stationCode
            ? t('addEditStationPage.validation.requiredField')
            : undefined,
          brokerCode:
            operator && formAction !== StationFormAction.Create
              ? ''
              : !values.brokerCode
              ? t('addEditStationPage.validation.requiredField')
              : '',
          primitiveVersion: !values.primitiveVersion
            ? t('addEditStationPage.validation.requiredField')
            : validatePrimitiveVersion(values.primitiveVersion)
            ? t('addEditStationPage.validation.overVersion')
            : undefined,
          targetConcat: validateURL(values.targetConcat),
        },
        ...(operator && formAction !== StationFormAction.Create
          ? {
              version: !values.version
                ? 'Campo obbligatorio'
                : validatePrimitiveVersion(values.version)
                ? t('addEditStationPage.validation.overVersion')
                : undefined,
              password: !values.password ? 'Campo obbligatorio' : undefined,
              timeoutA: !values.timeoutA ? 'Campo obbligatorio' : undefined,
              timeoutB: !values.timeoutB ? 'Campo obbligatorio' : undefined,
              timeoutC: !values.timeoutC ? 'Campo obbligatorio' : undefined,
              gdpConcat: gdp && values.gdpConcat === '' ? 'Campo obbligatorio' : undefined,
              newConnConcat:
                newConn && values.newConnConcat === '' ? 'Campo obbligatorio' : undefined,
            }
          : null),
      }).filter(([_key, value]) => value)
    );

  const enableSubmit = (values: StationOnCreation) => {
    const baseConditions =
      values.stationCode !== '' &&
      values.brokerCode !== '' &&
      values.primitiveVersion.toString() !== '';

    const operatorConditions = values.version?.toString() !== '' && values.password !== '';

    if (!baseConditions) {
      return false;
    }

    if (!operator) {
      return baseConditions;
    } else if (operator && baseConditions && operatorConditions) {
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

  const submit = async (valuesFromForm: StationOnCreation) => {
    setLoading(true);
    const stationCode = stationDetail?.stationCode ? stationDetail.stationCode : '';
    const stationCode4Redirect =
      formAction !== StationFormAction.Edit ? stationCodeGenerated : stationCode;

    const values = alterStationValuesToFitCategories(valuesFromForm, env);

    try {
      const validationUrl = `${window.location.origin}${generatePath(ROUTES.STATION_DETAIL, {
        stationId: formik.values.stationCode,
      })}`;
      if (formAction === StationFormAction.Create || formAction === StationFormAction.Duplicate) {
        await createWrapperStation(values);
        redirect(stationCode4Redirect);
      }

      if (formAction === StationFormAction.Edit) {
        switch (stationDetail?.wrapperStatus) {
          case WrapperStatusEnum.TO_CHECK:
            if (operator) {
              await createStation(values);
              redirect(stationCode4Redirect);
            } else {
              await updateWrapperStationToCheck(values);
              redirect(stationCode4Redirect);
            }
            break;
          case WrapperStatusEnum.APPROVED:
          case WrapperStatusEnum.TO_CHECK_UPDATE:
            if (operator) {
              await updateStation(values, stationCode);
              redirect(stationCode4Redirect);
            } else {
              await updateWrapperStationToCheckUpdate(values);
              redirect(stationCode4Redirect);
            }
            break;
          case WrapperStatusEnum.TO_FIX:
            await updateWrapperStationToCheck(values);
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
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<StationOnCreation>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, Number(e.target.value));
    }
  };

  const openConfirmModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    if (formik.values.targetConcat && formik.values.targetConcat !== '') {
      const { protocolSplit, hostSplit, portSplit, pathSplit } = splitURL(
        formik.values.targetConcat
      );

      formik
        .setValues({
          ...formik.values,
          targetHost: `${protocolSplit ? protocolSplit + '//' : ''}${hostSplit}`,
          targetPort: portSplit > 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80,
          targetPath: pathSplit,
        })
        .catch((e) => console.error(e));
    }

    if (formik.values.targetConcat === '') {
      formik
        .setValues({
          ...formik.values,
          targetHost: '',
          targetPort: 443,
          targetPath: '',
        })
        .catch((e) => console.error(e));
    }
  }, [formik.values.targetConcat]);

  useEffect(() => {
    if (formik.values.proxyConcat && formik.values.proxyConcat !== '') {
      const { protocolSplit, hostSplit, portSplit } = splitURL(formik.values.proxyConcat);

      formik
        .setValues({
          ...formik.values,
          proxyHost: `${protocolSplit ? protocolSplit + '//' : ''}${hostSplit}`,
          proxyPort: portSplit !== 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80,
          proxyEnabled: true,
        })
        .catch((e) => console.error(e));
    }
  }, [formik.values.proxyConcat]);

  useEffect(() => {
    void formik.validateForm();
  }, [gdp, newConn]);

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
                  required
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
                    required
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
                  disabled={!operator}
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
                  required
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <AddEditStationFormSectionTitle
              title={t('addEditStationPage.addForm.sections.targetService')}
              icon={<MenuBook />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetConcat"
                  name="targetConcat"
                  label={t('addEditStationPage.addForm.fields.targetConcat')}
                  placeholder={t('addEditStationPage.addForm.fields.targetConcat')}
                  size="small"
                  value={formik.values.targetConcat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.targetConcat && Boolean(formik.errors.targetConcat)}
                  helperText={formik.touched.targetConcat && formik.errors.targetConcat}
                  inputProps={{
                    'data-testid': 'target-targetConcat-test',
                  }}
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
          newConn={newConn}
          setNewConn={setNewConn}
          gdp={gdp}
          setGDP={setGDP}
        />
      ) : (
        <></>
      )}
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={goBack}
            data-testid="cancel-button-test"
          >
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
            data-testid="confirm-button-test"
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
      />
    </>
  );
};

export default AddEditStationForm;
