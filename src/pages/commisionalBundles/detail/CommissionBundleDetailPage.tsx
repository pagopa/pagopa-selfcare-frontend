import { ArrowBack } from '@mui/icons-material';
import { Alert, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, generatePath, useHistory } from 'react-router-dom';
import {
  CIBundleResource,
  CiBundleStatusEnum,
} from '../../../api/generated/portal/CIBundleResource';
import { TypeEnum } from '../../../api/generated/portal/PSPBundleResource';
import { PSPBundleTaxonomy } from '../../../api/generated/portal/PSPBundleTaxonomy';
import GenericModal from '../../../components/Form/GenericModal';
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import { useOrganizationType } from '../../../hooks/useOrganizationType';
import { useUserRole } from '../../../hooks/useUserRole';
import {
  BundleDetailsActionTypes,
  BundleResource,
  FormAction,
} from '../../../model/CommissionBundle';
import { Party } from '../../../model/Party';
import { useAppSelector, useAppSelectorWithRedirect } from '../../../redux/hooks';
import { bundleDetailsSelectors } from '../../../redux/slices/bundleDetailsSlice';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import {
  deleteCIBundleRequest,
  deleteCIBundleSubscription,
  deletePSPBundle,
  rejectPrivateBundleOffer,
} from '../../../services/bundleService';
import { datesAreOnSameDay, formatDateToDDMMYYYYhhmm } from '../../../utils/common-utils';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import CommissionBundleDetailConfiguration from './components/CommissionBundleDetailConfiguration';
import CommissionBundleDetailTaxonomies from './components/CommissionBundleDetailTaxonomies';
import CommissionBundleDetailSubscriptionsTable from './components/subscriptions/CommissionBundleDetailSubscriptionsTable';

function RenderAlert({ bundleDetail }: Readonly<{ bundleDetail: BundleResource }>) {
  const { t } = useTranslation();

  if ((bundleDetail as CIBundleResource)?.ciBundleStatus === CiBundleStatusEnum.ON_REMOVAL) {
    return (
      <Alert severity={'error'} data-testid="alert-error-test" variant="outlined">
        {t('commissionBundlesPage.commissionBundleDetail.alert.onRemoval')}
      </Alert>
    );
  }
  // eslint-disable-next-line functional/no-let
  let expiredFound = false;
  (bundleDetail?.bundleTaxonomies as Array<PSPBundleTaxonomy>)?.forEach((el: PSPBundleTaxonomy) => {
    if (el.endDate) {
      const endDate = new Date(el.endDate);
      if (endDate <= new Date()) {
        expiredFound = true;
      }
    }
  });
  if (expiredFound) {
    return (
      <Alert severity={'warning'} data-testid="alert-warning-test" variant="outlined">
        {t('commissionBundlesPage.commissionBundleDetail.alert.expiredTaxonomies')}
      </Alert>
    );
  }
  return null;
}

const BundleActionButtons = ({
  setShowConfirmModal,
  bundleDetail,
  bundleId,
}: {
  setShowConfirmModal: (arg: BundleDetailsActionTypes | null) => void;
  bundleDetail: BundleResource;
  bundleId: string;
// eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation();
  const { orgInfo } = useOrganizationType();
  const { userIsAdmin } = useUserRole();

  if (userIsAdmin) {
    if (orgInfo.types.isPsp) {
      return (
        <>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setShowConfirmModal(BundleDetailsActionTypes.DELETE_BUNDLE_PSP)}
            data-testid="delete-button"
          >
            {t('general.delete')}
          </Button>
          <Button
            component={Link}
            to={generatePath(ROUTES.COMMISSION_BUNDLES_EDIT, {
              bundleId,
              actionId: FormAction.Edit,
            })}
            variant="contained"
            data-testid="modify-button"
          >
            {t('general.modify')}
          </Button>
        </>
      );
    }
    if (orgInfo.types.isEc) {
      if (
        (bundleDetail as CIBundleResource).ciBundleStatus === CiBundleStatusEnum.AVAILABLE &&
        // TODO remove after VAS-1104
        !(bundleDetail?.validityDateTo && 
        datesAreOnSameDay(new Date(), bundleDetail?.validityDateTo))
      ) {
        return (
          <>
            {bundleDetail.type === TypeEnum.PRIVATE && (
              <Button
                onClick={() => setShowConfirmModal(BundleDetailsActionTypes.REJECT_OFFER_EC)}
                variant="outlined"
                color="error"
                data-testid="reject-button"
              >
                {t('general.reject')}
              </Button>
            )}
            <Button
              component={Link}
              to={ROUTES.COMMISSION_BUNDLES_ACTIVATE}
              variant="contained"
              data-testid="activate-button"
            >
              {t('general.activate')}
            </Button>
          </>
        );
      }
      if ((bundleDetail as CIBundleResource).ciBundleStatus === CiBundleStatusEnum.ENABLED) {
        return (
          <Button
            onClick={() => setShowConfirmModal(BundleDetailsActionTypes.DELETE_BUNDLE_EC)}
            variant="outlined"
            color="error"
            data-testid="deactivate-button"
          >
            {t('general.deactivate')}
          </Button>
        );
      }
      if ((bundleDetail as CIBundleResource).ciBundleStatus === CiBundleStatusEnum.REQUESTED) {
        return (
          <Button
            onClick={() => setShowConfirmModal(BundleDetailsActionTypes.DELETE_REQUEST_EC)}
            variant="outlined"
            color="error"
            data-testid="delete-request-button"
          >
            {t('commissionBundlesPage.deleteRequest')}
          </Button>
        );
      }
    }
  }

  return null;
};

const CommissionBundleDetailPage = () => {
  const { t } = useTranslation();
  const { orgInfo } = useOrganizationType();
  const { userIsAdmin } = useUserRole();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const selectedParty: Party | undefined = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();

  const commissionBundleDetail: BundleResource = useAppSelectorWithRedirect({
    selector: bundleDetailsSelectors.selectBundleDetails,
    routeToRedirect: ROUTES.COMMISSION_BUNDLES,
  });
  const bundleId = commissionBundleDetail.idBundle ?? '';
  const [showConfirmModal, setShowConfirmModal] = useState<BundleDetailsActionTypes | null>(null);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function handleModalAction() {
    setLoading(true);
    const pspTaxCode = selectedParty?.fiscalCode ?? '';

    // eslint-disable-next-line functional/no-let
    let promise: Promise<string | void> | undefined;
    if (showConfirmModal) {
      if (showConfirmModal === BundleDetailsActionTypes.DELETE_BUNDLE_PSP) {
        promise = deletePSPBundle(
          pspTaxCode,
          bundleId,
          commissionBundleDetail.name ?? '',
          selectedParty?.description ?? '',
          commissionBundleDetail.type ?? ''
        );
      } else if (showConfirmModal === BundleDetailsActionTypes.DELETE_BUNDLE_EC) {
        promise = deleteCIBundleSubscription(
          (commissionBundleDetail as CIBundleResource)?.ciBundleId ?? '',
          selectedParty?.fiscalCode ?? '',
          commissionBundleDetail?.name ?? ''
        );
      } else if (showConfirmModal === BundleDetailsActionTypes.DELETE_REQUEST_EC) {
        promise = deleteCIBundleRequest({
          idBundleRequest: (commissionBundleDetail as CIBundleResource)?.ciRequestId ?? '',
          ciTaxCode: selectedParty?.fiscalCode ?? '',
        });
      } else if (showConfirmModal === BundleDetailsActionTypes.REJECT_OFFER_EC) {
        promise = rejectPrivateBundleOffer({
          ciTaxCode: selectedParty?.fiscalCode ?? '',
          idBundleOffer: (commissionBundleDetail as CIBundleResource)?.ciOfferId ?? '',
          pspTaxCode: commissionBundleDetail.idBrokerPsp ?? '',
          bundleName: commissionBundleDetail.name ?? '',
        });
      }
      if (promise) {
        promise
          .then(() => {
            history.push(ROUTES.COMMISSION_BUNDLES);
          })
          .catch((reason: Error) => {
            addError({
              id: showConfirmModal,
              blocking: false,
              error: reason,
              techDescription: `An error occurred with the commission bundle action`,
              toNotify: true,
              displayableTitle: t('general.errorTitle'),
              displayableDescription: t(
                `commissionBundlesPage.commissionBundleDetail.error.${showConfirmModal}`
              ),
              component: 'Toast',
            });
          })
          .finally(() => {
            setShowConfirmModal(null);
            setLoading(false);
          });
      }
    }
  }

  return (
    <>
      <SideMenuLayout>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => history.push(ROUTES.COMMISSION_BUNDLES)}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
            data-testid="exit-btn-test"
          >
            {t('general.back')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.Bundles')}</Typography>
            <Typography color={'action.active'}>
              {t('commissionBundlesPage.commissionBundleDetail.title')}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid container mt={1} spacing={1}>
          <Grid item xs={6}>
            <TitleBox title={commissionBundleDetail.name ?? ''} variantTitle="h4" />
            <Typography color={'action.active'} variant="subtitle1" sx={{ mb: 1 }}>
              {commissionBundleDetail.description ?? ''}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              <BundleActionButtons
                setShowConfirmModal={setShowConfirmModal}
                bundleDetail={commissionBundleDetail}
                bundleId={bundleId}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <RenderAlert bundleDetail={commissionBundleDetail} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">
              {t('commissionBundlesPage.commissionBundleDetail.title')}
            </Typography>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent={'flex-end'}>
            <Typography color="text.secondary">
              {t('commissionBundlesPage.commissionBundleDetail.updatedOn')}{' '}
              <Typography component={'span'} color="text.primary" fontWeight="medium">
                {commissionBundleDetail?.lastUpdatedDate &&
                  formatDateToDDMMYYYYhhmm(commissionBundleDetail?.lastUpdatedDate)}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6} data-testid="config-detail">
            <CommissionBundleDetailConfiguration bundleDetail={commissionBundleDetail} />
          </Grid>

          <Grid item xs={6} data-testid="taxonomies-detail">
            <CommissionBundleDetailTaxonomies bundleDetail={commissionBundleDetail} />
          </Grid>

          {orgInfo.types.isPsp &&
            userIsAdmin &&
            isValidBundleForSubscriptionTable(commissionBundleDetail) && (
              <Grid
                item
                xs={12}
                data-testid={
                  commissionBundleDetail.type === TypeEnum.PUBLIC
                    ? 'subscription-table'
                    : 'offer-table'
                }
              >
                <CommissionBundleDetailSubscriptionsTable bundleDetail={commissionBundleDetail} />
              </Grid>
            )}
        </Grid>
      </SideMenuLayout>
      {showConfirmModal && (
        <GenericModal
          title={t(`commissionBundlesPage.commissionBundleDetail.modal.title.${showConfirmModal}`)}
          message={t(
            `commissionBundlesPage.commissionBundleDetail.modal.message.${showConfirmModal}`
          )}
          openModal={showConfirmModal !== null}
          onConfirmLabel={t('general.confirm')}
          onCloseLabel={t('general.turnBack')}
          handleCloseModal={() => setShowConfirmModal(null)}
          handleConfirm={() => handleModalAction()}
          data-testid="delete-modal"
        />
      )}
    </>
  );
};

export default CommissionBundleDetailPage;

function isValidBundleForSubscriptionTable(commissionBundleDetail: BundleResource) {
  return (
    commissionBundleDetail.type !== TypeEnum.GLOBAL &&
    commissionBundleDetail.validityDateFrom &&
    new Date().getTime() > commissionBundleDetail.validityDateFrom.getTime()
  );
}
