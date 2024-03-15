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
import { TypeEnum } from '../../../api/generated/portal/BundleResource';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { bundleDetailsSelectors } from '../../../redux/slices/bundleDetailsSlice';
import { createBundle, updatePSPBundle } from '../../../services/bundleService';
import {
  LOADING_TASK_COMMISSION_BUNDLE_DETAIL,
  LOADING_TASK_CREATING_COMMISSION_BUNDLE,
} from '../../../utils/constants';
import { BundleRequest } from '../../../api/generated/portal/BundleRequest';
import { BundleResource } from '../../../api/generated/portal/BundleResource';
import AddEditCommissionBundleForm from './components/AddEditCommissionBundleForm';
import AddEditCommissionBundleTaxonomies from './components/AddEditCommissionBundleTaxonomies';

export interface AddEditCommissionBundlePageProps {
  edit?: boolean;
}

const minDateTomorrow = add(new Date(), { days: 1 });

const toNewFormData = (selectedParty: Party | undefined, data?: BundleResource): BundleRequest => ({
  abi: selectedParty?.pspData?.abi_code ?? '',
  description: data?.description ?? '',
  digitalStamp: data?.digitalStamp ?? false,
  digitalStampRestriction: data?.digitalStampRestriction ?? false,
  idBrokerPsp: data?.idBrokerPsp ?? '',
  idChannel: data?.idChannel ?? '',
  maxPaymentAmount: data?.maxPaymentAmount ?? 0,
  minPaymentAmount: data?.minPaymentAmount ?? 0,
  name: data?.name ?? '',
  paymentAmount: data?.paymentAmount ?? 0,
  paymentType: data?.paymentType ?? undefined,
  touchpoint: data?.touchpoint ?? undefined,
  transferCategoryList: data?.transferCategoryList
    ? data.transferCategoryList.map((item) => item.specific_built_in_data)
    : [''],
  type: data?.type ?? undefined,
  validityDateFrom: data?.validityDateFrom ?? minDateTomorrow,
  validityDateTo: data?.validityDateTo ?? minDateTomorrow,
  pspBusinessName: selectedParty?.description ?? '',
});

const validate = (
  values: Partial<BundleRequest>,
  edit: boolean | undefined,
  t: TFunction<'translation'>
) =>
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
          : (edit === undefined || edit !== true) &&
            values.validityDateFrom.getTime() < minDateTomorrow.getTime()
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

const AddEditCommissionBundlePage = ({ edit }: AddEditCommissionBundlePageProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const bundleDetails = useAppSelector(bundleDetailsSelectors.selectBundleDetails);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const setLoadingCreating = useLoading(LOADING_TASK_CREATING_COMMISSION_BUNDLE);
  const { bundleId, actionId } = useParams<{ bundleId: string; actionId: string }>();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formik = useFormik<Partial<BundleRequest>>({
    initialValues: toNewFormData(selectedParty, {}),
    validate: (values) => validate(values, edit, t),
    onSubmit: async () => {
      setShowConfirmModal(true);
    },
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const submit = async (body: BundleRequest) => {
    setLoadingCreating(true);
    const pspTaxCode = selectedParty?.fiscalCode ?? '';
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
          error: reason,
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
      const setForm = async () => {
        await formik.setValues(toNewFormData(selectedParty, bundleDetails));
      };
      setForm().finally(() => setLoading(false));
    }
  }, [selectedParty]);

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
              <Step key={'step-config'} completed={activeStep === 1} data-testid="step-config">
                <StepLabel>
                  {t('commissionBundlesPage.addEditCommissionBundle.form.bundleConfiguration')}
                </StepLabel>
              </Step>
              <Step key={'step-taxonomies'} data-testid="step-taxonomies">
                <StepLabel>
                  {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
                </StepLabel>
              </Step>
            </Stepper>
          </div>
        </Box>
        <div
          style={{ display: activeStep !== 0 ? 'none' : undefined }}
          data-testid="bundle-form-div"
        >
          <AddEditCommissionBundleForm formik={formik} actionId={actionId} />
        </div>
        <div
          style={{ display: activeStep !== 1 ? 'none' : undefined }}
          data-testid="bundle-taxonomies-div"
        >
          <AddEditCommissionBundleTaxonomies
            formik={formik}
            bundleTaxonomies={
              bundleDetails?.transferCategoryList && bundleDetails.transferCategoryList.length > 0
                ? [...bundleDetails.transferCategoryList]
                : []
            }
          />
        </div>
        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() =>
                activeStep === 0 ? history.goBack() : setActiveStep((prev) => prev - 1)
              }
              data-testid="back-step-button-test"
            >
              {t('general.back')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                if (activeStep === 0) {
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
              data-testid="open-modal-button-test"
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
