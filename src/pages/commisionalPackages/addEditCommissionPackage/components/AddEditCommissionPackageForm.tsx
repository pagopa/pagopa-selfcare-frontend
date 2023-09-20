/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { FormikProps, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { RemoveCircleOutline } from '@mui/icons-material';
import { MenuBook } from '@mui/icons-material';
import EuroIcon from '@mui/icons-material/Euro';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LOADING_TASK_COMMISSION_PACKAGE_TOUCHPOINT,
  LOADING_TASK_CREATING_COMMISSION_PACKAGE,
  LOADING_TASK_GET_CHANNELS_ID,
  LOADING_TASK_PAYMENT_TYPE,
} from '../../../../utils/constants';
import {
  CommissionPackageOnCreation,
  TouchpointsResource,
} from '../../../../model/CommissionPackage';
import { PaymentTypesResource } from '../../../../api/generated/portal/PaymentTypesResource';
import {
  createCommissionPackage,
  getPaymentTypes,
  getTouchpoint,
} from '../../../../services/__mocks__/commissionPackageService';
import { sortPaymentType } from '../../../../model/PaymentType';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';
import { getChannelsId } from '../../../../services/commissionPackageService';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import CommissionPackageConfirmModal from './CommissionPackageConfirmModal';

type Props = {
  commissionPackageDetails?: CommissionPackageOnCreation;
  formAction: string;
};

const emptyPaymentTypes = {
  payment_types: [
    {
      description: '',
      payment_type: '',
    },
  ],
};

const AddEditCommissionPackageForm = ({ commissionPackageDetails }: Props) => {
  const { t } = useTranslation();
  // const history = useHistory();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const setLoadingPayment = useLoading(LOADING_TASK_PAYMENT_TYPE);
  const setLoadingTouchpoint = useLoading(LOADING_TASK_COMMISSION_PACKAGE_TOUCHPOINT);
  const setLoadingChannels = useLoading(LOADING_TASK_GET_CHANNELS_ID);
  const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_PACKAGE);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypesResource>(emptyPaymentTypes);
  const [touchPoint, setTouchPoint] = useState<TouchpointsResource>({ touchpointList: [] });
  const [channelsId, setChannelsId] = useState<Array<string>>(['']);

  useEffect(() => {
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
          displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
          displayableDescription: t(
            'commissionPackagesPage.addEditCommissionPackage.error.errorMessagePaymentTypesDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoadingPayment(false));
  }, []);

  useEffect(() => {
    setLoadingTouchpoint(true);
    getTouchpoint()
      .then((results) => {
        if (results) {
          setTouchPoint(results);
        }
      })
      .catch((reason) => {
        addError({
          id: 'GET_TOUCHPOINT',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting touchpoint`,
          toNotify: true,
          displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
          displayableDescription: t(
            'commissionPackagesPage.addEditCommissionPackage.error.errorMessageTouchpointDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoadingTouchpoint(false));
  }, []);

  useEffect(() => {
    setLoadingChannels(true);
    getChannelsId(0, brokerCode)
      .then((results) => {
        if (results) {
          setChannelsId(results);
        }
      })
      .catch((reason) => {
        addError({
          id: 'GET_CHANNELS_ID',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting channels id`,
          toNotify: true,
          displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
          displayableDescription: t(
            'commissionPackagesPage.addEditCommissionPackage.error.errorMessageChannelsId'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoadingChannels(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    formik.setFieldValue('validityDateFrom', getTomorrowDate(new Date()));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    formik.setFieldValue('validityDateTo', getTomorrowDate(new Date()));
  }, []);

  const initialFormData = (detail?: CommissionPackageOnCreation) =>
    detail
      ? {
          abi: detail.abi,
          description: detail.description,
          digitalStamp: detail.digitalStamp,
          digitalStampRestriction: detail.digitalStampRestriction,
          idBrokerPsp: detail.idBrokerPsp,
          idCdi: detail.idCdi,
          idChannel: detail.idChannel,
          maxPaymentAmount: detail.maxPaymentAmount,
          minPaymentAmount: detail.minPaymentAmount,
          name: detail.name,
          paymentAmount: detail.paymentAmount,
          paymentType: detail.paymentType,
          touchpoint: detail.touchpoint,
          transferCategoryList: detail.transferCategoryList
            ? [...detail.transferCategoryList]
            : [''],
          type: detail.type,
          validityDateFrom: detail.validityDateFrom,
          validityDateTo: detail.validityDateTo,
        }
      : {
          abi: '',
          description: '',
          digitalStamp: false,
          digitalStampRestriction: false,
          idBrokerPsp: '',
          idCdi: '',
          idChannel: '',
          maxPaymentAmount: 0,
          minPaymentAmount: 0,
          name: '',
          paymentAmount: 0,
          paymentType: undefined,
          touchpoint: undefined,
          transferCategoryList: ['97735020584_01'],
          type: undefined,
          validityDateFrom: new Date(),
          validityDateTo: new Date(),
        };

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const validate = (values: Partial<CommissionPackageOnCreation>) => {
    const minDate = new Date();
    return Object.fromEntries(
      Object.entries({
        ...{
          description: !values.description
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          digitalStamp: !values.digitalStamp
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          digitalStampRestriction: !values.digitalStampRestriction
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          idChannel: !values.idChannel
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          maxPaymentAmount: !values.maxPaymentAmount
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          minPaymentAmount: !values.minPaymentAmount
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          name: !values.name
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          paymentAmount: !values.paymentAmount
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          paymentType: !values.paymentType
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          touchpoint: !values.touchpoint
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          transferCategoryList: !values.transferCategoryList
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          type: !values.type
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          validityDateFrom: !values.validityDateFrom
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : values.validityDateFrom.getTime() < minDate.getTime()
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.dateNotValid')
            : values.validityDateTo &&
              values.validityDateFrom.getTime() > values.validityDateTo.getTime()
            ? t(
                'commissionPackagesPage.addEditCommissionPackage.validationMessage.startDateOverEndDate'
              )
            : undefined,
          validityDateTo: !values.validityDateTo
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : values.validityDateTo.getTime() < minDate.getTime()
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.dateNotValid')
            : values.validityDateFrom &&
              values.validityDateTo.getTime() < values.validityDateFrom.getTime()
            ? t(
                'commissionPackagesPage.addEditCommissionPackage.validationMessage.endDateUnderStartDate'
              )
            : undefined,
        },
      }).filter(([_key, value]) => value)
    );
  };

  const submit = async (body: CommissionPackageOnCreation) => {
    setLoadingCreating(true);
    try {
      await createCommissionPackage(body);
      console.log('body', body);
    } catch (reason) {
      addError({
        id: 'CREATE_COMMISSION_PACKAGE',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while creating commission package`,
        toNotify: true,
        displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
        displayableDescription: t(
          'commissionPackagesPage.addEditCommissionPackage.error.errorMessageCreatingPackage'
        ),
        component: 'Toast',
      });
    } finally {
      setLoadingCreating(false);
    }
  };

  const formik = useFormik<CommissionPackageOnCreation>({
    initialValues: initialFormData(commissionPackageDetails),
    validate,
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const addTransferCategoryItem = async () => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList, ''];
      await formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const deleteTransferCategoryItem = async (index: number) => {
    if (formik.values.transferCategoryList) {
      const newArr = [...formik.values.transferCategoryList];
      if (index > -1 && index < formik.values.transferCategoryList.length) {
        // eslint-disable-next-line functional/immutable-data
        newArr.splice(index, 1);
      }
      await formik.setFieldValue('transferCategoryList', newArr);
    }
  };

  const handleChangeNumberOnly = (
    e: React.ChangeEvent<any>,
    field: string,
    formik: FormikProps<CommissionPackageOnCreation>
  ) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      formik.setFieldValue(field, e.target.value);
    }
  };

  const shouldDisableDate = (date: Date) => date < new Date();

  const getTomorrowDate = (currentDate: Date) => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    return tomorrow;
  };

  const openConfirmModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  };

  const sortingChannelsIdList = (list: Array<string>) => {
    const arrayWithoutFs = list.map((e) => e.replace('f', ''));
    const arrayOfCOrrectChannelsId = arrayWithoutFs.filter((e) => e.includes('97735020584'));
    const channelsIdNumbers = arrayOfCOrrectChannelsId.map((v, i) => ({
      i,
      value: parseInt(v.substring(12, 14), 10),
    }));

    // eslint-disable-next-line functional/immutable-data
    const channelsIdNumbersSorted = channelsIdNumbers.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });

    return channelsIdNumbersSorted.map((v) => arrayOfCOrrectChannelsId[v.i]);
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
          {t('commissionPackagesPage.addEditCommissionPackage.form.packageType')}
        </Typography>

        <FormControl>
          <RadioGroup
            name="type"
            row
            onChange={(e) => formik.setFieldValue('type', e.target.value)}
          >
            <FormControlLabel
              value="GLOBAL"
              control={<Radio />}
              label={t('commissionPackagesPage.addEditCommissionPackage.form.globalPackage')}
              sx={{ pr: 8 }}
            />
            <FormControlLabel
              value="PUBLIC"
              control={<Radio />}
              label={t('commissionPackagesPage.addEditCommissionPackage.form.publicPackage')}
              sx={{ pr: 8 }}
            />
            <FormControlLabel
              value="PRIVATE"
              control={<Radio />}
              label={t('commissionPackagesPage.addEditCommissionPackage.form.privatePackage')}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
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
          {t('commissionPackagesPage.addEditCommissionPackage.form.packageConfiguration')}
        </Typography>

        <Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionPackagesPage.addEditCommissionPackage.form.packageStructure')}
              icon={<MenuBook />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label={t('commissionPackagesPage.addEditCommissionPackage.form.packageName')}
                  placeholder={t(
                    'commissionPackagesPage.addEditCommissionPackage.form.packageName'
                  )}
                  size="small"
                  value={formik.values.name}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  inputProps={{
                    'data-testid': 'name-test',
                  }}
                />
              </Grid>

              <Grid container item xs={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label={t('addEditIbanPage.addForm.fields.iban.description')}
                  placeholder={t(
                    'commissionPackagesPage.addEditCommissionPackage.form.packageDescription'
                  )}
                  size="small"
                  value={formik.values.description}
                  onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  inputProps={{
                    'data-testid': 'description-test',
                  }}
                />
              </Grid>
              <Grid container item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('commissionPackagesPage.addEditCommissionPackage.form.paymentType')}
                  </InputLabel>
                  <Select
                    id={`paymentType`}
                    labelId={`paymentTypeLabel`}
                    name={`paymentType`}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.paymentType')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.paymentType'
                    )}
                    size="small"
                    value={formik.values.paymentType === undefined ? '' : formik.values.paymentType}
                    onChange={(e) => formik.setFieldValue('paymentType', e.target.value)}
                    error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    inputProps={{
                      'data-testid': 'payment-type-test',
                    }}
                  >
                    {paymentOptions &&
                      sortPaymentType(paymentOptions.payment_types).map((option: any) => (
                        <MenuItem key={option.payment_type} value={option.payment_type}>
                          {`${option.description} - ${option.payment_type}`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid container item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('commissionPackagesPage.addEditCommissionPackage.form.touchpoint')}
                  </InputLabel>
                  <Select
                    id={`touchpoint`}
                    labelId={`touchpointLabel`}
                    name={`touchpoint`}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.touchpoint')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.touchpoint'
                    )}
                    size="small"
                    value={formik.values.touchpoint === undefined ? '' : formik.values.touchpoint}
                    onChange={(e) => formik.setFieldValue('touchpoint', e.target.value)}
                    error={formik.touched.touchpoint && Boolean(formik.errors.touchpoint)}
                    inputProps={{
                      'data-testid': 'touchpoint-test',
                    }}
                  >
                    {touchPoint.touchpointList.map((option, i) => (
                      <MenuItem key={i} value={option.touchpoint}>
                        {option.touchpoint}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.transferCategoryList?.map((_pT, i) => (
                <Grid container key={i} sx={{ pt: 2, px: 2 }}>
                  {i > 0 ? (
                    <Grid container item xs={1} key={`remove${i}`} mt={1}>
                      <RemoveCircleOutline
                        color="error"
                        sx={{
                          cursor: 'pointer',
                        }}
                        onClick={() => deleteTransferCategoryItem(i)}
                        id={`remove_PaymentMethod${i}`}
                        data-testid="remove-payment-method"
                      />
                    </Grid>
                  ) : null}
                  <Grid container item xs={i > 0 ? 5 : 6} key={`item${i}`}>
                    <FormControl fullWidth key={`FormControl${i}`}>
                      <InputLabel size="small" key={`InputLabel${i}_label`}>
                        {t(
                          'commissionPackagesPage.addEditCommissionPackage.form.taxonomyOfService'
                        )}
                      </InputLabel>
                      <Select
                        id={`transferCategoryList${i}_select`}
                        labelId={`transferCategoryList${i}_label`}
                        name={`transferCategoryList${i}_name`}
                        label={t(
                          'commissionPackagesPage.addEditCommissionPackage.form.taxonomyOfService'
                        )}
                        placeholder={t(
                          'commissionPackagesPage.addEditCommissionPackage.form.taxonomyOfService'
                        )}
                        size="small"
                        defaultValue={undefined}
                        value={
                          formik.values.transferCategoryList
                            ? formik.values.transferCategoryList[i]
                            : ''
                        }
                        onChange={(event) =>
                          formik.setFieldValue(
                            'transferCategoryList',
                            formik.values.transferCategoryList?.map((pType, j) =>
                              j === i ? event.target.value : pType
                            )
                          )
                        }
                        error={
                          formik.touched.transferCategoryList &&
                          Boolean(formik.errors.transferCategoryList)
                        }
                        inputProps={{
                          'data-testid': 'transfer-category-list-test',
                        }}
                      >
                        {paymentOptions &&
                          sortPaymentType(paymentOptions.payment_types).map((option: any) => (
                            <MenuItem key={option.payment_type} value={option.payment_type}>
                              {`${option.description} - ${option.payment_type}`}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid container item xs={6}>
                <ButtonNaked
                  size="medium"
                  component="button"
                  onClick={() => addTransferCategoryItem()}
                  sx={{ color: 'primary.main', mr: '20px' }}
                  weight="default"
                  data-testid="add-taxonomy-test"
                >
                  {t('commissionPackagesPage.addEditCommissionPackage.form.addTaxonomy')}
                </ButtonNaked>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ pl: 1, mt: 3 }}>
              <FormSectionTitle
                title={t('commissionPackagesPage.addEditCommissionPackage.form.amountRange')}
                icon={<></>}
              />
              <Grid container spacing={2} mt={1} sx={{ pl: 1 }}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="minPaymentAmount"
                    name="minPaymentAmount"
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.minImport')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.minImport'
                    )}
                    size="small"
                    value={
                      formik.values.minPaymentAmount === 0 ? '' : formik.values.minPaymentAmount
                    }
                    onChange={(e) => handleChangeNumberOnly(e, 'minPaymentAmount', formik)}
                    error={
                      formik.touched.minPaymentAmount && Boolean(formik.errors.minPaymentAmount)
                    }
                    helperText={formik.touched.minPaymentAmount && formik.errors.minPaymentAmount}
                    inputProps={{
                      'data-testid': 'min-import-test',
                    }}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="maxPaymentAmount"
                    name="maxPaymentAmount"
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.maxImport')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.maxImport'
                    )}
                    size="small"
                    value={
                      formik.values.maxPaymentAmount === 0 ? '' : formik.values.maxPaymentAmount
                    }
                    onChange={(e) => handleChangeNumberOnly(e, 'maxPaymentAmount', formik)}
                    error={
                      formik.touched.maxPaymentAmount && Boolean(formik.errors.maxPaymentAmount)
                    }
                    helperText={formik.touched.maxPaymentAmount && formik.errors.maxPaymentAmount}
                    inputProps={{
                      'data-testid': 'max-import-test',
                    }}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ pl: 1, mt: 3 }}>
              <FormSectionTitle
                title={t('commissionPackagesPage.addEditCommissionPackage.form.commission')}
                icon={<></>}
              />
              <Grid container spacing={2} mt={1} sx={{ pl: 1 }}>
                <Grid container item xs={6}>
                  <TextField
                    fullWidth
                    id="paymentAmount"
                    name="paymentAmount"
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.feeApplied')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.feeApplied'
                    )}
                    size="small"
                    value={formik.values.paymentAmount === 0 ? '' : formik.values.paymentAmount}
                    onChange={(e) => handleChangeNumberOnly(e, 'paymentAmount', formik)}
                    error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                    helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
                    inputProps={{
                      'data-testid': 'payment-amount-test',
                    }}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionPackagesPage.addEditCommissionPackage.form.pspdata')}
              icon={<MenuBook />}
            />
            <Grid container item xs={6} sx={{ mt: 2, pr: 1 }}>
              <FormControl fullWidth>
                <InputLabel size="small">
                  {t('commissionPackagesPage.addEditCommissionPackage.form.channelCode')}
                </InputLabel>
                <Select
                  id={`idChannel`}
                  labelId={`idChannelLabel`}
                  name={`idChannel`}
                  label={t('commissionPackagesPage.addEditCommissionPackage.form.channelCode')}
                  placeholder={t(
                    'commissionPackagesPage.addEditCommissionPackage.form.channelCode'
                  )}
                  size="small"
                  value={formik.values.idChannel === undefined ? '' : formik.values.idChannel}
                  onChange={(e) => formik.setFieldValue('idChannel', e.target.value)}
                  error={formik.touched.idChannel && Boolean(formik.errors.idChannel)}
                  inputProps={{
                    'data-testid': 'id-channel-test',
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '200px', // Imposta l'altezza massima del menu
                      },
                    },
                  }}
                >
                  {sortingChannelsIdList(channelsId).map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionPackagesPage.addEditCommissionPackage.form.digitalStamp')}
              icon={<BookmarkAddIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: 'medium', fontSize: '16px' }}>
                    {t(
                      'commissionPackagesPage.addEditCommissionPackage.form.paymentWithDigitalStamp'
                    )}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="digitalStamp"
                    sx={{ pl: 1 }}
                    onChange={(e) => formik.setFieldValue('digitalStamp', e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.yes')}
                      data-testid="digital-stamp-true-test"
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.no')}
                      data-testid="digital-stamp-false-test"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid container item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: 'medium', fontSize: '16px' }}>
                    {t(
                      'commissionPackagesPage.addEditCommissionPackage.form.paymentOnlyDigitalStamp'
                    )}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="digitalStampRestriction"
                    sx={{ pl: 1 }}
                    onChange={(e) =>
                      formik.setFieldValue('digitalStampRestriction', e.target.value)
                    }
                    row
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.yes')}
                      data-testid="only-digital-stamp-true-test"
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.no')}
                      data-testid="only-digital-stamp-false-test"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box sx={inputGroupStyle}>
            <FormSectionTitle
              title={t('commissionPackagesPage.addEditCommissionPackage.form.validityPeriod')}
              icon={<DateRangeIcon />}
            />
            <Grid container spacing={2} mt={1}>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.from')}
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.validityDateFrom}
                    onChange={(e) => formik.setFieldValue('validityDateFrom', e)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                          'data-testid': 'from-date-test',
                        }}
                        id="validityDateFrom"
                        name="validityDateFrom"
                        type="date"
                        size="small"
                        error={
                          formik.touched.validityDateFrom && Boolean(formik.errors.validityDateFrom)
                        }
                        helperText={
                          formik.touched.validityDateFrom && formik.errors.validityDateFrom
                        }
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid container item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.to')}
                    inputFormat="dd/MM/yyyy"
                    value={formik.values.validityDateTo}
                    onChange={(e) => formik.setFieldValue('validityDateTo', e)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/mm/aaaa',
                          'data-testid': 'to-date-test',
                        }}
                        id="validityDateTo"
                        name="validityDateTo"
                        type="date"
                        size="small"
                        error={
                          formik.touched.validityDateTo && Boolean(formik.errors.validityDateTo)
                        }
                        helperText={formik.touched.validityDateTo && formik.errors.validityDateTo}
                      />
                    )}
                    shouldDisableDate={shouldDisableDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => ''}
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
            // disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
            data-testid="confirm-button-test"
          >
            {t('commissionPackagesPage.addEditCommissionPackage.form.confirmButton')}
          </Button>
        </Stack>
      </Stack>
      <CommissionPackageConfirmModal
        title={t('commissionPackagesPage.addEditCommissionPackage.modal.title')}
        message={
          <Trans i18nKey="commissionPackagesPage.addEditCommissionPackage.modal.message">
            Attenzione confermando l’operazione l’IBAN verrà dissociato dall’Ente
            <br />
          </Trans>
        }
        openConfirmModal={showConfirmModal}
        onConfirmLabel={t('commissionPackagesPage.addEditCommissionPackage.modal.confirmButton')}
        onCloseLabel={t('commissionPackagesPage.addEditCommissionPackage.modal.backButton')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfrim={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
};

export default AddEditCommissionPackageForm;
