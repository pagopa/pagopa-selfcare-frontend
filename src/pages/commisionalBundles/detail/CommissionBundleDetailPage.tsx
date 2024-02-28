import {
  Grid,
  Typography,
  Paper,
  Stack,
  Breadcrumbs,
  Button,
  Drawer,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Box } from '@mui/system';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation, TFunction } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ROUTES from '../../../routes';
import { getCommissionBundleDetails } from '../../../services/__mocks__/bundleService';
import { useAppSelector } from '../../../redux/hooks';
import { LOADING_TASK_COMMISSION_BUNDLE_DETAIL } from '../../../utils/constants';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { FormAction } from '../../../model/CommissionBundle';
import { Bundle } from '../../../api/generated/portal/Bundle';
import SideMenu from '../../../components/SideMenu/SideMenu';
import { TypeEnum } from '../../../api/generated/portal/BundleRequest';
import {
  formatBooleanValueToYesOrNo,
  formatCurrencyEur,
  formatDateToDDMMYYYY,
  formatDateToDDMMYYYYhhmm,
} from '../../../utils/common-utils';

const PaddedDrawer = ({
  openDrawer,
  setOpenDrawer,
  children,
}: {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => (
  <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right">
    <Box p={3} pt={1} sx={{ minWidth: '400px' }}>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <IconButton onClick={() => setOpenDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </Box>
  </Drawer>
);

const bundleConfigurationFields = {
  col1: [
    ['paymentType', 'commissionBundlesPage.addEditCommissionBundle.form.paymentType'],
    ['touchpoint', 'commissionBundlesPage.addEditCommissionBundle.form.touchpoint'],
    ['paymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.commission'],
  ],
  col2: [
    ['minPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.minImport'],
    ['maxPaymentAmount', 'commissionBundlesPage.addEditCommissionBundle.form.maxImport'],
    ['idBrokerPsp', 'commissionBundlesPage.addEditCommissionBundle.form.brokerCode'],
  ],
  col3: [
    ['idChannel', 'commissionBundlesPage.addEditCommissionBundle.form.channelCode'],
    ['digitalStamp', 'commissionBundlesPage.addEditCommissionBundle.form.paymentWithDigitalStamp'],
    [
      'digitalStampRestriction',
      'commissionBundlesPage.addEditCommissionBundle.form.paymentOnlyDigitalStamp',
    ],
  ],
  col4: [
    ['validityDateFrom', 'commissionBundlesPage.list.headerFields.startDate'],
    ['validityDateTo', 'commissionBundlesPage.list.headerFields.endDate'],
    ['lastUpdatedDate', 'commissionBundlesPage.commissionBundleDetail.lastChange'],
  ],
  // TODO updatedBy/"Modificato da" (API doesn't retrieve this info)
};
const formatConfigValues = (value: any, t: TFunction<'translation'>) => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean') {
    return formatBooleanValueToYesOrNo(value, t);
  }
  if (typeof value === 'number') {
    return formatCurrencyEur(value);
  }
  if (typeof value === 'object') {
    return formatDateToDDMMYYYY(value);
  }
  return '';
};
const BundleConfigurationDetails = ({ bundleDetail }: { bundleDetail: Bundle }) => {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const bundleTypeGlobal: boolean = bundleDetail?.type === TypeEnum.GLOBAL;

  const columns: Array<Array<Array<string>>> = bundleTypeGlobal
    ? Object.values(bundleConfigurationFields)
    : new Array(bundleConfigurationFields.col1);

  const mapColumn = (col: Array<Array<string>>, isDrawer: boolean, isFirstColumn?: boolean) =>
    col.map((entry: Array<string>, index: number) => (
      <Box mt={1} key={`config-detail-${entry[0]}`}>
        {((isDrawer && !isFirstColumn) || index !== 0) && <Divider />}
        <Typography variant="body1" color="text.disabled">
          {t(entry[1])}
        </Typography>
        <Typography variant="body1">
          {formatConfigValues(bundleDetail?.[entry[0] as keyof Bundle], t)}
        </Typography>
      </Box>
    ));

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, padding: 3, minHeight: '310px' }}>
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.configuration')}
      </Typography>
      <Grid container spacing={1}>
        {columns.map((col, i) => (
          <Grid item xs={12 / columns.length} key={`config-grid-item-${i}`}>
            {mapColumn(col, false)}
          </Grid>
        ))}
      </Grid>

      {!bundleTypeGlobal && (
        <>
          <ButtonNaked
            size="large"
            component="button"
            onClick={() => setOpenDrawer(true)}
            sx={{ color: 'primary.main', mt: 3 }}
            weight="default"
            data-testid="show-more-bundle-configuration-test"
          >
            + {t('general.showMore')}
          </ButtonNaked>
          <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
            <>
              <TitleBox
                title={t('commissionBundlesPage.commissionBundleDetail.configuration')}
                variantTitle="h4"
              />
              {Object.values(bundleConfigurationFields).map((col, i) =>
                mapColumn(col, true, i === 0)
              )}
            </>
          </PaddedDrawer>
        </>
      )}
    </Paper>
  );
};

const BundleTaxonomiesDetails = ({ bundleDetail }: { bundleDetail: Bundle }) => {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
        minHeight: '310px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="overline">
        {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
      </Typography>

      {bundleDetail?.transferCategoryList?.map((el, i) =>
        i < 4 ? (
          <Box key={`taxonomy-${el}`} mt={1}>
            {/* TODO RETRIEVE TAXONOMIES */}
            <Typography variant="body1" color="text.disabled">
              {el}
            </Typography>
            <Typography variant="body1">{el}</Typography>
          </Box>
        ) : null
      )}
      {bundleDetail?.transferCategoryList && bundleDetail?.transferCategoryList?.length > 0 ? (
        <>
          <ButtonNaked
            size="large"
            component="button"
            onClick={() => setOpenDrawer(true)}
            sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
            weight="default"
            data-testid="show-more-bundle-taxonomies-test"
          >
            + {t('general.showMore')}
          </ButtonNaked>
          <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
            <TitleBox
              title={t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
              variantTitle="h5"
            />
            {bundleDetail.transferCategoryList?.map((el) => (
              <Box key={`taxonomies-list-${el}`} mt={1}>
                {/* TODO RETRIEVE TAXONOMIES */}
                <Typography variant="body1" color="text.disabled">
                  {el}
                </Typography>
                <Typography variant="body1">{el}</Typography>
              </Box>
            ))}
          </PaddedDrawer>
        </>
      ) : (
        <Alert severity="info" variant="outlined" data-testid="alert-test" sx={{mt:2}}>
          {t("commissionBundlesPage.commissionBundleDetail.noTaxonomiesAlert")}
        </Alert>
      )}
    </Paper>
  );
};

const CommissionBundleDetailPage = () => {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_DETAIL);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const { bundleId } = useParams<{ bundleId: string }>();
  const [commissionBundleDetail, setCommissionBundleDetail] = useState<Bundle>({});

  useEffect(() => {
    setLoading(true);
    // TODO verify if API for bundle detail is used
    getCommissionBundleDetails(TypeEnum.PRIVATE)
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
          <Grid item xs={6} display="flex" justifyContent={'flex-end'}>
            <Typography color="text.secondary">
              {t('commissionBundlesPage.commissionBundleDetail.updatedOn')}{' '}
              <Typography component={'span'} color="text.primary" fontWeight="medium">
                {commissionBundleDetail?.lastUpdatedDate &&
                  formatDateToDDMMYYYYhhmm(commissionBundleDetail?.lastUpdatedDate)}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={commissionBundleDetail?.type === TypeEnum.GLOBAL ? 12 : 6}>
            <BundleConfigurationDetails bundleDetail={commissionBundleDetail} />
          </Grid>
          {commissionBundleDetail?.type !== TypeEnum.GLOBAL && (
            <Grid item xs={6}>
              <BundleTaxonomiesDetails bundleDetail={commissionBundleDetail} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CommissionBundleDetailPage;
