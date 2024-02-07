import { Alert, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LOADING_TASK_RETRIEVE_STATIONS } from '../../utils/constants';
import SideMenu from '../../components/SideMenu/SideMenu';
import CommissionPackagesTable from './list/CommissionPackagesTable';
import CommissionPackagesSearchBar from './list/CommissionPackagesSearchBar';


type Props = {
  children?: React.ReactNode;
  index: number;
  valueTab: number;
};

const CommissionPackagesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [value, setValue] = useState(2);
  const [packageNameInput, setPackageNameInput] = useState<string>('');

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  const CustomTabPanel = (props: Props) => {
    const { children, index, valueTab, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ px: 3, width: '100%' }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

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
    <>
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
              title={t('commissionPackagesPage.title')}
              subTitle={t('commissionPackagesPage.subtitle')}
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
            <CommissionPackagesSearchBar
              packageNameInput={packageNameInput}
              setPackageNameInput={setPackageNameInput}
            />
            <Box sx={{ borderColor: 'divider', width: '100%', mt: 3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{ width: '100%' }}
                centered
                variant="fullWidth"
              >
                <Tab label={t('commissionPackagesPage.globalPackages')} {...a11yProps(0)}/>
                <Tab label={t('commissionPackagesPage.publicPackages')} {...a11yProps(1)} />
                <Tab label={t('commissionPackagesPage.privatePackages')} {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel valueTab={value} index={0}>
              <CommissionPackagesTable
                packageType={'commissionPackagesPage.globalPackages'}
                packageNameFilter={packageNameInput}
              />
            </CustomTabPanel>
            <CustomTabPanel valueTab={value} index={1}>
              <CommissionPackagesTable
                packageType={'commissionPackagesPage.publicPackages'}
                packageNameFilter={packageNameInput}
              />
            </CustomTabPanel>
            <CustomTabPanel valueTab={value} index={2}>
              <CommissionPackagesTable
                packageType={'commissionPackagesPage.privatePackages'}
                packageNameFilter={packageNameInput}
              />
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CommissionPackagesPage;
