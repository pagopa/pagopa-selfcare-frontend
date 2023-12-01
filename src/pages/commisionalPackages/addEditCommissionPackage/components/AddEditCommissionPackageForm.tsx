/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Female, RemoveCircleOutline } from '@mui/icons-material';
import { MenuBook } from '@mui/icons-material';
import EuroIcon from '@mui/icons-material/Euro';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DateRangeIcon from '@mui/icons-material/DateRange';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NumericFormat } from 'react-number-format';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  LOADING_TASK_CREATING_COMMISSION_PACKAGE,
  LOADING_TASK_COMMISSION_PACKAGE_SELECT_DATAS,
} from '../../../../utils/constants';
import {
  CommissionPackageOnCreation,
  TaxonomyServicesResource,
  TouchpointsResource,
} from '../../../../model/CommissionPackage';
import {
  createCommissionPackage,
  getPaymentTypes,
  getTaxonomyService,
  getTouchpoint,
} from '../../../../services/__mocks__/commissionPackageService';
import { sortPaymentType } from '../../../../model/PaymentType';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';
import { getChannelsIdAssociatedToPSP } from '../../../../services/commissionPackageService';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import GenericModal from '../../../../components/Form/GenericModal';
import {PaymentTypes} from "../../../../api/generated/portal/PaymentTypes";

type Prop = {
  commPackageDetails: CommissionPackageOnCreation | undefined;
};

const emptyPaymentTypes = {
  payment_types: [
    {
      description: '',
      payment_type: '',
    },
  ],
};

const AddEditCommissionPackageForm = ({ commPackageDetails }: Prop) => {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_PACKAGE_SELECT_DATAS);
  const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_PACKAGE);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';
  const [paymentOptions, setPaymentOptions] = useState<PaymentTypes>(emptyPaymentTypes);
  const [touchPoint, setTouchPoint] = useState<TouchpointsResource>({
    touchpointList: [],
  });
  const [taxonomyService, setTaxonomyService] = useState<TaxonomyServicesResource>({
    taxonomyServiceList: [],
  });
  const [channelsId, setChannelsId] = useState<Array<string>>(['']);

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPaymentTypes(),
      getTouchpoint(),
      getTaxonomyService(),
      getChannelsIdAssociatedToPSP(0, brokerCode),
    ])
      .then(([paymentTypes, touchpoint, taxonomyService, channelsId]) => {
        if (paymentTypes) {
          setPaymentOptions(paymentTypes);
        }
        if (touchpoint) {
          setTouchPoint(touchpoint);
        }
        if (taxonomyService) {
          setTaxonomyService(taxonomyService);
        }
        if (channelsId) {
          setChannelsId(channelsId);
        }
      })
      .catch((reason) => {
        addError({
          id: 'GET_ALL_DATA',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting data`,
          toNotify: true,
          displayableTitle: t('commissionPackagesPage.addEditCommissionPackage.error.errorTitle'),
          displayableDescription: t(
            'commissionPackagesPage.addEditCommissionPackage.error.errorMessageAllDataDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [brokerCode]);

  useEffect(() => {
    if (typeof commPackageDetails === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('validityDateFrom', getTomorrowDate(new Date()));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formik.setFieldValue('validityDateTo', getTomorrowDate(new Date()));
    }
  }, [commPackageDetails]);

  const getTomorrowDate = (currentDate: Date) => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    return tomorrow;
  };

  const initialFormData = (detail?: CommissionPackageOnCreation) => ({
    abi: detail?.abi || '',
    description: detail?.description || '',
    digitalStamp: detail?.digitalStamp || false,
    digitalStampRestriction: detail?.digitalStampRestriction || false,
    idBrokerPsp: detail?.idBrokerPsp || '',
    idCdi: detail?.idCdi || '',
    idChannel: detail?.idChannel || '',
    maxPaymentAmount: detail?.maxPaymentAmount || 0,
    minPaymentAmount: detail?.minPaymentAmount || 0,
    name: detail?.name || '',
    paymentAmount: detail?.paymentAmount || 0,
    paymentType: detail?.paymentType || undefined,
    touchpoint: detail?.touchpoint || undefined,
    transferCategoryList: detail?.transferCategoryList ? [...detail.transferCategoryList] : [''],
    type: detail?.type || undefined,
    validityDateFrom: detail?.validityDateFrom || undefined,
    validityDateTo: detail?.validityDateTo || undefined,
  });

  const validate = (values: Partial<CommissionPackageOnCreation>) =>
    Object.fromEntries(
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
          type: !values.type
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : undefined,
          validityDateFrom: !values.validityDateFrom
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : values.validityDateFrom.getTime() < new Date().getTime()
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.dateNotValid')
            : values.validityDateTo &&
              values.validityDateFrom.getTime() > values.validityDateTo.getTime()
            ? t(
                'commissionPackagesPage.addEditCommissionPackage.validationMessage.startDateOverEndDate'
              )
            : undefined,
          validityDateTo: !values.validityDateTo
            ? t('commissionPackagesPage.addEditCommissionPackage.validationMessage.requiredField')
            : values.validityDateTo.getTime() < new Date().getTime()
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

  const enableSubmit = (values: CommissionPackageOnCreation) =>
    values.type !== undefined &&
    values.name !== '' &&
    values.minPaymentAmount !== 0 &&
    !Number.isNaN(values.minPaymentAmount) &&
    values.maxPaymentAmount !== 0 &&
    !Number.isNaN(values.maxPaymentAmount) &&
    values.paymentAmount !== 0 &&
    !Number.isNaN(values.paymentAmount) &&
    values.idChannel !== '' &&
    values.idChannel !== undefined &&
    values.description !== '' &&
    values.digitalStamp !== true &&
    values.digitalStamp !== false &&
    values.digitalStampRestriction !== true &&
    values.digitalStampRestriction !== false &&
    values.validityDateFrom != null &&
    values.validityDateFrom.getTime() > 0 &&
    values.validityDateTo != null &&
    values.validityDateTo.getTime() > 0;

  const submit = async (body: CommissionPackageOnCreation) => {
    setLoadingCreating(true);
    try {
      await createCommissionPackage(body);
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

  const formik = useFormik<Partial<CommissionPackageOnCreation>>({
    initialValues: initialFormData(commPackageDetails),
    validate,
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
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

  const shouldDisableDate = (date: Date) => date < new Date();

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
          {t('commissionPackagesPage.addEditCommissionPackage.form.packageType')}
        </Typography>

        <FormControl>
          <RadioGroup
            name="type"
            row
            onChange={(e) => formik.setFieldValue('type', e.target.value)}
            data-testid="package-type-test"
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
                    value={formik.values.paymentType || ''}
                    onChange={formik.handleChange}
                    error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    data-testid="payment-type-test"
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
              <Grid container item xs={6}>
                <FormControl fullWidth>
                  <InputLabel size="small">
                    {t('commissionPackagesPage.addEditCommissionPackage.form.touchpoint')}
                  </InputLabel>
                  <Select
                    id={'touchpoint'}
                    labelId={'touchpointLabel'}
                    name={'touchpoint'}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.touchpoint')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.touchpoint'
                    )}
                    size="small"
                    value={formik.values.touchpoint === undefined ? '' : formik.values.touchpoint}
                    onChange={formik.handleChange}
                    error={formik.touched.touchpoint && Boolean(formik.errors.touchpoint)}
                    data-testid="touchpoint-test"
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
                        data-testid={`remove-payment-method${i}`}
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
                        data-testid="transfer-category-list-test"
                      >
                        {taxonomyService &&
                          taxonomyService.taxonomyServiceList.map((option: any) => (
                            <MenuItem key={option.taxonomyService} value={option.taxonomyService}>
                              {option.taxonomyService}
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
                  <NumericFormat
                    fullWidth
                    id="minPaymentAmount"
                    name="minPaymentAmount"
                    customInput={TextField}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.minImport')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.minImport'
                    )}
                    size="small"
                    value={
                      formik.values.minPaymentAmount === 0 ? '' : formik.values.minPaymentAmount
                    }
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('minPaymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={
                      formik.touched.minPaymentAmount && Boolean(formik.errors.minPaymentAmount)
                    }
                    helperText={formik.touched.minPaymentAmount && formik.errors.minPaymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'min-import-test' }}
                  />
                </Grid>

                <Grid container item xs={6}>
                  <NumericFormat
                    fullWidth
                    id="maxPaymentAmount"
                    name="maxPaymentAmount"
                    customInput={TextField}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.maxImport')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.maxImport'
                    )}
                    size="small"
                    value={
                      formik.values.maxPaymentAmount === 0 ? '' : formik.values.maxPaymentAmount
                    }
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('maxPaymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={
                      formik.touched.maxPaymentAmount && Boolean(formik.errors.maxPaymentAmount)
                    }
                    helperText={formik.touched.maxPaymentAmount && formik.errors.maxPaymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'max-import-test' }}
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
                  <NumericFormat
                    fullWidth
                    id="paymentAmount"
                    name="paymentAmount"
                    customInput={TextField}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.feeApplied')}
                    placeholder={t(
                      'commissionPackagesPage.addEditCommissionPackage.form.feeApplied'
                    )}
                    size="small"
                    value={formik.values.paymentAmount === 0 ? '' : formik.values.paymentAmount}
                    onValueChange={({ value }) => {
                      const numericValue = parseFloat(value.replace(',', '.'));
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      formik.setFieldValue('paymentAmount', numericValue);
                    }}
                    thousandSeparator=""
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                    helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
                    InputProps={{
                      endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                    }}
                    inputProps={{ 'data-testid': 'payment-amount-test' }}
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
              <Autocomplete
                sx={{ mb: 5 }}
                disablePortal
                id="idChannel"
                options={
                  // eslint-disable-next-line functional/immutable-data
                  channelsId.sort()
                }
                onChange={(_event, value) => {
                  if (value === null) {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    formik.setFieldValue('idChannel', '');
                  } else {
                    formik.handleChange('idChannel')(value);
                  }
                }}
                value={formik.values.idChannel}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('commissionPackagesPage.addEditCommissionPackage.form.channelCode')}
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
                PaperComponent={({ children }) => (
                  <Paper sx={{ overflowY: 'auto', mb: 1 }}>{children}</Paper>
                )}
                noOptionsText={t(
                  'commissionPackagesPage.addEditCommissionPackage.form.noChannelsOption'
                )}
                data-testid="channels-id-test"
              />
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
                    data-testid="digital-stamp-test"
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.yes')}
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.no')}
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
                    data-testid="digital-stamp-restriction-test"
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.yes')}
                      sx={{ pr: 3 }}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label={t('commissionPackagesPage.addEditCommissionPackage.form.no')}
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
                    onChange={(value) => formik.setFieldValue('validityDateFrom', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/MM/aaaa',
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
                    onChange={(value) => formik.setFieldValue('validityDateTo', value)}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          placeholder: 'dd/MM/aaaa',
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
              formik.handleSubmit();
              openConfirmModal();
            }}
            disabled={!enableSubmit(formik.values)}
            color="primary"
            variant="contained"
            type="submit"
            data-testid="confirm-button-test"
          >
            {t('commissionPackagesPage.addEditCommissionPackage.form.confirmButton')}
          </Button>
        </Stack>
      </Stack>
      <GenericModal
        title={t('commissionPackagesPage.addEditCommissionPackage.modal.title')}
        message={
          <Trans i18nKey="commissionPackagesPage.addEditCommissionPackage.modal.message">
            Se confermi, verrà generato un nuovo pacchetto commissionale privato. Potrai gestire i
            destinatari in seguito.
            <br />
          </Trans>
        }
        openModal={showConfirmModal}
        onConfirmLabel={t('commissionPackagesPage.addEditCommissionPackage.modal.confirmButton')}
        onCloseLabel={t('commissionPackagesPage.addEditCommissionPackage.modal.backButton')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfirm={async () => {
          await submit(formik.values);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
};

export default AddEditCommissionPackageForm;
