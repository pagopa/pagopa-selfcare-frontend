import { Grid, Typography, Stack, Breadcrumbs, Button } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { Bundle } from '../../../api/generated/portal/Bundle';
import SideMenu from '../../../components/SideMenu/SideMenu';
import { TypeEnum } from '../../../api/generated/portal/BundleRequest';
import { formatDateToDDMMYYYYhhmm } from '../../../utils/common-utils';
import { deletePSPBundle, getBundleDetailByPSP } from '../../../services/bundleService';
import GenericModal from '../../../components/Form/GenericModal';
import { Party } from '../../../model/Party';
import CommissionBundleDetailConfiguration from './CommissionBundleDetailConfiguration';
import CommissionBundleDetailTaxonomies from './CommissionBundleDetailTaxonomies';


const CommissionBundleDetailPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const selectedParty: Party | undefined = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const { bundleId } = useParams<{ bundleId: string }>();

  const [commissionBundleDetail, setCommissionBundleDetail] = useState<Bundle>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const pspTaxCode = selectedParty?.fiscalCode ? `PSP${selectedParty.fiscalCode}` : '';
    getBundleDetailByPSP(pspTaxCode, bundleId)
      .then((data) => {
        setCommissionBundleDetail(data);
      })
      .catch((reason) => {
        addError({
          id: 'GET_COMMISSION_BUNDLE_DETAILS',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting commission bundle details`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.list.error.commissionBundleDetailsErrorMessageDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }, [selectedParty]);

  function handleDeletePSP() {
    setLoading(true);
    const pspTaxCode = selectedParty?.fiscalCode ? `PSP${selectedParty.fiscalCode}` : '';
    deletePSPBundle(pspTaxCode, bundleId)
      .then((_) => {
        history.push(ROUTES.COMMISSION_BUNDLES);
      })
      .catch((reason: Error) => {
        addError({
          id: 'DELETE_COMMISSION_BUNDLE',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while deleting a commission bundle`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.commissionBundleDetail.error.deleteCommissionBundle'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Grid container sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid item xs={10} sx={{ backgroundColor: '#F5F6F7' }} pb={8} p={3}>
        <Breadcrumbs>
          <Typography>{t('general.Bundles')}</Typography>
          <Typography color={'text.disabled'}>
            {t('commissionBundlesPage.commissionBundleDetail.title')}
          </Typography>
        </Breadcrumbs>
        <Grid container mt={1} spacing={1}>
          {/* TODO Add alert for bundleType === Private if taxonomies not longer valid */}
          <Grid item xs={6}>
            <TitleBox title={commissionBundleDetail.name ?? ''} variantTitle="h4" />
            <Typography color={'text.disabled'} variant="subtitle1" sx={{ mb: 1 }}>
              {commissionBundleDetail.description ?? ''}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setShowConfirmModal(true)}
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
              >
                {t('general.modify')}
              </Button>
            </Stack>
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
          <Grid item xs={commissionBundleDetail?.type === TypeEnum.GLOBAL ? 12 : 6} data-testid="config-detail">
            <CommissionBundleDetailConfiguration bundleDetail={commissionBundleDetail} />
          </Grid>
          {commissionBundleDetail?.type !== TypeEnum.GLOBAL && (
            <Grid item xs={6} data-testid="taxonomies-detail">
              <CommissionBundleDetailTaxonomies bundleDetail={commissionBundleDetail} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <GenericModal
        title={t('commissionBundlesPage.commissionBundleDetail.modal.title')}
        message={t('commissionBundlesPage.commissionBundleDetail.modal.message')}
        openModal={showConfirmModal}
        onConfirmLabel={t('general.confirm')}
        onCloseLabel={t('general.cancel')}
        handleCloseModal={() => setShowConfirmModal(false)}
        handleConfirm={() => handleDeletePSP()}
        data-testid="delete-modal"
      />
    </Grid>
  );
};

export default CommissionBundleDetailPage;
