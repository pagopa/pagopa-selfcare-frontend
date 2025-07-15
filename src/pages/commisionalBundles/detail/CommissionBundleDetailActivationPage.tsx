import { useState } from 'react';
import { Box, Breadcrumbs, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import EuroIcon from '@mui/icons-material/Euro';
import ROUTES from '../../../routes';
import GenericModal from '../../../components/Form/GenericModal';
import { useAppSelector, useAppSelectorWithRedirect } from '../../../redux/hooks';
import { bundlesSelectors } from '../../../redux/slices/bundlesSlice';
import { LOADING_TASK_COMMISSION_BUNDLE_ACTIVATION } from '../../../utils/constants';
import {
  acceptPrivateBundleOffer,
  createCIBundleRequest,
  getSpecificBuiltInData,
} from '../../../services/bundleService';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { PublicBundleRequest } from '../../../api/generated/portal/PublicBundleRequest';
import {
  formatCurrencyEur,
  formatCurrencyStringToNumberCent,
} from '../../../utils/common-utils';
import { CIBundleResource } from '../../../api/generated/portal/CIBundleResource';
import { TransferCategoryRelationEnum } from '../../../api/generated/portal/CIBundleAttribute';
import { BundleResource } from '../../../model/CommissionBundle';
import { TypeEnum } from '../../../api/generated/portal/BundleRequest';
import { CIBundleId } from '../../../api/generated/portal/CIBundleId';

const initBundleRequest = (
  bundleDetails: CIBundleResource | undefined,
  ciTaxCode: string | undefined
): Partial<PublicBundleRequest> => ({
  ciFiscalCode: ciTaxCode ?? '',
  idBundle: bundleDetails?.idBundle ?? '',
  attributes: bundleDetails?.bundleTaxonomies?.length
    ? bundleDetails?.bundleTaxonomies?.map((el) => ({
        maxPaymentAmount: 0,
        transferCategory: el.specificBuiltInData,
        transferCategoryRelation: TransferCategoryRelationEnum.EQUAL,
        transferCategoryType: el.serviceType,
      }))
    : [
        {
          maxPaymentAmount: 0,
          transferCategoryRelation: TransferCategoryRelationEnum.EQUAL,
        },
      ],
  idPsp: bundleDetails?.idBrokerPsp,
});

const componentPath = 'commissionBundlesPage.commissionBundleDetail.activationPage';
export default function CommissionBundleDetailActivationPage() {
  const history = useHistory();
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_ACTIVATION);
  const addError = useErrorDispatcher();

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const bundleDetails: CIBundleResource =
    useAppSelectorWithRedirect({
      selector: bundlesSelectors.selectBundles,
      routeToRedirect: ROUTES.COMMISSION_BUNDLES,
      conditionToRedirect: (el: BundleResource) => el.type === TypeEnum.GLOBAL,
    }) ?? {};

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [bundleRequest, setBundleRequest] = useState<Partial<PublicBundleRequest>>(
    initBundleRequest(bundleDetails, selectedParty?.fiscalCode)
  );
  const [inputErrors, setInputErrors] = useState<Record<number, string>>({});

  function handleBundleActivation() {
    setLoading(true);

    // eslint-disable-next-line functional/no-let
    let promise: Promise<CIBundleId | void> | undefined;
    if (bundleDetails.type === TypeEnum.PRIVATE) {
      promise = acceptPrivateBundleOffer({
        ciTaxCode: selectedParty?.fiscalCode ?? '',
        idBundleOffer: bundleDetails.ciOfferId ?? '',
        pspTaxCode: bundleDetails.idBrokerPsp ?? '',

        bundleName: bundleDetails?.name ?? '',
        ciBundleAttributes: { attributes: [...(bundleRequest.attributes ?? [])] },
      });
    } else if (bundleDetails.type === TypeEnum.PUBLIC) {
      promise = createCIBundleRequest({
        ciTaxCode: selectedParty?.fiscalCode ?? '',
        bundleName: bundleDetails?.name ?? '',
        bundleRequest,
      });
    }

    if (promise) {
      promise
        .then(() => {
          setShowConfirmModal(false);
          history.push(ROUTES.COMMISSION_BUNDLES);
        })
        .catch((reason: Error) => {
          addError({
            id: 'ACTIVATE_COMMISSION_BUNDLE',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while activating the commission bundle`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(`${componentPath}.errorMessage`),
            component: 'Toast',
          });
        })
        .finally(() => {
          setShowConfirmModal(false);
          setLoading(false);
        });
    }
  }

  function handleChangeCommissions(value: string, index: number) {
    const numericValue = value ? formatCurrencyStringToNumberCent(value) : 0;
    if (bundleDetails?.paymentAmount !== undefined && numericValue > bundleDetails.paymentAmount) {
      setInputErrors((prev) => ({ ...prev, [index]: t(`${componentPath}.errorCommission`) }));
    } else {
      setInputErrors((prev) => {
        const newObj = { ...prev };
        // eslint-disable-next-line functional/immutable-data
        delete newObj[index];
        return newObj;
      });
    }
    setBundleRequest((prev) => {
      const attributes = prev.attributes ?? [];
      // eslint-disable-next-line functional/immutable-data
      attributes[index].maxPaymentAmount = numericValue;
      return { ...prev, attributes };
    });
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => history.push(ROUTES.COMMISSION_BUNDLES_DETAIL)}
            startIcon={<ArrowBack data-testid="arrow-back-test" />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{bundleDetails?.name}</Typography>
            <Typography color="action.active">{t(`${componentPath}.title`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`${componentPath}.title`)}
          subTitle={t(`${componentPath}.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" mb={3}>
            {t(`${componentPath}.titleFirstSection`)}
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <Box width="50%">
                <Typography variant="overline">{t(`${componentPath}.amountRange`)}</Typography>
                <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                  <Typography variant="body2">{t('general.min')}</Typography>
                  <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {formatCurrencyEur(bundleDetails?.minPaymentAmount)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">{t('general.max')}</Typography>
                  <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {formatCurrencyEur(bundleDetails?.maxPaymentAmount)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box width="50%">
                <Typography variant="overline">{t(`${componentPath}.commissions`)}</Typography>
                <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                  <Typography variant="body2">{t(`${componentPath}.commissions`)}</Typography>
                  <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {formatCurrencyEur(bundleDetails?.paymentAmount)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
          <Typography variant="h6" mb={3}>
            {t(`${componentPath}.titleSecondSection`)}
          </Typography>
          {bundleRequest?.attributes?.map((el: any, index) => (
            <Box
              sx={{ border: '1px solid #E3E7EB', p: 3, my: 2 }}
              key={`attribute-${el.transferCategory ?? 'all'}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body1" fontWeight={'fontWeightMedium'} sx={{ mb: 1 }}>
                  {getSpecificBuiltInData(t, el.transferCategory)}
                </Typography>
                <Typography variant="body2" color={'action.active'} fontWeight={'fontWeightMedium'}>
                  {el.transferCategoryType}
                </Typography>
              </Box>
              <Box width="20%">
                <NumericFormat
                  fullWidth
                  id="paymentAmount"
                  name="paymentAmount"
                  customInput={TextField}
                  label={t(`${componentPath}.commissionInput`)}
                  size="small"
                  value={el.maxPaymentAmount / 100}
                  onValueChange={({ value }) => handleChangeCommissions(value, index)}
                  thousandSeparator=""
                  decimalSeparator=","
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={false}
                  error={Boolean(inputErrors[index])}
                  helperText={inputErrors[index] ?? ''}
                  InputProps={{
                    endAdornment: <EuroIcon sx={{ color: 'GrayText' }} />,
                  }}
                  inputProps={{ 'data-testid': 'payment-amount-test' }}
                />
              </Box>
            </Box>
          ))}
        </Paper>
        <Stack direction="row" justifyContent="space-between" mt={5}>
          <Stack display="flex" justifyContent="flex-start" mr={2}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => history.goBack()}
              data-testid="back-step-button-test"
            >
              {t('general.back')}
            </Button>
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setShowConfirmModal(true)}
              color="primary"
              variant="contained"
              type="submit"
              data-testid="open-modal-button-test"
              disabled={Object.keys(inputErrors).length > 0}
            >
              {t('general.confirm')}
            </Button>
          </Stack>
        </Stack>
        <GenericModal
          title={t(`${componentPath}.modal.${bundleDetails.type}.title`)}
          message={t(`${componentPath}.modal.${bundleDetails.type}.message`)}
          openModal={showConfirmModal}
          onConfirmLabel={t('general.confirm')}
          onCloseLabel={t('general.turnBack')}
          handleCloseModal={() => setShowConfirmModal(false)}
          handleConfirm={() => handleBundleActivation()}
        />
      </Grid>
    </Grid>
  );
}
