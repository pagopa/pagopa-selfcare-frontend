import { Alert, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import SideMenu from '../../components/SideMenu/SideMenu';
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

const CommissionBundlesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [value, setValue] = useState(2);
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
    setValue(newValue);
  };

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
          <Box width="100%" px={2}>
            <TitleBox
              title={t('commissionBundlesPage.title')}
              subTitle={t('commissionBundlesPage.subtitle')}
              mbTitle={2}
              mtTitle={4}
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
                value={value}
                onChange={handleChange}
                sx={{ width: '100%' }}
                centered
                variant="fullWidth"
              >
                <Tab label={t('commissionBundlesPage.globalBundles')} {...a11yProps(0)}/>
                <Tab label={t('commissionBundlesPage.publicBundles')} {...a11yProps(1)} />
                <Tab label={t('commissionBundlesPage.privateBundles')} {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel valueTab={value} index={0}>
              <CommissionBundlesTable
                bundleType={'commissionBundlesPage.globalBundles'}
                bundleNameFilter={bundleNameInput}
              />
            </CustomTabPanel>
            <CustomTabPanel valueTab={value} index={1}>
              <CommissionBundlesTable
                bundleType={'commissionBundlesPage.publicBundles'}
                bundleNameFilter={bundleNameInput}
              />
            </CustomTabPanel>
            <CustomTabPanel valueTab={value} index={2}>
              <CommissionBundlesTable
                bundleType={'commissionBundlesPage.privateBundles'}
                bundleNameFilter={bundleNameInput}
              />
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>
  );
};

export default CommissionBundlesPage;
