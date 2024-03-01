/* eslint-disable sonarjs/cognitive-complexity */
import { ArrowBack } from '@mui/icons-material';
import { useFormik } from 'formik';
import { add } from 'date-fns';
import {
  Grid,
  Stack,
  Breadcrumbs,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper,
  Button,
  StepContent,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation, TFunction } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GenericModal from '../../../components/Form/GenericModal';
import { Party } from '../../../model/Party';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { TypeEnum } from '../../../api/generated/portal/Bundle';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import {
  createBundle,
  getBundleDetailByPSP,
  updatePSPBundle,
} from '../../../services/bundleService';
import {
  LOADING_TASK_COMMISSION_BUNDLE_DETAIL,
  LOADING_TASK_CREATING_COMMISSION_BUNDLE,
} from '../../../utils/constants';
import { BundleRequest } from '../../../api/generated/portal/BundleRequest';
import AddEditCommissionBundleForm from './components/AddEditCommissionBundleForm';
import AddEditCommissionBundleTaxonomies from './components/AddEditCommissionBundleTaxonomies';

const minDateTomorrow = add(new Date(), { days: 1 });

const initialFormData = (selectedParty: Party | undefined, detail?: BundleRequest) => ({
  abi: detail?.abi ?? '', // TODO insert ABI code value
  description: detail?.description ?? '',
  digitalStamp: detail?.digitalStamp ?? false,
  digitalStampRestriction: detail?.digitalStampRestriction ?? false,
  idBrokerPsp: detail?.idBrokerPsp ?? '',
  idCdi: detail?.idCdi ?? '',
  idChannel: detail?.idChannel ?? '',
  maxPaymentAmount: detail?.maxPaymentAmount ?? 0,
  minPaymentAmount: detail?.minPaymentAmount ?? 0,
  name: detail?.name ?? '',
  paymentAmount: detail?.paymentAmount ?? 0,
  paymentType: detail?.paymentType ?? undefined,
  touchpoint: detail?.touchpoint ?? undefined,
  transferCategoryList: detail?.transferCategoryList ? [...detail.transferCategoryList] : [''],
  type: detail?.type ?? undefined,
  validityDateFrom: detail?.validityDateFrom ?? minDateTomorrow,
  validityDateTo: detail?.validityDateTo ?? minDateTomorrow,
  pspBusinessName: selectedParty?.description ?? '',
});

const validate = (values: Partial<BundleRequest>, t: TFunction<'translation'>) =>
  Object.fromEntries(
    Object.entries({
      ...{
        description: !values.description
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        idChannel: !values.idChannel
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        maxPaymentAmount: !values.maxPaymentAmount
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        minPaymentAmount: !values.minPaymentAmount
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        name: !values.name
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        paymentAmount: !values.paymentAmount
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        type: !values.type
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : undefined,
        validityDateFrom: !values.validityDateFrom
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : values.validityDateFrom.getTime() < minDateTomorrow.getTime()
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.dateNotValid')
          : values.validityDateTo &&
            values.validityDateFrom.getTime() > values.validityDateTo.getTime()
          ? t(
              'commissionBundlesPage.addEditCommissionBundle.validationMessage.startDateOverEndDate'
            )
          : undefined,
        validityDateTo: !values.validityDateTo
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.requiredField')
          : values.validityDateTo.getTime() < minDateTomorrow.getTime()
          ? t('commissionBundlesPage.addEditCommissionBundle.validationMessage.dateNotValid')
          : values.validityDateFrom &&
            values.validityDateTo.getTime() < values.validityDateFrom.getTime()
          ? t(
              'commissionBundlesPage.addEditCommissionBundle.validationMessage.endDateUnderStartDate'
            )
          : undefined,
      },
    }).filter(([_key, value]) => value)
  );

const enableSubmit = (values: BundleRequest) =>
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
  values.validityDateFrom != null &&
  values.validityDateFrom.getTime() > 0 &&
  values.validityDateTo != null &&
  values.validityDateTo.getTime() > 0;

const AddEditCommissionBundlePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_BUNDLE);
  const { bundleId, actionId } = useParams<{ bundleId: string; actionId: string }>();
  const [commissionBundleDetails, setCommissionBundleDetails] = useState<
    BundleRequest | undefined
  >();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formik = useFormik<Partial<BundleRequest>>({
    initialValues: initialFormData(selectedParty, commissionBundleDetails),
    validate: (values) => validate(values, t),
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const submit = async (body: BundleRequest) => {
    setLoadingCreating(true);
    const pspTaxCode = selectedParty?.fiscalCode ? `PSP${selectedParty.fiscalCode}` : '';
    const isEdit = actionId === FormAction.Edit;

    const promise = isEdit
      ? updatePSPBundle(pspTaxCode, bundleId, body)
      : createBundle(pspTaxCode, body);

    promise
      .then((_) => {
        history.push(ROUTES.COMMISSION_BUNDLES);
      })
      .catch((reason: Error) => {
        addError({
          id: `${isEdit ? 'UPDATE' : 'CREATE'}_COMMISSION_BUNDLE`,
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while updating the commission bundle`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            `commissionBundlesPage.addEditCommissionBundle.error.errorMessage${
              isEdit ? 'Updating' : 'Creating'
            }Bundle`
          ),
          component: 'Toast',
        });
      })
      .finally(() => {
        setLoadingCreating(false);
      });
  };

  const openConfirmModal = () => {
    if (formik.isValid) {
      setShowConfirmModal(true);
    } else {
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    if (bundleId && actionId === FormAction.Edit) {
      setLoading(true);
      const pspTaxCode = selectedParty?.fiscalCode ? `PSP${selectedParty.fiscalCode}` : '';
      getBundleDetailByPSP(pspTaxCode, bundleId)
        .then(async (data) => {
          setCommissionBundleDetails(data);
          await formik.setValues(data);
        })
        .catch((reason: Error) => {
          addError({
            id: 'GET_COMMISSION_BUNDLE_DETAILS',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while getting commission bundle details`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'commissionBundlesPage.addEditCommissionBundle.error.errorMessageAllDataDesc'
            ),
            component: 'Toast',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [selectedParty]);

  const isTaxonomiesStepEnabled = () =>
    formik.values.type === TypeEnum.PRIVATE || formik.values.type === TypeEnum.PUBLIC;

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => history.push(ROUTES.COMMISSION_BUNDLES)}
            startIcon={<ArrowBack data-testid="arrow-back-test" />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography variant="body2">
              {t('commissionBundlesPage.addEditCommissionBundle.breadcrumb.first')}
            </Typography>
            <Typography variant="body2" fontWeight={'medium'}>
              {t('commissionBundlesPage.addEditCommissionBundle.breadcrumb.second')}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t('commissionBundlesPage.addEditCommissionBundle.title')}
          subTitle={t('commissionBundlesPage.addEditCommissionBundle.subtitle')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <Box my={3} display="flex" justifyContent="center">
          <div style={{ width: '40%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step key={'step-config'} completed={activeStep === 1}>
                <StepLabel>
                  {t('commissionBundlesPage.addEditCommissionBundle.form.bundleConfiguration')}
                </StepLabel>
              </Step>
              {isTaxonomiesStepEnabled() && (
                <Step key={'step-taxonomies'}>
                  <StepLabel>
                    {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
                  </StepLabel>
                </Step>
              )}
            </Stepper>
          </div>
        </Box>
        <div style={{ display: activeStep !== 0 ? 'none' : undefined }}>
          <AddEditCommissionBundleForm formik={formik} actionId={actionId} />
        </div>
        <div style={{ display: activeStep !== 1 ? 'none' : undefined }}>
          <AddEditCommissionBundleTaxonomies {...formik} />
        </div>
        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() =>
                activeStep === 0 ? history.goBack() : setActiveStep((prev) => prev - 1)
              }
              data-testid="cancel-button-test"
            >
              {t('general.back')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                if (isTaxonomiesStepEnabled() && activeStep === 0) {
                  setActiveStep((prev) => prev + 1);
                } else {
                  formik.handleSubmit();
                  openConfirmModal();
                }
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
        <GenericModal
          title={t('commissionBundlesPage.addEditCommissionBundle.modal.title')}
          message={t(
            `commissionBundlesPage.addEditCommissionBundle.modal.message${formik.values.type}`
          )}
          openModal={showConfirmModal}
          onConfirmLabel={t('general.confirm')}
          onCloseLabel={t('general.cancel')}
          handleCloseModal={() => setShowConfirmModal(false)}
          handleConfirm={async () => {
            await submit(formik.values);
            setShowConfirmModal(false);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default AddEditCommissionBundlePage;
