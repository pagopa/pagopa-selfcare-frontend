/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import {ButtonNaked, theme} from '@pagopa/mui-italia';
import {FormikProps, useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {Box} from '@mui/system';
import CircularProgressIcon from '@mui/material/CircularProgress';
import {
    Badge as BadgeIcon,
    Check as CheckIcon,
    MenuBook,
    NorthEast as NorthEastIcon,
    Cable as CableIcon,
    CallMade,
} from '@mui/icons-material';
import {generatePath, useHistory} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useFlagValue} from '../../../hooks/useFeatureFlags';
import {RedirectProtocolEnum, StatusEnum} from '../../../api/generated/portal/StationDetailsDto';
import {
    TestResultEnum,
    TestStationResource,
} from '../../../api/generated/portal/TestStationResource';
import ROUTES from '../../../routes';
import AddEditStationFormSectionTitle from '../addEditStation/AddEditStationFormSectionTitle';
import ConfirmModal from '../../components/ConfirmModal';
import {
    createStation,
    createWrapperStation,
    getStationCodeV2,
    testStation,
    updateStation,
    updateWrapperStationToCheck,
    updateWrapperStationToCheckUpdate,
} from '../../../services/stationService';
import {
    LOADING_TASK_GENERATION_STATION_CODE,
    LOADING_TASK_STATION_ADD_EDIT,
} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {
    ConnectionType,
    GPDConfigs,
    IGPDConfig,
    INewConnConfig,
    NewConnConfigs,
    StationCategory,
    StationFormAction,
    StationOnCreation,
} from '../../../model/Station';
import {
    alterStationValuesToFitCategories,
    getStationCategoryFromDetail,
    splitURL,
} from '../../../utils/station-utils';
import {ENV} from '../../../utils/env';
import {useUserRole} from '../../../hooks/useUserRole';
import {
    StationDetailResource,
    WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import {TestStationTypeEnum} from '../../../api/generated/portal/StationTestDto';
import AddEditStationFormValidation from './components/AddEditStationFormValidation';

type Props = {
<<<<<<< HEAD
<<<<<<< HEAD
    stationDetail?: StationDetailResource;
    formAction: string;
=======
  stationDetail?: StationDetailResource;
  formAction: string;
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
=======
    stationDetail?: StationDetailResource;
    formAction: string;
>>>>>>> 3f32cfc3 (Formatting (#542))
};

const ConnectionRadioLabel = ({type}: { type: ConnectionType }) => {
    const {t} = useTranslation();
    return (
        <>
            {t(`addEditStationPage.addForm.fields.connectionRadio.${type}.label`)}
            <Typography color="action.active">
                {t(`addEditStationPage.addForm.fields.connectionRadio.${type}.sublabel`)}
            </Typography>
        </>
    );
};

const getDefaultConnectionType = (stationDetail?: StationDetailResource) => {
    if (stationDetail?.isConnectionSync) {
        return ConnectionType.SYNC;
    }
    return ConnectionType.ASYNC;
};

const componentPath = 'addEditStationPage.addForm';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
const AddEditStationForm = ({stationDetail, formAction}: Props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const addError = useErrorDispatcher();
    const setLoading = useLoading(LOADING_TASK_STATION_ADD_EDIT);
    const setLoadingGeneration = useLoading(LOADING_TASK_GENERATION_STATION_CODE);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const [stationCodeGenerated, setStationCodeGenerated] = useState('');
    const stationCodeCleaner = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';
    const brokerCodeCleaner = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';
    const {userIsPagopaOperator} = useUserRole();
    const env: string = ENV.ENV;
    const gpdAddresses = GPDConfigs[ENV.ENV as keyof IGPDConfig];
    const forwarderAddresses = NewConnConfigs[ENV.ENV as keyof INewConnConfig];
    const [newConn, setNewConn] = useState<boolean>(false);
    const [gdp, setGDP] = useState<boolean>(false);
    const [testRtResult, setTestRtResult] = useState<TestStationResource>();
    const [validatingRt, setValidatingRt] = useState<boolean>(false);
<<<<<<< HEAD
=======
const AddEditStationForm = ({ stationDetail, formAction }: Props) => {
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
  const { userIsPagopaOperator } = useUserRole();
  const env: string = ENV.ENV;
  const gpdAddresses = GPDConfigs[ENV.ENV as keyof IGPDConfig];
  const forwarderAddresses = NewConnConfigs[ENV.ENV as keyof INewConnConfig];
  const [newConn, setNewConn] = useState<boolean>(false);
  const [gdp, setGDP] = useState<boolean>(false);
  const [testRtResult, setTestRtResult] = useState<TestStationResource>();
  const [validatingRt, setValidatingRt] = useState<boolean>(false);
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
=======
>>>>>>> 3f32cfc3 (Formatting (#542))

    const [testRedirectResult, setTestRedirectResult] = useState<TestStationResource>();
    const [validatingRedirect, setValidatingRedirect] = useState<boolean>(false);

    const [testPofResult, setTestPofResult] = useState<TestStationResource>();
    const [validatingPof, setValidatingPof] = useState<boolean>(false);

    const [connectionType, setConnectionType] = useState<ConnectionType>(
        getDefaultConnectionType(stationDetail)
    );
<<<<<<< HEAD

    const isTesting = useFlagValue('test-stations');

    const emptyStationData = (detail?: StationDetailResource) => ({
        brokerCode: brokerCodeCleaner,
        ip: '',
        password: '',
        port: undefined,
        primitiveVersion: 2,
        protocol: undefined,
        proxyConcat: '',
        proxyHost: '',
        proxyPort: undefined,
        proxyEnabled: false,
        redirectConcat: '',
        redirectIp: '',
        redirectPath: '',
        redirectPort: undefined,
        redirectProtocol: RedirectProtocolEnum.HTTPS,
        redirectQueryString: '',
        service: '',
        stationCode: detail?.stationCode ?? stationCodeGenerated,
        status: StatusEnum.TO_CHECK,
        targetConcat: '',
        targetHost: '',
        targetPath: '',
        targetPort: undefined,
        targetPofConcat: '',
        timeoutA: 7,
        timeoutB: 30,
        timeoutC: 120,
        version: 0,
        newConnConcat: '',
        gdpConcat: '',
        threadNumber: 1,
    });
    const mapStationDetailToCreation = (detail: StationDetailResource) => ({
        brokerCode: detail.brokerCode ?? '',
        enabled: detail.enabled,
        ip: detail.ip ?? '',
        password: detail.password ?? '',
        port: detail.port ?? 443,
        protocol: detail.protocol ?? undefined,
        proxyConcat: `${detail.proxyHost ?? ''}${
            detail.proxyPort ? ':'.concat(detail.proxyPort.toString()) : ''
        }`,
        proxyHost: detail.proxyHost ?? '',
        proxyPort: detail.proxyPort ?? undefined,
        proxyEnabled: detail.proxyEnabled ?? false,

        service: detail.service ?? '',
        stationCode:
            formAction === StationFormAction.Duplicate ? stationCodeGenerated : detail.stationCode ?? '',
        status: detail?.wrapperStatus,

        timeoutA: detail.timeoutA ?? 7,
        timeoutB: detail.timeoutB ?? 30,
        timeoutC: detail.timeoutC ?? 120,
        version: detail.version ?? undefined,
        newConnConcat:
            Object.entries(forwarderAddresses)
                .map(([key, value]) => value)
                .find((d) =>
                    detail.pofService && detail.pofService !== '' && detail.pofService !== '/'
                        ? d.includes(detail.pofService)
                        : false
                ) ?? '',
        gdpConcat:
            Object.entries(gpdAddresses)
                .map(([key, value]) => value)
                .find((gpd) =>
                    detail.pofService && detail.pofService !== '' && detail.pofService !== '/'
                        ? gpd.includes(detail.pofService)
                        : false
                ) ?? '',
        threadNumber: 1,

        // fields for redirect endpoint
        redirectProtocol: detail.redirectProtocol ?? '',
        redirectIp: detail.redirectIp ?? '',
        redirectPort: detail.redirectPort ?? undefined,
        redirectPath: detail.redirectPath ?? '',
        redirectQueryString: detail.redirectQueryString ?? '',
        redirectConcat:
            detail.redirectPath && detail.redirectProtocol
                ? `${detail.redirectProtocol.toLowerCase()}://${detail.redirectIp}${
                    detail.redirectPort ? ':'.concat(detail.redirectPort.toString()) : ''
                }${detail.redirectPath ?? ''}${
                    detail.redirectQueryString ? '?' + String(detail.redirectQueryString) : ''
                }`
                : '',

        // fields for RT endpoint
        targetHost: detail.targetHost ?? '',
        targetPath: detail.targetPath ?? '',
        targetPort: detail.targetPort ?? '',
        targetConcat: detail.targetHost
            ? `${detail.targetHost ?? ''}${
                detail.targetPort ? ':'.concat(detail.targetPort.toString()) : ''
            }${detail.targetPath ?? ''}`
            : '',

        targetHostPof: detail.targetHostPof,
        targetPathPof: detail.targetPathPof,
        targetPortPof: detail.targetPortPof,
        primitiveVersion: detail.primitiveVersion ?? 2,
        targetPofConcat: detail.targetHostPof
            ? `${detail.targetHostPof ?? ''}${
                detail.targetPortPof ? ':'.concat(detail.targetPortPof.toString()) : ''
            }${detail.targetPathPof ?? ''}`
            : '',
    });
    const initialFormData = (detail?: StationDetailResource) =>
        detail ? mapStationDetailToCreation(detail) : emptyStationData();

    const inputGroupStyle = {
        borderRadius: 1,
        border: 1,
        borderColor: theme.palette.divider,
        p: 3,
        mb: 3,
    };

=======

    const isTesting = useFlagValue('test-stations');

    const emptyStationData = (detail?: StationDetailResource) => ({
        brokerCode: brokerCodeCleaner,
        ip: '',
        password: '',
        port: undefined,
        primitiveVersion: 2,
        protocol: undefined,
        proxyConcat: '',
        proxyHost: '',
        proxyPort: undefined,
        proxyEnabled: false,
        redirectConcat: '',
        redirectIp: '',
        redirectPath: '',
        redirectPort: undefined,
        redirectProtocol: RedirectProtocolEnum.HTTPS,
        redirectQueryString: '',
        service: '',
        stationCode: detail?.stationCode ?? stationCodeGenerated,
        status: StatusEnum.TO_CHECK,
        targetConcat: '',
        targetHost: '',
        targetPath: '',
        targetPort: undefined,
        targetPofConcat: '',
        timeoutA: 7,
        timeoutB: 30,
        timeoutC: 120,
        version: 0,
        newConnConcat: '',
        gdpConcat: '',
        threadNumber: 1,
    });
    const mapStationDetailToCreation = (detail: StationDetailResource) => ({
        brokerCode: detail.brokerCode ?? '',
        enabled: detail.enabled,
        ip: detail.ip ?? '',
        password: detail.password ?? '',
        port: detail.port ?? 443,
        protocol: detail.protocol ?? undefined,
        proxyConcat: `${detail.proxyHost ?? ''}${
            detail.proxyPort ? ':'.concat(detail.proxyPort.toString()) : ''
        }`,
        proxyHost: detail.proxyHost ?? '',
        proxyPort: detail.proxyPort ?? undefined,
        proxyEnabled: detail.proxyEnabled ?? false,

        service: detail.service ?? '',
        stationCode:
            formAction === StationFormAction.Duplicate ? stationCodeGenerated : detail.stationCode ?? '',
        status: detail?.wrapperStatus,

        timeoutA: detail.timeoutA ?? 7,
        timeoutB: detail.timeoutB ?? 30,
        timeoutC: detail.timeoutC ?? 120,
        version: detail.version ?? undefined,
        newConnConcat:
            Object.entries(forwarderAddresses)
                .map(([key, value]) => value)
                .find((d) =>
                    detail.pofService && detail.pofService !== '' && detail.pofService !== '/'
                        ? d.includes(detail.pofService)
                        : false
                ) ?? '',
        gdpConcat:
            Object.entries(gpdAddresses)
                .map(([key, value]) => value)
                .find((gpd) =>
                    detail.pofService && detail.pofService !== '' && detail.pofService !== '/'
                        ? gpd.includes(detail.pofService)
                        : false
                ) ?? '',
        threadNumber: 1,

        // fields for redirect endpoint
        redirectProtocol: detail.redirectProtocol ?? '',
        redirectIp: detail.redirectIp ?? '',
        redirectPort: detail.redirectPort ?? undefined,
        redirectPath: detail.redirectPath ?? '',
        redirectQueryString: detail.redirectQueryString ?? '',
        redirectConcat:
            detail.redirectPath && detail.redirectProtocol
                ? `${detail.redirectProtocol.toLowerCase()}://${detail.redirectIp}${
                    detail.redirectPort ? ':'.concat(detail.redirectPort.toString()) : ''
                }${detail.redirectPath ?? ''}${
                    detail.redirectQueryString ? '?' + String(detail.redirectQueryString) : ''
                }`
                : '',

        // fields for RT endpoint
        targetHost: detail.targetHost ?? '',
        targetPath: detail.targetPath ?? '',
        targetPort: detail.targetPort ?? '',
        targetConcat: detail.targetHost
            ? `${detail.targetHost ?? ''}${
                detail.targetPort ? ':'.concat(detail.targetPort.toString()) : ''
            }${detail.targetPath ?? ''}`
            : '',

        targetHostPof: detail.targetHostPof,
        targetPathPof: detail.targetPathPof,
        targetPortPof: detail.targetPortPof,
        primitiveVersion: detail.primitiveVersion ?? 2,
        targetPofConcat: detail.targetHostPof
            ? `${detail.targetHostPof ?? ''}${
                detail.targetPortPof ? ':'.concat(detail.targetPortPof.toString()) : ''
            }${detail.targetPathPof ?? ''}`
            : '',
    });
    const initialFormData = (detail?: StationDetailResource) =>
        detail ? mapStationDetailToCreation(detail) : emptyStationData();

    const inputGroupStyle = {
        borderRadius: 1,
        border: 1,
        borderColor: theme.palette.divider,
        p: 3,
        mb: 3,
    };

>>>>>>> 3f32cfc3 (Formatting (#542))
    const validatePrimitiveVersion = (primitiveVersion: number) => {
        if (primitiveVersion) {
            return !(primitiveVersion > 0 && primitiveVersion <= 2);
        }
        return false;
    };

    const validateURL = (urlToValidate: string, checkProtocol: boolean) => {
        if (urlToValidate === '') {
            return undefined;
        }
        try {
            const url = new URL(urlToValidate);
            // eslint-disable-next-line sonarjs/prefer-single-boolean-return
            if (
                checkProtocol &&
                !(url.protocol.toString() === 'http:' || url.protocol.toString() === 'https:')
            ) {
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
                        userIsPagopaOperator && formAction !== StationFormAction.Create
                            ? ''
                            : !values.brokerCode
                                ? t('addEditStationPage.validation.requiredField')
                                : '',
                    primitiveVersion: !values.primitiveVersion
                        ? t('addEditStationPage.validation.requiredField')
                        : validatePrimitiveVersion(values.primitiveVersion)
                            ? t('addEditStationPage.validation.overVersion')
                            : undefined,
                    targetConcat: validateURL(values.targetConcat, false),
                    redirectConcat: validateURL(values.redirectConcat, true),
                    targetPofConcat: validateURL(values.targetPofConcat, false),
                },
                ...(userIsPagopaOperator && formAction !== StationFormAction.Create
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
            values.primitiveVersion.toString() !== '' &&
            (connectionType === ConnectionType.SYNC
                ? values.targetConcat || values.redirectConcat
                    ? values.targetConcat && values.redirectConcat
                    : values.targetPofConcat
                : true);
        const operatorConditions = values.version?.toString() !== '' && values.password !== '';

        if (!baseConditions) {
            return false;
        }

        if (!userIsPagopaOperator) {
            return baseConditions;
        } else if (userIsPagopaOperator && baseConditions && operatorConditions) {
            return true;
        } else {
            return false;
        }
    };

    const redirect = (stCode: string) => {
        if (userIsPagopaOperator) {
            history.push(generatePath(ROUTES.STATION_DETAIL, {stationId: stCode}));
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
            // eslint-disable-next-line functional/immutable-data
            values.validationUrl = validationUrl;

            if (formAction === StationFormAction.Create || formAction === StationFormAction.Duplicate) {
                await createWrapperStation(values);
                redirect(stationCode4Redirect);
            }

            if (formAction === StationFormAction.Edit) {
                switch (stationDetail?.wrapperStatus) {
                    case WrapperStatusEnum.TO_CHECK:
                        if (userIsPagopaOperator) {
                            await createStation(values);
                            redirect(stationCode4Redirect);
                        } else {
                            await updateWrapperStationToCheck(values);
                            redirect(stationCode4Redirect);
                        }
                        break;
                    case WrapperStatusEnum.APPROVED:
                    case WrapperStatusEnum.TO_CHECK_UPDATE:
                        if (userIsPagopaOperator) {
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
                displayableTitle: t('general.errorTitle'),
                displayableDescription: t('addEditStationPage.errorMessageDesc'),
                component: 'Toast',
            });
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik<any>({
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

    const validateRtEndpoint = () => {
        const rtValidationUrl = validateURL(formik.values.targetConcat, false);
        if (rtValidationUrl !== undefined) {
            formik.setErrors({
                ...formik.errors,
                targetConcat: rtValidationUrl,
            });
        } else {
            setValidatingRt(true);
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.targetConcat
            );
            testStation(
                protocolSplit,
                hostSplit,
                portSplit > 0 ? portSplit : 443,
                pathSplit,
                TestStationTypeEnum.PA_INVIA_RT
            )
                .then((item: TestStationResource) => {
                    setTestRtResult(item);
                })
                .finally(() => {
                    setValidatingRt(false);
                });
        }
    };

    const validateRedirectEndpoint = () => {
        const redirectValidationUrl = validateURL(formik.values.redirectConcat, false);
        if (redirectValidationUrl !== undefined) {
            formik.setErrors({
                ...formik.errors,
                redirectConcat: redirectValidationUrl,
            });
        } else {
            setValidatingRedirect(true);
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.redirectConcat
            );
            testStation(
                protocolSplit,
                hostSplit,
                portSplit > 0 ? portSplit : protocolSplit.includes('https') ? 443 : 80,
                pathSplit,
                TestStationTypeEnum.PA_REDIRECT
            )
                .then((item: TestStationResource) => {
                    setTestRedirectResult(item);
                })
                .finally(() => {
                    setValidatingRedirect(false);
                });
        }
    };

    const validatePofEndpoint = () => {
        const pofValidationUrl = validateURL(formik.values.targetPofConcat, false);
        if (pofValidationUrl !== undefined) {
            formik.setErrors({
                ...formik.errors,
                targetPofConcat: pofValidationUrl,
            });
        } else {
            setValidatingPof(true);
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.targetPofConcat
            );
            testStation(
                protocolSplit,
                hostSplit,
                portSplit > 0 ? portSplit : 443,
                pathSplit,
                TestStationTypeEnum.PA_VERIFY
            )
                .then((item: TestStationResource) => {
                    setTestPofResult(item);
                })
                .finally(() => {
                    setValidatingPof(false);
                });
        }
    };

    async function handleChangeConnectionType(value: string) {
        setConnectionType(value as ConnectionType);

        if (value === ConnectionType.ASYNC) {
            await formik.setValues(emptyStationData(stationDetail));
        } else {
            await formik.setValues(initialFormData(stationDetail));
        }
    }

    useEffect(() => {
        if (formAction !== StationFormAction.Edit) {
            setLoadingGeneration(true);
            getStationCodeV2(stationCodeCleaner)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
    useEffect(() => {
        if (stationDetail) {
            setConnectionType(getDefaultConnectionType(stationDetail));
            const category = getStationCategoryFromDetail(stationDetail, env);
            if (category === StationCategory.AsyncGPD) {
                setGDP(true);
            }
            if (category === StationCategory.SyncNewConn) {
                setNewConn(true);
            }
        }
    }, [stationDetail]);
<<<<<<< HEAD
=======
  useEffect(() => {
    if (stationDetail) {
      setConnectionType(getDefaultConnectionType(stationDetail));
      const category = getStationCategoryFromDetail(stationDetail, env);
      if (category === StationCategory.AsyncGPD) {
        setGDP(true);
      }
      if (category === StationCategory.SyncNewConn) {
        setNewConn(true);
      }
    }
  }, [stationDetail]);
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
=======
>>>>>>> 3f32cfc3 (Formatting (#542))

    useEffect(() => {
        setTestRtResult(undefined);
        if (formik.values.targetConcat && formik.values.targetConcat !== '') {
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.targetConcat
            );

            formik
                .setValues({
                    ...formik.values,
                    targetHost: hostSplit ?? '',
                    targetPort: portSplit > 0 ? portSplit : protocolSplit === 'https' ? 443 : 80,
                    targetPath: pathSplit,
                })
                .catch((e) => console.error(e));
        }
        if (formik.values.targetConcat === '') {
            formik
                .setValues({
                    ...formik.values,
                    targetHost: '',
                    targetPort: undefined,
                    targetPath: '',
                })
                .catch((e) => console.error(e));
        }
    }, [formik.values.targetConcat]);

    useEffect(() => {
        if (
            testRtResult &&
            (testRtResult.testResult === TestResultEnum.ERROR ||
                testRtResult.testResult === TestResultEnum.CERTIFICATE_ERROR)
        ) {
            formik.setErrors({
                ...formik.errors,
                targetConcat: t('addEditStationPage.addFormValidation.testFailed'),
            });
        }
    }, [testRtResult]);

    useEffect(() => {
        if (
            testRedirectResult &&
            (testRedirectResult.testResult === TestResultEnum.ERROR ||
                testRedirectResult.testResult === TestResultEnum.CERTIFICATE_ERROR)
        ) {
            formik.setErrors({
                ...formik.errors,
                redirectConcat: t('addEditStationPage.addFormValidation.testFailed'),
            });
        }
    }, [testRedirectResult]);

    useEffect(() => {
        if (
            testPofResult &&
            (testPofResult.testResult === TestResultEnum.ERROR ||
                testPofResult.testResult === TestResultEnum.CERTIFICATE_ERROR)
        ) {
            formik.setErrors({
                ...formik.errors,
                targetPofConcat: t('addEditStationPage.addFormValidation.testFailed'),
            });
        }
    }, [testPofResult]);

    useEffect(() => {
        setTestRedirectResult(undefined);
        if (formik.values.redirectConcat && formik.values.redirectConcat !== '') {
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.redirectConcat
            );
            const pathSplitBySearch = pathSplit.split('?');

            formik
                .setValues({
                    ...formik.values,
                    redirectProtocol: protocolSplit
                        ? (protocolSplit.toUpperCase() as RedirectProtocolEnum)
                        : RedirectProtocolEnum.HTTPS.toUpperCase(),
                    redirectIp: hostSplit,
                    redirectPort:
                        portSplit > 0
                            ? portSplit
                            : protocolSplit &&
                            (protocolSplit.toUpperCase() as RedirectProtocolEnum) === RedirectProtocolEnum.HTTPS
                                ? 443
                                : 80,
                    redirectPath: pathSplitBySearch[0] ?? '',
                    redirectQueryString: pathSplitBySearch[1] ?? '',
                })
                .catch((e) => console.error(e));
        }

        if (formik.values.redirectConcat === '') {
            formik
                .setValues({
                    ...formik.values,
                    redirectProtocol: RedirectProtocolEnum.HTTPS.toUpperCase(),
                    redirectIp: '',
                    redirectPort: 443,
                    redirectPath: '',
                    redirectQueryString: '',
                })
                .catch((e) => console.error(e));
        }
    }, [formik.values.redirectConcat]);

    useEffect(() => {
        setTestPofResult(undefined);
        if (formik.values.targetPofConcat && formik.values.targetPofConcat !== '') {
            const {protocolSplit, hostSplit, portSplit, pathSplit} = splitURL(
                formik.values.targetPofConcat
            );

            formik
                .setValues({
                    ...formik.values,
                    targetHostPof: hostSplit ?? '',
                    targetPortPof:
                        portSplit > 0 ? portSplit : protocolSplit && protocolSplit === 'https' ? 443 : 80,
                    targetPathPof: pathSplit,
                })
                .catch((e) => console.error(e));
        }

        if (formik.values.targetPofConcat === '') {
            formik
                .setValues({
                    ...formik.values,
                    targetHostPof: '',
                    targetPortPof: undefined,
                    targetPathPof: '',
                })
                .catch((e) => console.error(e));
        }
    }, [formik.values.targetPofConcat]);

    useEffect(() => {
        if (formik.values.proxyConcat && formik.values.proxyConcat !== '') {
            if (!formik.values.proxyConcat.startsWith('http')) {
                // eslint-disable-next-line functional/immutable-data
                formik.values.proxyConcat = 'http://'.concat(formik.values.proxyConcat);
            }
            const {protocolSplit, hostSplit, portSplit} = splitURL(formik.values.proxyConcat);

            formik
                .setValues({
                    ...formik.values,
                    proxyHost: `${protocolSplit ? String(protocolSplit) + '://' : ''}${hostSplit}`,
                    proxyPort: portSplit !== 0 ? portSplit : protocolSplit === 'https' ? 443 : 80,
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

                <Box sx={inputGroupStyle}>
                    <Stack direction="row" justifyContent="space-between">
                        <AddEditStationFormSectionTitle
                            title={t(`${componentPath}.sections.connectionType`)}
                            icon={<CableIcon/>}
                            isRequired
                        />
                        <Typography variant="body1" sx={{fontWeight: 'medium'}}>
                            <Link
                                href="https://docs.pagopa.it/sanp/ente-creditore/modalita-dintegrazione"
                                target="_blank"
                                display="flex"
                                alignItems={'center'}
                                sx={{textDecoration: 'none'}}
                            >
                                {t('general.discoverMore')} <CallMade/>
                            </Link>
                        </Typography>
                    </Stack>
                    <Box pl={2} mt={2}>
                        <FormControl>
                            <RadioGroup
                                name="connectionType"
                                row
                                onChange={(e) => handleChangeConnectionType(e?.target?.value)}
                                data-testid="connection-type-radio-group"
                                value={connectionType}
                            >
                                <FormControlLabel
                                    value={ConnectionType.ASYNC}
                                    control={<Radio/>}
                                    label={<ConnectionRadioLabel type={ConnectionType.ASYNC}/>}
                                    sx={{pr: 8}}
                                    disabled={userIsPagopaOperator}
                                />
                                <FormControlLabel
                                    value={ConnectionType.SYNC}
                                    control={<Radio/>}
                                    label={<ConnectionRadioLabel type={ConnectionType.SYNC}/>}
                                    disabled={userIsPagopaOperator}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
<<<<<<< HEAD

                <Box sx={inputGroupStyle}>
                    <AddEditStationFormSectionTitle
                        title={t(`${componentPath}.sections.registry`)}
                        icon={<BadgeIcon/>}
                        isRequired
                    />
                    <Grid container spacing={2} mt={1}>
                        <Grid container item xs={6}>
                            <TextField
                                fullWidth
                                id="stationCode"
                                name="stationCode"
                                label={t(`${componentPath}.fields.stationCode`)}
                                placeholder={t(`${componentPath}.fields.stationCode`)}
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
                        {userIsPagopaOperator && formAction !== StationFormAction.Create ? (
                            <Grid container item xs={6}>
                                <TextField
                                    fullWidth
                                    id="brokerCode"
                                    name="brokerCode"
                                    label={t(`${componentPath}.fields.brokerCode`)}
                                    placeholder={t(`${componentPath}.fields.brokerCode`)}
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
                    </Grid>
                </Box>

                {connectionType === ConnectionType.SYNC && (
                    <>
                        <Box sx={inputGroupStyle} data-testid="model-1-box">
                            <AddEditStationFormSectionTitle
                                title={t(`${componentPath}.sections.modello1`)}
                                icon={<MenuBook/>}
                            />
                            <Grid container item spacing={2} mt={1} justifyContent={'center'}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="targetConcat"
                                        name="targetConcat"
                                        label={t(`${componentPath}.fields.endpointRTConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointRTConcat`)}
                                        size="small"
                                        value={formik.values.targetConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.targetConcat || testRtResult) &&
                                            Boolean(formik.errors.targetConcat)
                                        }
                                        helperText={
                                            (formik.touched.targetConcat || testRtResult) && formik.errors.targetConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'targetConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testRtResult !== undefined &&
                                                    testRtResult.testResult === TestResultEnum.SUCCESS ? (
                                                        <CheckIcon sx={{color: 'success.main'}}/>
                                                    ) : (
                                                        ''
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingRt ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                disabled={
                                                    (testRtResult !== undefined &&
                                                        testRtResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.targetConcat === undefined ||
                                                    formik.values.targetConcat === ''
                                                }
                                                onClick={() => validateRtEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-rt-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2} mt={1} justifyContent={'center'}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="redirectConcat"
                                        name="redirectConcat"
                                        label={t(`${componentPath}.fields.endpointRedirectConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointRedirectConcat`)}
                                        size="small"
                                        value={formik.values.redirectConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.redirectConcat || testRedirectResult) &&
                                            Boolean(formik.errors.redirectConcat)
                                        }
                                        helperText={
                                            (formik.touched.redirectConcat || testRedirectResult) &&
                                            formik.errors.redirectConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'redirectConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testRedirectResult !== undefined &&
                                                    testRedirectResult.testResult === TestResultEnum.SUCCESS ? (
                                                        <CheckIcon sx={{color: 'success.main'}}/>
                                                    ) : (
                                                        ''
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingRedirect ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                hidden={!isTesting}
                                                disabled={
                                                    (testRedirectResult !== undefined &&
                                                        testRedirectResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.redirectConcat === undefined ||
                                                    formik.values.redirectConcat === ''
                                                }
                                                onClick={() => validateRedirectEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-redirect-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={inputGroupStyle} data-testid="model-unique-box">
                            <AddEditStationFormSectionTitle
                                title={t(`${componentPath}.sections.modelloUnico`)}
                                icon={<MenuBook/>}
                            />
                            <Grid container spacing={2} mt={1}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="targetPofConcat"
                                        name="targetPofConcat"
                                        label={t(`${componentPath}.fields.endpointMUConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointMUConcat`)}
                                        size="small"
                                        value={formik.values.targetPofConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.targetPofConcat || testPofResult) &&
                                            Boolean(formik.errors.targetPofConcat)
                                        }
                                        helperText={
                                            (formik.touched.targetPofConcat || testPofResult) &&
                                            formik.errors.targetPofConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'targetPofConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testPofResult !== undefined &&
                                                        testPofResult.testResult === TestResultEnum.SUCCESS && (
                                                            <CheckIcon sx={{color: 'success.main'}}/>
                                                        )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingPof ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                disabled={
                                                    (testPofResult !== undefined &&
                                                        testPofResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.targetPofConcat === undefined ||
                                                    formik.values.targetPofConcat === ''
                                                }
                                                onClick={() => validatePofEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-pof-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={1}>
                                <Grid container item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel size="small" id="primitiveVersionLabel">
                                            {t(`${componentPath}.fields.primitiveVersion`)}
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            type="number"
                                            id="primitiveVersion"
                                            name="primitiveVersion"
                                            labelId='primitiveVersionLabel'
                                            label={t(`${componentPath}.fields.primitiveVersion`)}
                                            placeholder={t(`${componentPath}.fields.primitiveVersion`)}
                                            size="small"
                                            value={
                                                formik.values.primitiveVersion === 0 ? '' : formik.values.primitiveVersion
                                            }
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)
                                            }
                                            inputProps={{
                                                'data-testid': 'primitive-version-test',
                                            }}
                                        >
                                            {Object.entries([1, 2]).map(([key, value]) => (
                                                <MenuItem
                                                    key={key}
                                                    selected={
                                                        formik.values.primitiveVersion &&
                                                        value === formik.values.primitiveVersion
                                                    }
                                                    value={value}
                                                >
                                                    {`${value}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </Paper>

=======

                <Box sx={inputGroupStyle}>
                    <AddEditStationFormSectionTitle
                        title={t(`${componentPath}.sections.registry`)}
                        icon={<BadgeIcon/>}
                        isRequired
                    />
                    <Grid container spacing={2} mt={1}>
                        <Grid container item xs={6}>
                            <TextField
                                fullWidth
                                id="stationCode"
                                name="stationCode"
                                label={t(`${componentPath}.fields.stationCode`)}
                                placeholder={t(`${componentPath}.fields.stationCode`)}
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
                        {userIsPagopaOperator && formAction !== StationFormAction.Create ? (
                            <Grid container item xs={6}>
                                <TextField
                                    fullWidth
                                    id="brokerCode"
                                    name="brokerCode"
                                    label={t(`${componentPath}.fields.brokerCode`)}
                                    placeholder={t(`${componentPath}.fields.brokerCode`)}
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
                    </Grid>
                </Box>

                {connectionType === ConnectionType.SYNC && (
                    <>
                        <Box sx={inputGroupStyle} data-testid="model-1-box">
                            <AddEditStationFormSectionTitle
                                title={t(`${componentPath}.sections.modello1`)}
                                icon={<MenuBook/>}
                            />
                            <Grid container item spacing={2} mt={1} justifyContent={'center'}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="targetConcat"
                                        name="targetConcat"
                                        label={t(`${componentPath}.fields.endpointRTConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointRTConcat`)}
                                        size="small"
                                        value={formik.values.targetConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.targetConcat || testRtResult) &&
                                            Boolean(formik.errors.targetConcat)
                                        }
                                        helperText={
                                            (formik.touched.targetConcat || testRtResult) && formik.errors.targetConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'targetConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testRtResult !== undefined &&
                                                    testRtResult.testResult === TestResultEnum.SUCCESS ? (
                                                        <CheckIcon sx={{color: 'success.main'}}/>
                                                    ) : (
                                                        ''
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingRt ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                disabled={
                                                    (testRtResult !== undefined &&
                                                        testRtResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.targetConcat === undefined ||
                                                    formik.values.targetConcat === ''
                                                }
                                                onClick={() => validateRtEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-rt-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2} mt={1} justifyContent={'center'}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="redirectConcat"
                                        name="redirectConcat"
                                        label={t(`${componentPath}.fields.endpointRedirectConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointRedirectConcat`)}
                                        size="small"
                                        value={formik.values.redirectConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.redirectConcat || testRedirectResult) &&
                                            Boolean(formik.errors.redirectConcat)
                                        }
                                        helperText={
                                            (formik.touched.redirectConcat || testRedirectResult) &&
                                            formik.errors.redirectConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'redirectConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testRedirectResult !== undefined &&
                                                    testRedirectResult.testResult === TestResultEnum.SUCCESS ? (
                                                        <CheckIcon sx={{color: 'success.main'}}/>
                                                    ) : (
                                                        ''
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingRedirect ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                hidden={!isTesting}
                                                disabled={
                                                    (testRedirectResult !== undefined &&
                                                        testRedirectResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.redirectConcat === undefined ||
                                                    formik.values.redirectConcat === ''
                                                }
                                                onClick={() => validateRedirectEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-redirect-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={inputGroupStyle} data-testid="model-unique-box">
                            <AddEditStationFormSectionTitle
                                title={t(`${componentPath}.sections.modelloUnico`)}
                                icon={<MenuBook/>}
                            />
                            <Grid container spacing={2} mt={1}>
                                <Grid container item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="targetPofConcat"
                                        name="targetPofConcat"
                                        label={t(`${componentPath}.fields.endpointMUConcat`)}
                                        placeholder={t(`${componentPath}.fields.endpointMUConcat`)}
                                        size="small"
                                        value={formik.values.targetPofConcat}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            (formik.touched.targetPofConcat || testPofResult) &&
                                            Boolean(formik.errors.targetPofConcat)
                                        }
                                        helperText={
                                            (formik.touched.targetPofConcat || testPofResult) &&
                                            formik.errors.targetPofConcat
                                        }
                                        inputProps={{
                                            'data-testid': 'targetPofConcat-test',
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {testPofResult !== undefined &&
                                                        testPofResult.testResult === TestResultEnum.SUCCESS && (
                                                            <CheckIcon sx={{color: 'success.main'}}/>
                                                        )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid container item xs={2}>
                                    {validatingPof ? (
                                        <CircularProgressIcon sx={{color: 'primary.main'}}/>
                                    ) : (
                                        isTesting && (
                                            <ButtonNaked
                                                size="large"
                                                component="button"
                                                disabled={
                                                    (testPofResult !== undefined &&
                                                        testPofResult.testResult === TestResultEnum.SUCCESS) ||
                                                    formik.values.targetPofConcat === undefined ||
                                                    formik.values.targetPofConcat === ''
                                                }
                                                onClick={() => validatePofEndpoint()}
                                                sx={{color: 'primary.main'}}
                                                weight="default"
                                                data-testid="test-pof-endpoint-test"
                                                endIcon={<NorthEastIcon/>}
                                            >
                                                {t(`${componentPath}.testStation`)}
                                            </ButtonNaked>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={1}>
                                <Grid container item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel size="small" id="primitiveVersionLabel">
                                            {t(`${componentPath}.fields.primitiveVersion`)}
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            type="number"
                                            id="primitiveVersion"
                                            name="primitiveVersion"
                                            labelId='primitiveVersionLabel'
                                            label={t(`${componentPath}.fields.primitiveVersion`)}
                                            placeholder={t(`${componentPath}.fields.primitiveVersion`)}
                                            size="small"
                                            value={
                                                formik.values.primitiveVersion === 0 ? '' : formik.values.primitiveVersion
                                            }
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)
                                            }
                                            inputProps={{
                                                'data-testid': 'primitive-version-test',
                                            }}
                                        >
                                            {Object.entries([1, 2]).map(([key, value]) => (
                                                <MenuItem
                                                    key={key}
                                                    selected={
                                                        formik.values.primitiveVersion &&
                                                        value === formik.values.primitiveVersion
                                                    }
                                                    value={value}
                                                >
                                                    {`${value}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </Paper>

>>>>>>> 3f32cfc3 (Formatting (#542))
            {userIsPagopaOperator && formAction !== StationFormAction.Create ? (
                <AddEditStationFormValidation
                    formik={formik}
                    handleChangeNumberOnly={handleChangeNumberOnly}
                    inputGroupStyle={inputGroupStyle}
                    newConn={newConn}
                    setNewConn={setNewConn}
                    gdp={gdp}
                    setGDP={setGDP}
                    connectionType={connectionType}
                />
            ) : (
                <></>
            )}
            <Stack direction="row" justifyContent="space-between" mt={5}>
                <Stack display="flex" justifyContent="flex-start" mr={2}>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={() =>
                            history.push(
                                formAction === StationFormAction.Edit
                                    ? generatePath(ROUTES.STATION_DETAIL, {stationId: stationDetail?.stationCode})
                                    : ROUTES.STATIONS
                            )
                        }
<<<<<<< HEAD
<<<<<<< HEAD
                        data-testid="cancel-button-test"
                    >
                        {t('general.back')}
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
                        {t('general.confirm')}
                    </Button>
                </Stack>
            </Stack>
            <ConfirmModal
                title={
                    userIsPagopaOperator
                        ? t(`${componentPath}.confirmModal.titleOperator`)
                        : t(`${componentPath}.confirmModal.title`)
                }
                message={
                    userIsPagopaOperator ? (
                        <Trans i18nKey={`${componentPath}.confirmModal.messageStationOperator`}>
                            L’ente riceverà una notifica di conferma attivazione della stazione.
                            <br/>
                        </Trans>
                    ) : (
                        <Trans i18nKey={`${componentPath}.confirmModal.messageStation`}>
                            Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
                            approvare. Riceverai una notifica a revisione completata.
                            <br/>
                        </Trans>
                    )
                }
                openConfirmModal={showConfirmModal}
                onConfirmLabel={userIsPagopaOperator ? t('general.confirm') : t('general.send')}
                onCloseLabel={t('general.turnBack')}
                handleCloseConfirmModal={() => setShowConfirmModal(false)}
                handleConfrimSubmit={async () => {
                    await submit(formik.values);
                    setShowConfirmModal(false);
                }}
            />
        </>
    );
=======
                        onClick={() => validatePofEndpoint()}
                        sx={{ color: 'primary.main' }}
                        weight="default"
                        data-testid="test-pof-endpoint-test"
                        endIcon={<NorthEastIcon />}
                      >
                        {t(`${componentPath}.testStation`)}
                      </ButtonNaked>
                    )
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                <Grid container item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel size="small" id="primitiveVersionLabel">
                      {t(`${componentPath}.fields.primitiveVersion`)}
                    </InputLabel>
                    <Select
                      fullWidth
                      type="number"
                      id="primitiveVersion"
                      name="primitiveVersion"
                      labelId='primitiveVersionLabel'
                      label={t(`${componentPath}.fields.primitiveVersion`)}
                      placeholder={t(`${componentPath}.fields.primitiveVersion`)}
                      size="small"
                      value={
                        formik.values.primitiveVersion === 0 ? '' : formik.values.primitiveVersion
                      }
                      onChange={formik.handleChange}
                      error={
                        formik.touched.primitiveVersion && Boolean(formik.errors.primitiveVersion)
                      }
                      inputProps={{
                        'data-testid': 'primitive-version-test',
                      }}
                    >
                      {Object.entries([1, 2]).map(([key, value]) => (
                        <MenuItem
                          key={key}
                          selected={
                            formik.values.primitiveVersion &&
                            value === formik.values.primitiveVersion
                          }
                          value={value}
                        >
                          {`${value}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Paper>

      {userIsPagopaOperator && formAction !== StationFormAction.Create ? (
        <AddEditStationFormValidation
          formik={formik}
          handleChangeNumberOnly={handleChangeNumberOnly}
          inputGroupStyle={inputGroupStyle}
          newConn={newConn}
          setNewConn={setNewConn}
          gdp={gdp}
          setGDP={setGDP}
          connectionType={connectionType}
        />
      ) : (
        <></>
      )}
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>
              history.push(
                formAction === StationFormAction.Edit
                  ? generatePath(ROUTES.STATION_DETAIL, { stationId: stationDetail?.stationCode })
                  : ROUTES.STATIONS
              )
            }
            data-testid="cancel-button-test"
          >
            {t('general.back')}
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
            {t('general.confirm')}
          </Button>
        </Stack>
      </Stack>
      <ConfirmModal
        title={
          userIsPagopaOperator
            ? t(`${componentPath}.confirmModal.titleOperator`)
            : t(`${componentPath}.confirmModal.title`)
        }
        message={
          userIsPagopaOperator ? (
            <Trans i18nKey={`${componentPath}.confirmModal.messageStationOperator`}>
              L’ente riceverà una notifica di conferma attivazione della stazione.
              <br />
            </Trans>
          ) : (
            <Trans i18nKey={`${componentPath}.confirmModal.messageStation`}>
              Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
              approvare. Riceverai una notifica a revisione completata.
              <br />
            </Trans>
          )
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={userIsPagopaOperator ? t('general.confirm') : t('general.send')}
        onCloseLabel={t('general.turnBack')}
        handleCloseConfirmModal={() => setShowConfirmModal(false)}
        handleConfrimSubmit={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
>>>>>>> 0e41e3e8 ([VAS-820] feat:  Operator's station detail page & request edit modal (#507))
=======
                        data-testid="cancel-button-test"
                    >
                        {t('general.back')}
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
                        {t('general.confirm')}
                    </Button>
                </Stack>
            </Stack>
            <ConfirmModal
                title={
                    userIsPagopaOperator
                        ? t(`${componentPath}.confirmModal.titleOperator`)
                        : t(`${componentPath}.confirmModal.title`)
                }
                message={
                    userIsPagopaOperator ? (
                        <Trans i18nKey={`${componentPath}.confirmModal.messageStationOperator`}>
                            L’ente riceverà una notifica di conferma attivazione della stazione.
                            <br/>
                        </Trans>
                    ) : (
                        <Trans i18nKey={`${componentPath}.confirmModal.messageStation`}>
                            Un operatore PagoPA revisionerà le informazioni inserite nella stazione prima di
                            approvare. Riceverai una notifica a revisione completata.
                            <br/>
                        </Trans>
                    )
                }
                openConfirmModal={showConfirmModal}
                onConfirmLabel={userIsPagopaOperator ? t('general.confirm') : t('general.send')}
                onCloseLabel={t('general.turnBack')}
                handleCloseConfirmModal={() => setShowConfirmModal(false)}
                handleConfrimSubmit={async () => {
                    await submit(formik.values);
                    setShowConfirmModal(false);
                }}
            />
        </>
    );
>>>>>>> 3f32cfc3 (Formatting (#542))
};

export default AddEditStationForm;
