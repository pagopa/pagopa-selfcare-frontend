/* eslint-disable complexity */
import {
  Grid,
  Typography,
  Paper,
  Stack,
  Breadcrumbs,
  Button,
  Drawer,
  Divider,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Box } from '@mui/system';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { isOperator } from '../../components/commonFunctions';
import { getCommissionBundleDetails } from '../../../services/__mocks__/bundleService';
import { useAppSelector } from '../../../redux/hooks';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { Bundle } from '../../../api/generated/portal/Bundle';
import SideMenu from '../../../components/SideMenu/SideMenu';

const bundleConfigurationFields = [
  ['paymentType', 'commissionBundlesPage.addEditCommissionBundle.form.paymentType'],
  ['touchpoint', 'commissionBundlesPage.addEditCommissionBundle.form.touchpoint'],
  ['minPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.minImport'],
  ['maxPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.maxImport'],
  ['paymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.commission'],
  ['idBrokerPsp', 'commissionBundlesPage.addEditCommissionBundle.form.brokerCode'],
  ['idChannel', 'commissionBundlesPage.addEditCommissionBundle.form.channelCode'],
  ['digitalStamp', 'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'],
  [
    'digitalStampRestriction',
    'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp',
  ],
  ['validityDateFrom', 'commissionBundlesPage.list.headerFields.startDate'],
  ['validityDateTo', 'commissionBundlesPage.list.headerFields.endDate'],
  ['lastUpdateDate', 'commissionBundlesPage.commissionBundleDetail.lastChange'],
  // TODO updatedBy/"Modificato da" (API doesn't retrieve this info)
];
const BundleConfigurationDetails = ({ bundleDetail }: { bundleDetail: Bundle }) => {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Paper elevation={8} sx={{ borderRadius: 4 }}>
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.configuration')}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {t('commissionBundlesPage.addEditCommissionBundle.form.paymentType')}
      </Typography>
      <Typography variant="body2">{bundleDetail.paymentType}</Typography>
      <Typography variant="body2" color="text.disabled">
        {t('commissionBundlesPage.addEditCommissionBundle.form.touchpoint')}
      </Typography>
      <Typography variant="body2">{bundleDetail.touchpoint}</Typography>
      <Typography variant="body2" color="text.disabled">
        {t('commissionBundlesPage.addEditCommissionBundle.form.commission')}
      </Typography>
      <Typography variant="body2">{bundleDetail.paymentAmount}</Typography>
      <ButtonNaked
        size="medium"
        component="button"
        onClick={() => setOpenDrawer(true)}
        sx={{ color: 'primary.main', mr: '20px' }}
        weight="default"
        data-testid="show-more-bundle-configuration-test"
      >
        + {t('general.showMore')}
      </ButtonNaked>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <TitleBox
          title={t('commissionBundlesPage.commissionBundleDetail.configuration')}
          variantTitle="h4"
        />
        {bundleConfigurationFields.map((entry: Array<string>, index) => (
          <>
            {index !== 0 ? <Divider /> : <></>}
            <Typography variant="body2" color="text.disabled">
              {t(entry[1])}
            </Typography>
            <Typography variant="body2">
              {bundleDetail[entry[0] as keyof typeof bundleDetail]}
            </Typography>
          </>
        ))}
      </Drawer>
    </Paper>
  );
};

const BundleTaxonomiesDetails = ({ bundleDetail }: { bundleDetail: Bundle }) => {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Paper elevation={8} sx={{ borderRadius: 4 }}>
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
      </Typography>
      {bundleDetail?.transferCategoryList?.map((el, i) =>
        i < 4 ? (
          <>
            {/* TODO RETRIEVE TAXONOMIES */}
            <Typography variant="body2" color="text.disabled">
              {el}
            </Typography>
            <Typography variant="body1">{el}</Typography>
          </>
        ) : (
          <></>
        )
      )}
      <ButtonNaked
        size="medium"
        component="button"
        onClick={() => setOpenDrawer(true)}
        sx={{ color: 'primary.main', mr: '20px' }}
        weight="default"
        data-testid="show-more-bundle-taxonomies-test"
      >
        + {t('general.showMore')}
      </ButtonNaked>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <TitleBox
          title={t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
          variantTitle="h4"
        />
        {bundleDetail?.transferCategoryList?.map((el) => (
          <>
            {/* TODO RETRIEVE TAXONOMIES */}
            <Typography variant="body2" color="text.disabled">
              {el}
            </Typography>
            <Typography variant="body1">{el}</Typography>
          </>
        ))}
      </Drawer>
    </Paper>
  );
};

const CommissionBundleDetailPage = () => {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const { bundleId } = useParams<{ bundleId: string }>();
  const [commissionBundleDetail, setCommissionBundleDetail] = useState<Bundle>({} as any);

  useEffect(() => {
    setLoading(true);
    // TODO verify if API for bundle detail is used
    getCommissionBundleDetails()
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
          displayableTitle: t('commissionBundlesPage.list.error.errorTitle'),
          displayableDescription: t(
            'commissionBundlesPage.list.error.commissionBundleDetailsErrorMessageDesc'
          ),
          component: 'Toast',
        });
      })
      .finally(() => setLoading(false));
  }, [selectedParty]);

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={8}
      >
        <Breadcrumbs>
          <Typography>{t('general.Bundles')}</Typography>
          <Typography color={'text.disaled'}>
            {'commissionBundlesPage.commissionBundleDetail.title'}
          </Typography>
        </Breadcrumbs>
        <Grid container mt={3} spacing={1}>
          {/* TODO Add alert for bundleType === Private if taxonomies not longer valid */}
          <Grid item xs={6}>
            <TitleBox title={commissionBundleDetail.name ?? ''} mbTitle={2} variantTitle="h3" />
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
              <Button
                color="error"
                variant="outlined"
                onClick={() => '' /* TODO DELETE BUTTON ACTION */}
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
            <TitleBox
              title={t('commissionBundlesPage.commissionBundleDetail.title')}
              variantTitle="h4"
            />
          </Grid>
          <Grid item xs={6} alignContent={'flex-end'}>
            <Typography color="text.secondary">
              {t('commissionBundlesPage.commissionBundleDetail.updatedOn')}{' '}
              <Typography component={'span'} color="text.secondary">
                {commissionBundleDetail?.lastUpdatedDate?.toLocaleDateString('en-GB')}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <BundleConfigurationDetails bundleDetail={commissionBundleDetail} />
          </Grid>
          <Grid item xs={6}>
            <BundleTaxonomiesDetails bundleDetail={commissionBundleDetail} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CommissionBundleDetailPage;