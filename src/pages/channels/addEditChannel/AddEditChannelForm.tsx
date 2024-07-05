/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import {
  Add,
  Badge as BadgeIcon,
  CreditCard as CreditCardIcon,
  MenuBook as MenuBookIcon,
  RemoveCircleOutline,
} from '@mui/icons-material';
import {
  Box,
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
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { generatePath } from 'react-router-dom';
import {
  ChannelDetailsResource,
  ProtocolEnum,
  WrapperStatusEnum,
} from '../../../api/generated/portal/ChannelDetailsResource';
import { PaymentTypes } from '../../../api/generated/portal/PaymentTypes';
import { useUserRole } from '../../../hooks/useUserRole';
import { ChannelOnCreation, FormAction, forwarder01 } from '../../../model/Channel';
import { Party } from '../../../model/Party';
import { sortPaymentType } from '../../../model/PaymentType';
import { ConfigurationStatus } from '../../../model/Station';
import ROUTES from '../../../routes';
import {
  createChannel,
  createWrapperChannelDetails,
  updateChannel,
  updateWrapperChannelDetails,
} from '../../../services/channelService';
import { getPaymentTypes } from '../../../services/configurationService';
import { LOADING_TASK_CHANNEL_ADD_EDIT, LOADING_TASK_PAYMENT_TYPE } from '../../../utils/constants';
import { isNewConnectivity } from '../../../model/Channel';
import ConfirmModal from '../../components/ConfirmModal';
import { isValidURL } from '../../components/commonFunctions';
import AddEditChannelFormSectionTitle from './AddEditChannelFormSectionTitle';
import AddEditChannelValidationForm from './components/AddEditChannelValidationForm';

type Props = {
  selectedParty: Party;
  channelDetail?: ChannelDetailsResource;
  channelCode: string;
  formAction: string;
};

const componentPath = 'addEditChannelPage.addForm';
const AddEditChannelForm = ({ selectedParty, channelCode, channelDetail, formAction }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const setLoadingPayment = useLoading(LOADING_TASK_PAYMENT_TYPE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypes>({ payment_types: [] });
  const { userIsPagopaOperator } = useUserRole();

  const initialFormData = (
    channelCode: string,
    channelDetail?: ChannelDetailsResource,
    selectedParty?: Party
  ): ChannelOnCreation => {
    if (channelDetail) {
      return {
        broker_description: channelDetail.broker_description ?? '',
        broker_psp_code: channelDetail.broker_psp_code ?? '',
        card_chart: false,
        channel_code: channelDetail.channel_code,
        digital_stamp_brand: channelDetail.digital_stamp_brand ?? false,
        flag_io: channelDetail.flag_io ?? false,
        ip: channelDetail.ip ?? '',
        newConnection: isNewConnectivity(channelDetail) ? forwarder01 : '',
        new_password: channelDetail.new_password ?? '',
        nmp_service: channelDetail.nmp_service ?? '',
        on_us: channelDetail.on_us ?? false,
        password: channelDetail.password ?? '',
        payment_model: channelDetail.payment_model ?? undefined,
        payment_types: channelDetail.payment_types ? [...channelDetail.payment_types] : [''],
        port: channelDetail.port ?? 0,
        primitive_version: channelDetail.primitive_version ?? undefined,
        protocol: channelDetail.protocol ?? undefined,
        proxyUnion:
          channelDetail.proxy_host !== undefined &&
          channelDetail.proxy_host !== null &&
          channelDetail.proxy_host !== '' &&
          channelDetail.proxy_port !== undefined &&
          channelDetail.proxy_port !== null
            ? `${channelDetail.proxy_host}:${channelDetail.proxy_port}`
            : '',
        proxy_host: channelDetail.proxy_host ?? '',
        proxy_port: channelDetail.proxy_port ?? undefined,
        proxy_enabled: channelDetail.proxy_enabled ?? false,
        recovery: channelDetail.recovery ?? false,
        rt_push: channelDetail.rt_push ?? false,
        serv_plugin: channelDetail.serv_plugin ?? '',
        service: channelDetail.service ?? '',
        target_host: channelDetail.target_host ?? '',
        target_path: channelDetail.target_path ?? '',
        target_port: channelDetail.target_port ?? undefined,
        targetUnion:
          channelDetail.target_host !== ''
            ? `${channelDetail.target_host}:${channelDetail.target_port}${channelDetail.target_path}`
            : `${channelDetail.protocol === ProtocolEnum.HTTPS ? 'https://' : 'http://'}${
                channelDetail.ip
              }:${channelDetail.port}${channelDetail.service}`,
        thread_number: channelDetail.thread_number ?? 0,
        timeout_a: channelDetail.timeout_a ?? 0,
        timeout_b: channelDetail.timeout_b ?? 0,
        timeout_c: channelDetail.timeout_c ?? 0,
        validationUrl: '',
      };
    } else {
      return {
        broker_description: selectedParty?.description ?? '',
        broker_psp_code: selectedParty?.fiscalCode ?? '',
        channel_code: channelCode,
        digital_stamp_brand: false,
        flag_io: false,
        ip: '',
        newConnection: '',
        password: '',
        payment_model: undefined,
        payment_types: [''],
        primitive_version: undefined,
        protocol: undefined,
        proxyUnion: '',
        proxy_host: '',
        proxy_port: undefined,
        proxy_enabled: false,
        target_host: '',
        target_path: '',
        target_port: undefined,
        targetUnion: '',
        timeout_a: 0,
        timeout_b: 0,
        timeout_c: 0,
        validationUrl: '',
      };
    }
  };

  const validate = (values: Partial<ChannelOnCreation>) =>
    Object.fromEntries(
      Object.entries({
        ...{
          broker_psp_code: !values.broker_psp_code
            ? t('addEditChannelPage.validationMessage.requiredField')
            : undefined,
          broker_description: !values.broker_description
            ? t('addEditChannelPage.validationMessage.requiredField')
            : undefined,
          channel_code: !values.channel_code
            ? t('addEditChannelPage.validationMessage.requiredField')
            : undefined,
          targetUnion: !values.targetUnion
            ? t('addEditChannelPage.validationMessage.requiredField')
            : !isValidURL(values.targetUnion)
              ? t('addEditChannelPage.validationMessage.urlNotValid')
              : undefined,
          payment_types: values.payment_types?.includes('')
            ? t('addEditChannelPage.validationMessage.requiredField')
            : undefined,
        },
        ...(userIsPagopaOperator && {
          primitive_version: !values.primitive_version
            ? t('addEditChannelPage.validationMessage.requiredField')
            : validatePrimitiveVersion(values.primitive_version)
              ? t('addEditStationPage.validation.overVersion')
              : undefined,
          password: !values.password
            ? t('addEditChannelPage.validationMessage.requiredField')
            : undefined,

          proxy_host: !values.proxy_host ? t('addEditChannelPage.requiredField') : undefined,
        }),
      }).filter(([_key, value]) => value)
    );

  const formik = useFormik<ChannelOnCreation>({
    initialValues: initialFormData(channelCode, channelDetail, selectedParty),
    validate,
    onSubmit: () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnMount: true,
  });

  useEffect(() => {
    splitTarget(formik.values);
  }, [formik.values.targetUnion]);

  useEffect(() => {
    splitProxy(formik.values);
    if (formik.values.proxy_host !== '' && formik.values.proxy_port !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setValues({ ...formik.values, proxy_enabled: true });
    }
  }, [formik.values.proxyUnion]);

  useEffect(() => {
    if (paymentOptions?.payment_types?.length === 0) {
      setLoadingPayment(true);
      getPaymentTypes()
        .then((results) => {
          if (results) {
            setPaymentOptions(results);
          }
        })
        .catch((reason) => {
          addError({
            id: 'GET_PAYMENT_TYPES',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while getting payment types`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(`${componentPath}.errorMessagePaymentTypesDesc`),
            component: 'Toast',
          });
        })
        .finally(() => setLoadingPayment(false));
    }
  }, []);

  const splitURL = (targetURL: string) => {
    try {
      const url = new URL(targetURL);
      return {
        protocolSplit: url.protocol,
        hostSplit: url.hostname,
        portSplit:
          Number(url.port) !== 0 && Number(url.port) !== 80
            ? Number(url.port)
            : url.protocol === 'https:'
              ? 443
              : 80,
        pathSplit: url.pathname + url.search + url.hash,
      };
    } catch (e) {
      console.error(e);
    }
    return {
      protocolSplit: '',
      hostSplit: '',
      portSplit: 0,
      pathSplit: '',
    };
  };

  const splitTarget = (values: ChannelOnCreation) => {
    const normalizedTargetUnion = formik.values.targetUnion.trim(); // Normalizza il valore rimuovendo spazi iniziali e finali

    if (normalizedTargetUnion && normalizedTargetUnion !== '') {
      const splitTargetUnion = splitURL(formik.values.targetUnion);

      if (splitTargetUnion) {
        const { protocolSplit, hostSplit, pathSplit, portSplit } = splitTargetUnion;

        // eslint-disable-next-line functional/immutable-data
        values.target_host = `${protocolSplit ? protocolSplit + '//' : ''}${hostSplit}`;

        // eslint-disable-next-line functional/immutable-data
        values.target_path = pathSplit;

        // eslint-disable-next-line functional/immutable-data
        values.target_port = portSplit !== 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80;
      }
    }
  };

  const splitProxy = (values: ChannelOnCreation) => {
    if (formik.values.proxyUnion && formik.values.proxyUnion !== '') {
      if (!formik.values.proxyUnion.startsWith('http')) {
        // eslint-disable-next-line functional/immutable-data
        formik.values.proxyUnion = 'http://'.concat(formik.values.proxyUnion);
      }
      const splitProxyUnion = splitURL(formik.values.proxyUnion);
      if (splitProxyUnion) {
        const { protocolSplit, hostSplit, portSplit } = splitProxyUnion;

        // eslint-disable-next-line functional/immutable-data
        values.proxy_host = `${hostSplit}`;
        // eslint-disable-next-line functional/immutable-data
        values.proxy_port = portSplit;
      }
    }
  };

  const splitNewConnection = (values: ChannelOnCreation) => {
    const splitUrl =
      formik.values.newConnection.trim() !== ''
        ? splitURL(formik.values.newConnection)
        : splitURL(formik.values.targetUnion);

    if (splitUrl) {
      const { protocolSplit, hostSplit, pathSplit, portSplit } = splitUrl;
      // eslint-disable-next-line functional/immutable-data
      values.protocol = protocolSplit === 'https:' ? ProtocolEnum.HTTPS : ProtocolEnum.HTTP;
      // eslint-disable-next-line functional/immutable-data
      values.ip = hostSplit;
      // eslint-disable-next-line functional/immutable-data
      values.port = portSplit !== 0 ? portSplit : protocolSplit === 'https:' ? 443 : 80;
      // eslint-disable-next-line functional/immutable-data
      values.service = pathSplit;
      // eslint-disable-next-line functional/immutable-data
      values.nmp_service = pathSplit;
    }
  };

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const validatePrimitiveVersion = (primitive_version: number | undefined) => {
    if (primitive_version) {
      return primitive_version > 0 && primitive_version <= 2 ? false : true;
    }
    return false;
  };

  const enableSubmit = (values: ChannelOnCreation) => {
    const baseConditions =
      values.broker_psp_code !== '' &&
      values.broker_description !== '' &&
      values.channel_code !== '' &&
      values.targetUnion !== '' &&
      values.payment_types?.toString() !== '';

    if (baseConditions) {
      if (!userIsPagopaOperator) {
        return true;
      } else {
        if (
          values.primitive_version?.toString() !== '' &&
          values.password !== '' &&
          values.proxyUnion !== ''
        ) {
          if (userIsPagopaOperator && values.payment_types && values.payment_types.length > 0) {
            for (const paymentType of values.payment_types) {
              if (paymentType === '') {
                return false;
              }
            }
          }
          return true;
        }
      }
    }

    return false;
  };

  const addPaymentMethod = async () => {
    if (userIsPagopaOperator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types, ''];
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const deletePaymentMethod = async (index: number) => {
    if (userIsPagopaOperator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types];
      if (index > -1 && index < formik.values.payment_types.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const redirect = (status: ConfigurationStatus) => {
    if (userIsPagopaOperator) {
      history.push(
        generatePath(ROUTES.CHANNEL_DETAIL, { channelId: formik.values.channel_code, status })
      );
    } else {
      history.push(ROUTES.CHANNELS);
    }
  };

  const submit = async (values: ChannelOnCreation) => {
    setShowConfirmModal(false);
    setLoading(true);

    splitNewConnection(formik.values);
    splitProxy(formik.values);

    try {
      const validationUrl = `${window.location.origin}${generatePath(ROUTES.CHANNEL_DETAIL, {
        channelId: formik.values.channel_code,
        status: ConfigurationStatus.TO_BE_VALIDATED,
      })}`;

      if (formAction === FormAction.Create || formAction === FormAction.Duplicate) {
        await createWrapperChannelDetails(values as any, validationUrl);
        redirect(ConfigurationStatus.TO_BE_VALIDATED);
      }

      if (formAction === FormAction.Edit) {
        if (userIsPagopaOperator) {
          if (
            channelDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
            channelDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX
          ) {
            await createChannel(values);
          } else if (
            channelDetail?.wrapperStatus === WrapperStatusEnum.APPROVED ||
            channelDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE ||
            channelDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX_UPDATE
          ) {
            await updateChannel(channelCode, values);
          } else {
            throw new Error('Wrong channel wrapper status');
          }
          redirect(ConfigurationStatus.ACTIVE);
        } else {
          await updateWrapperChannelDetails({ channelCode, channel: values, validationUrl });
          redirect(ConfigurationStatus.TO_BE_VALIDATED);
        }
      }
    } catch (reason) {
      addError({
        id: 'ADDEDIT_CHANNEL',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing channel`,
        toNotify: true,
        displayableTitle: t('general.errorTitle'),
        displayableDescription: t(`${componentPath}.errorMessageDesc`),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<ChannelOnCreation>
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
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6" mb={1}>
              {t('channelDetailPage.channelConfiguration')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" mb={3}>
              {t('channelDetailPage.channelConfiguration')}
            </Typography>
          </Grid>
        </Grid>

        <Box>
          <Box sx={inputGroupStyle}>
            <AddEditChannelFormSectionTitle
              title={t(`${componentPath}.sections.registry`)}
              icon={<BadgeIcon fontSize="small" />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="broker_psp_code"
                  name="broker_psp_code"
                  label={t(`${componentPath}.fields.pspBrokerCode`)}
                  size="small"
                  disabled
                  value={formik.values.broker_psp_code}
                  onChange={formik.handleChange}
                  error={formik.touched.broker_psp_code && Boolean(formik.errors.broker_psp_code)}
                  helperText={formik.touched.broker_psp_code && formik.errors.broker_psp_code}
                  inputProps={{
                    'data-testid': 'psp-brokercode-test',
                  }}
                  required
                />
              </Grid>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="broker_description"
                  name="broker_description"
                  disabled
                  label={t(`${componentPath}.fields.businessName`)}
                  size="small"
                  value={formik.values.broker_description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.broker_description && Boolean(formik.errors.broker_description)
                  }
                  helperText={formik.touched.broker_description && formik.errors.broker_description}
                  inputProps={{
                    'data-testid': 'business-name-test',
                  }}
                  required
                />
              </Grid>
              <Grid container item xs={6} direction="column">
                <TextField
                  fullWidth
                  id="channel_code"
                  name="channel_code"
                  disabled={true}
                  label={t(`${componentPath}.fields.idChannel`)}
                  size="small"
                  value={formik.values.channel_code}
                  onChange={formik.handleChange}
                  error={formik.touched.channel_code && Boolean(formik.errors.channel_code)}
                  helperText={formik.touched.channel_code && formik.errors.channel_code}
                  inputProps={{
                    'data-testid': 'channel-code-test',
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={inputGroupStyle}>
            <AddEditChannelFormSectionTitle
              title={t(`${componentPath}.sections.target`)}
              icon={<MenuBookIcon />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetUnion"
                  name="targetUnion"
                  label={t(`${componentPath}.fields.endPoint`)}
                  size="small"
                  value={formik.values.targetUnion}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.targetUnion && Boolean(formik.errors.targetUnion)}
                  helperText={formik.touched.targetUnion && formik.errors.targetUnion}
                  inputProps={{
                    'data-testid': 'target-union-test',
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <AddEditChannelFormSectionTitle
              title={t(`${componentPath}.sections.paymentType`)}
              icon={<CreditCardIcon />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              {formik.values.payment_types?.map((_pT, i) => (
                <Grid container spacing={2} mt={1} key={i} ml={1}>
                  {i > 0 && userIsPagopaOperator ? (
                    <Grid container item xs={1} key={`remove${i}`} mt={1}>
                      <RemoveCircleOutline
                        color="error"
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => deletePaymentMethod(i)}
                        id={`remove_PaymentMethod${i}`}
                        data-testid="remove-payment-method"
                      />
                    </Grid>
                  ) : null}
                  <Grid container item xs={i > 0 && userIsPagopaOperator ? 5 : 6} key={`item${i}`}>
                    <FormControl fullWidth key={`FormControl${i}`}>
                      <InputLabel size="small" key={`InputLabel${i}_label`}>
                        {t(`${componentPath}.fields.paymentType`)}
                      </InputLabel>
                      <Select
                        id={`payment_types${i}_select`}
                        labelId={`payment_types${i}_label`}
                        name={`payment_types${i}_name`}
                        label={t(`${componentPath}.fields.paymentType`)}
                        placeholder={t(`${componentPath}.fields.paymentType`)}
                        size="small"
                        defaultValue={undefined}
                        disabled={
                          userIsPagopaOperator
                            ? false
                            : formAction === FormAction.Edit
                              ? true
                              : false
                        }
                        value={formik.values.payment_types ? formik.values.payment_types[i] : ''}
                        onChange={(event) =>
                          formik.setFieldValue(
                            'payment_types',
                            formik.values.payment_types?.map((pType, j) =>
                              j === i ? event.target.value : pType
                            )
                          )
                        }
                        error={formik.touched.payment_types && Boolean(formik.errors.payment_types)}
                        inputProps={{
                          'data-testid': 'payment-type-test',
                        }}
                        required
                      >
                        {paymentOptions?.payment_types &&
                          sortPaymentType(paymentOptions.payment_types)?.map((option: any) => (
                            <MenuItem key={option.payment_type} value={option.payment_type}>
                              {`${option.description} - ${option.payment_type}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {userIsPagopaOperator && i === 0 && (
                    <Grid item xs={12}>
                      <ButtonNaked
                        size="medium"
                        component="button"
                        onClick={() => addPaymentMethod()}
                        sx={{ color: 'primary.main', mr: '20px' }}
                        endIcon={<Add />}
                        weight="default"
                        data-testid="add-payment-test"
                      >
                        {t(`${componentPath}.fields.addPayment`)}
                      </ButtonNaked>
                    </Grid>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Paper>

      {formAction === FormAction.Edit && userIsPagopaOperator ? (
        <AddEditChannelValidationForm
          formik={formik}
          handleChangeNumberOnly={handleChangeNumberOnly}
        />
      ) : null}

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>
              userIsPagopaOperator
                ? history.push(
                    generatePath(ROUTES.CHANNEL_DETAIL, {
                      channelId: formik.values.channel_code,
                      status:
                        channelDetail?.wrapperStatus === WrapperStatusEnum.APPROVED
                          ? ConfigurationStatus.ACTIVE
                          : ConfigurationStatus.TO_BE_VALIDATED,
                    })
                  )
                : history.push(ROUTES.CHANNELS)
            }
            data-testid="back-btn-test"
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
          >
            {t(`${componentPath}.continueButton`)}
          </Button>
        </Stack>
      </Stack>

      <ConfirmModal
        title={
          userIsPagopaOperator
            ? channelDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED
              ? t(`${componentPath}.confirmModal.channelValidate`)
              : t(`${componentPath}.confirmModal.channelConfiguration`)
            : t(`${componentPath}.confirmModal.title`)
        }
        message={
          userIsPagopaOperator ? (
            channelDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED ? (
              t(`${componentPath}.confirmModal.messageChannelOperationValidate`)
            ) : (
              t(`${componentPath}.confirmModal.messageChannelOperation`)
            )
          ) : (
            <Trans i18nKey={`${componentPath}.confirmModal.message`}>
              Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di
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
};

export default AddEditChannelForm;
