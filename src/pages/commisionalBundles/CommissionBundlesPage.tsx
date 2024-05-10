import { Alert, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { bundleDetailsSelectors } from '../../redux/slices/bundleDetailsSlice';
import { useAppSelector } from '../../redux/hooks';
import { useFlagValue } from '../../hooks/useFeatureFlags';
import { BundleResource } from '../../model/CommissionBundle';
import { TypeEnum } from '../../api/generated/portal/PSPBundleResource';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
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

function getTabValue(bundle: BundleResource) {
  if (bundle?.type === TypeEnum.PRIVATE) {
    return 0;
  } else if (bundle?.type === TypeEnum.PUBLIC) {
    return 1;
  }

  return 2;
}

const CommissionBundlesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const isPrivateEnabled = useFlagValue('commission-bundles-private');
  const isPublicEnabled = useFlagValue('commission-bundles-public');

  const commissionBundleDetail: BundleResource =
    useAppSelector(bundleDetailsSelectors.selectBundleDetails) ?? {};
  const [tabValue, setTabValue] = useState(getTabValue(commissionBundleDetail));
  const [bundleNameInput, setBundleNameInput] = useState<string>('');

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  const clearLocationState = () => {
    window.history.replaceState({}, document.title);
  };

  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <SideMenuLayout>
      <TitleBox
        title={t('commissionBundlesPage.title')}
        subTitle={t('commissionBundlesPage.subtitle')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}
      <CommissionBundlesSearchBar
        bundleNameInput={bundleNameInput}
        setBundleNameInput={setBundleNameInput}
      />
      <Box sx={{ borderColor: 'divider', width: '100%', mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          sx={{ width: '100%' }}
          centered
          variant="fullWidth"
        >
          <Tab
            label={t('commissionBundlesPage.privateBundles')}
            {...a11yProps(0)}
            disabled={!isPrivateEnabled}
            data-testid="tab-private"
          />
          <Tab
            label={t('commissionBundlesPage.publicBundles')}
            {...a11yProps(1)}
            disabled={!isPublicEnabled}
            data-testid="tab-public"
          />
          <Tab
            label={t('commissionBundlesPage.globalBundles')}
            {...a11yProps(2)}
            data-testid="tab-global"
          />
        </Tabs>
      </Box>
      <CustomTabPanel valueTab={tabValue} index={0}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.privateBundles'}
          bundleNameFilter={bundleNameInput}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={1}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.publicBundles'}
          bundleNameFilter={bundleNameInput}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={2}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.globalBundles'}
          bundleNameFilter={bundleNameInput}
        />
      </CustomTabPanel>
    </SideMenuLayout>
  );
};

export default CommissionBundlesPage;
