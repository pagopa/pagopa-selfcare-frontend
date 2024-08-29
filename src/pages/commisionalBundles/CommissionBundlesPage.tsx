import { Alert, Button, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../routes';
import { bundleDetailsSelectors } from '../../redux/slices/bundleDetailsSlice';
import { useAppSelector } from '../../redux/hooks';
import { BundleResource } from '../../model/CommissionBundle';
import { TypeEnum } from '../../api/generated/portal/PSPBundleResource';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { useUserRole } from '../../hooks/useUserRole';
import { useOrganizationType } from '../../hooks/useOrganizationType';
import CommissionBundlesTable from './list/CommissionBundlesTable';
import CommissionBundlesSearchBar from './list/CommissionBundlesSearchBar';

type Props = {
  children?: React.ReactNode;
  index: number;
  valueTab: number;
};

const CustomTabPanel = (props: Props) => {
  const { children, index, valueTab, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={valueTab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {valueTab === index && (
        <Box sx={{ px: 3, width: '100%' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function getTabValue(bundle: BundleResource | Record<any, any>) {
  if (bundle?.type === TypeEnum.PRIVATE) {
    return 0;
  } else if (bundle?.type === TypeEnum.PUBLIC) {
    return 1;
  }

  return 2;
}

export const emptyFiltersValues = {
  name: '',
  paymentRange: {
    value: undefined,
    name: 'noOrder',
  },
  paymentAmount: {
    name: 'all',
    paymentAmountMax: undefined,
    paymentAmountMin: undefined,
  },
  state: {
    name: 'all',
    validityBefore: undefined,
    validityAfter: undefined,
    expireBefore: undefined,
    expireAfter: undefined,
  },
};

const CommissionBundlesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { userIsAdmin } = useUserRole();
  const { orgInfo } = useOrganizationType();

  const commissionBundleDetail: BundleResource | Record<any, any> = useAppSelector(
    bundleDetailsSelectors.selectBundleDetails
  );
  const [tabValue, setTabValue] = useState(getTabValue(commissionBundleDetail));
  const [filtersValues, setFiltersValues] = useState(emptyFiltersValues);

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  const clearLocationState = () => {
    window.history.replaceState({}, document.title);
  };

  return (
    <SideMenuLayout>
      <Stack justifyContent="space-between" direction="row">
        <TitleBox
          title={t('commissionBundlesPage.title')}
          subTitle={t('commissionBundlesPage.subtitle')}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {orgInfo.types.isPsp && userIsAdmin && (
          <>
            <Button
              variant="outlined"
              sx={{ mr: 1, minWidth: '150px', fontWeight: 'bold', padding: 0 }}
              data-testid={'download-bundle-button'}
              onClick={() => {
                /* TODO */
              }}
              endIcon={<Download />}
            >
              {t('commissionBundlesPage.list.search.downloadButton')}
            </Button>
            <Button
              component={RouterLink}
              to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
              variant="contained"
              data-testid={'create-bundle-button'}
              sx={{ minWidth: '200px', fontWeight: 'bold', padding: 0 }}
            >
              {t('commissionBundlesPage.list.search.createButton')}
            </Button>
          </>
        )}
      </Stack>

      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}
      <CommissionBundlesSearchBar
        setTabValue={setTabValue}
        setFiltersValues={setFiltersValues}
        tabValue={tabValue}
      />
      <CustomTabPanel valueTab={tabValue} index={0}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.privateBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={1}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.publicBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={2}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.globalBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
    </SideMenuLayout>
  );
};

export default CommissionBundlesPage;
