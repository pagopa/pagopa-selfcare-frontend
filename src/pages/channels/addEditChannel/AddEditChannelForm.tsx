/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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
import { FormikProps, useFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import {
  Badge as BadgeIcon,
  MenuBook as MenuBookIcon,
  CreditCard as CreditCardIcon,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { generatePath } from 'react-router-dom';
import ROUTES from '../../../routes';
import {
  // associatePSPtoChannel,
  createChannel,
  createWrapperChannelDetails,
  getPaymentTypes,
  updateChannel,
  updateWrapperChannelDetailsToCheck,
  updateWrapperChannelDetailsToCheckUpdate,
} from '../../../services/channelService';
import { PaymentTypes } from '../../../api/generated/portal/PaymentTypes';
import { Party } from '../../../model/Party';
import { LOADING_TASK_CHANNEL_ADD_EDIT, LOADING_TASK_PAYMENT_TYPE } from '../../../utils/constants';
import { sortPaymentType } from '../../../model/PaymentType';
import { isOperator, isValidURL } from '../../components/commonFunctions';
import {
  ChannelDetailsResource,
  ProtocolEnum,
} from '../../../api/generated/portal/ChannelDetailsResource';
import { WrapperStatusEnum } from '../../../api/generated/portal/WrapperChannelDetailsResource';
import { ChannelOnCreation, FormAction } from '../../../model/Channel';
import { ENV } from '../../../utils/env';
import ConfirmModal from '../../components/ConfirmModal';
import AddEditChannelFormSectionTitle from './AddEditChannelFormSectionTitle';
import AddEditChannelValidationForm from './components/AddEditChannelValidationForm';

type Props = {
  selectedParty: Party;
  channelDetail?: ChannelDetailsResource;
  channelCode: string;
  formAction: string;
};

const AddEditChannelForm = ({ selectedParty, channelCode, channelDetail, formAction }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const setLoading = useLoading(LOADING_TASK_CHANNEL_ADD_EDIT);
  const setLoadingPayment = useLoading(LOADING_TASK_PAYMENT_TYPE);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypes>({ payment_types: [] });
  const operator = isOperator();

  const forwarder01 =
    ENV.ENV === 'PROD'
      ? 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'
      : 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward';

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
        newConnection:
          `${channelDetail.protocol === ProtocolEnum.HTTPS ? 'https://' : 'http://'}${
            channelDetail.ip
          }${channelDetail.service}` === forwarder01
            ? forwarder01
            : '',
        new_password: channelDetail.new_password ?? '',
        nmp_service: channelDetail.nmp_service ?? '',
        on_us: channelDetail.on_us ?? false,
        password: channelDetail.password ?? '',
        payment_model: channelDetail.payment_model ?? undefined,
        payment_types: channelDetail.payment_types ? [...channelDetail.payment_types] : [''],
        port: channelDetail.port ?? 0,
        primitive_version: channelDetail.primitive_version ?? undefined,
        protocol: channelDetail.protocol ?? undefined,
        proxyUnion: `${channelDetail.proxy_host}:${channelDetail.proxy_port}`,
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
        validationUrl: ''
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
        validationUrl: ''
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
        ...(operator && {
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

  const [isNewConnectivity, setIsNewConnectivity] = useState(!!formik.values.newConnection);

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
          displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
          displayableDescription: t('addEditChannelPage.addForm.errorMessagePaymentTypesDesc'),
          component: 'Toast',
        });
      })
      .finally(() => setLoadingPayment(false));
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
      const splitProxyUnion = splitURL(formik.values.proxyUnion);
      if (splitProxyUnion) {
        const { protocolSplit, hostSplit, portSplit } = splitProxyUnion;

        // eslint-disable-next-line functional/immutable-data
        values.proxy_host = `${protocolSplit + '//'}${hostSplit}`;
        // eslint-disable-next-line functional/immutable-data
        values.proxy_port = portSplit;
      }
    }
  };

  const splitNewConnection = (values: ChannelOnCreation) => {
    const splitUrl =
      formik.values.newConnection.trim() !== '' && isNewConnectivity
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
      if (!operator) {
        return true;
      } else {
        if (
          values.primitive_version?.toString() !== '' &&
          values.password !== '' &&
          values.proxyUnion !== ''
        ) {
          if (operator && values.payment_types && values.payment_types.length > 0) {
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
    if (operator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types, ''];
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const deletePaymentMethod = async (index: number) => {
    if (operator && formik.values.payment_types) {
      const newArr = [...formik.values.payment_types];
      if (index > -1 && index < formik.values.payment_types.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('payment_types', newArr);
    }
  };

  const redirect = () => {
    if (operator) {
      history.push(generatePath(ROUTES.CHANNEL_DETAIL, { channelId: formik.values.channel_code }));
    } else {
      history.push(ROUTES.CHANNELS);
    }
  };

  const submit = async (values: ChannelOnCreation) => {
    setShowConfirmModal(false);
    setLoading(true);

    splitNewConnection(formik.values);

    try {
      const validationUrl = `${window.location.origin}${generatePath(ROUTES.CHANNEL_DETAIL, {
        channelId: formik.values.channel_code,
      })}`;

      if (formAction === FormAction.Create || formAction === FormAction.Duplicate) {
        await createWrapperChannelDetails(values as any, validationUrl);
        redirect();
      }

      if (formAction === FormAction.Edit) {
        switch (channelDetail?.wrapperStatus) {
          case WrapperStatusEnum.TO_CHECK:
            if (operator) {
              await createChannel(values);
            } else {
              await updateWrapperChannelDetailsToCheck(values, validationUrl);
            }
            break;
          case WrapperStatusEnum.APPROVED:
          case WrapperStatusEnum.TO_CHECK_UPDATE:
            if (operator) {
              await updateChannel(channelCode, values);
            } else {
              await updateWrapperChannelDetailsToCheckUpdate(values, validationUrl);
            }
            break;
          case WrapperStatusEnum.TO_FIX:
            await updateWrapperChannelDetailsToCheck(values, validationUrl);
            break;
          default:
            break;
        }
        redirect();
      }
    } catch (reason) {
      addError({
        id: 'ADDEDIT_CHANNEL',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while adding/editing channel`,
        toNotify: true,
        displayableTitle: t('addEditChannelPage.addForm.errorMessageTitle'),
        displayableDescription: t('addEditChannelPage.addForm.errorMessageDesc'),
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
              title={t('addEditChannelPage.addForm.sections.registry')}
              icon={<BadgeIcon fontSize="small" />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="broker_psp_code"
                  name="broker_psp_code"
                  label={t('addEditChannelPage.addForm.fields.pspBrokerCode')}
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
                  label={t('addEditChannelPage.addForm.fields.businessName')}
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
                  label={t('addEditChannelPage.addForm.fields.idChannel')}
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
              title={t('addEditChannelPage.addForm.sections.target')}
              icon={<MenuBookIcon />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="targetUnion"
                  name="targetUnion"
                  label={t('addEditChannelPage.addForm.fields.endPoint')}
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
              title={t('addEditChannelPage.addForm.sections.paymentType')}
              icon={<CreditCardIcon />}
              isRequired
            ></AddEditChannelFormSectionTitle>
            <Grid container spacing={2} mt={1}>
              {formik.values.payment_types?.map((_pT, i) => (
                <Grid container spacing={2} mt={1} key={i} ml={1}>
                  {i > 0 && operator ? (
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
                  <Grid container item xs={i > 0 && operator ? 5 : 6} key={`item${i}`}>
                    <FormControl fullWidth key={`FormControl${i}`}>
                      <InputLabel size="small" key={`InputLabel${i}_label`}>
                        {t('addEditChannelPage.addForm.fields.paymentType')}
                      </InputLabel>
                      <Select
                        id={`payment_types${i}_select`}
                        labelId={`payment_types${i}_label`}
                        name={`payment_types${i}_name`}
                        label={t('addEditChannelPage.addForm.fields.paymentType')}
                        placeholder={t('addEditChannelPage.addForm.fields.paymentType')}
                        size="small"
                        defaultValue={undefined}
                        disabled={operator ? false : formAction === FormAction.Edit ? true : false}
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
                        {paymentOptions &&
                          sortPaymentType(paymentOptions!.payment_types!).map((option: any) => (
                            <MenuItem key={option.payment_type} value={option.payment_type}>
                              {`${option.description} - ${option.payment_type}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {operator && (
                    <Grid container spacing={2} mt={1} ml={1}>
                      {i === 0 && (
                        <Grid container item xs={6}>
                          <ButtonNaked
                            size="medium"
                            component="button"
                            onClick={() => addPaymentMethod()}
                            sx={{ color: 'primary.main', mr: '20px' }}
                            weight="default"
                            data-testid="add-payment-test"
                          >
                            {t('addEditChannelPage.addForm.fields.addPayment')}
                          </ButtonNaked>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Paper>

      {formAction === FormAction.Edit && operator ? (
        <AddEditChannelValidationForm
          formik={formik}
          handleChangeNumberOnly={handleChangeNumberOnly}
          setIsNewConnectivity={setIsNewConnectivity}
          isNewConnectivity={isNewConnectivity}
          forwarder01={forwarder01}
          channelDetail={channelDetail}
        />
      ) : null}

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>
              operator
                ? history.push(
                    generatePath(ROUTES.CHANNEL_DETAIL, { channelId: formik.values.channel_code })
                  )
                : history.push(ROUTES.CHANNELS)
            }
            data-testid="back-btn-test"
          >
            {t('addEditChannelPage.addForm.backButton')}
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
            {t('addEditChannelPage.addForm.continueButton')}
          </Button>
        </Stack>
      </Stack>

      <ConfirmModal
        title={
          operator
            ? t('addEditChannelPage.confirmModal.channelConfiguration')
            : t('addEditStationPage.confirmModal.title')
        }
        message={
          operator ? (
            t('addEditChannelPage.confirmModal.messageChannelOperation')
          ) : (
            <Trans i18nKey="addEditChannelPage.confirmModal.message">
              Un operatore PagoPA revisionerà le informazioni inserite nel canale prima di
              approvare. Riceverai una notifica a revisione completata.
              <br />
            </Trans>
          )
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={
          operator
            ? t('addEditChannelPage.confirmModal.confirmButtonOpe')
            : t('addEditChannelPage.confirmModal.confirmButton')
        }
        onCloseLabel={t('addEditChannelPage.confirmModal.cancelButton')}
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
