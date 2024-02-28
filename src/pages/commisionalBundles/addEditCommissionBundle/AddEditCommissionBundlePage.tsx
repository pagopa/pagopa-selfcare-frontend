import { ArrowBack } from '@mui/icons-material';
import { Grid, Stack, Breadcrumbs, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { getCommissionBundleDetails } from '../../../services/__mocks__/bundleService';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import { BundleRequest } from '../../../api/generated/portal/BundleRequest';
import AddEditCommissionBundleForm from './components/AddEditCommissionBundleForm';


const AddEditCommissionBundlePage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const { bundleId, actionId } = useParams<{ bundleId: string; actionId: string }>();
  const goBack = () => history.push(ROUTES.COMMISSION_BUNDLES);
  const [commissionBundleDetails, setCommissionBundleDetails] = useState<
    BundleRequest | undefined
  >();

  const getDetails = async () => {
    setLoading(true);
    try {
      // TODO verify if API for bundle detail is used
      const response = await getCommissionBundleDetails();
      setCommissionBundleDetails(response);
    } catch (reason) {
      addError({
        id: 'GET_COMMISSION_BUNDLE_DETAILS',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while getting commission bundle details`,
        toNotify: true,
        displayableTitle: t('commissionBundlesPage.addEditCommissionBundle.error.errorTitle'),
        displayableDescription: t(
          'commissionBundlesPage.addEditCommissionBundle.error.commissionBundleDetailsErrorMessageDesc'
        ),
        component: 'Toast',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bundleId && actionId === FormAction.Edit) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getDetails();
    }
  }, [selectedParty]);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={() => goBack()}
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
        {selectedParty && (
          <AddEditCommissionBundleForm commBundleDetails={commissionBundleDetails} />
        )}
      </Grid>
    </Grid>
  );
};

export default AddEditCommissionBundlePage;