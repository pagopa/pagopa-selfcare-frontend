import {Alert, Button, Grid, Tab, Tabs, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {generatePath, Link as RouterLink} from 'react-router-dom';
import ROUTES from '../../routes';
import {bundleDetailsSelectors} from '../../redux/slices/bundleDetailsSlice';
import {useAppSelector} from '../../redux/hooks';
import {useFlagValue} from '../../hooks/useFeatureFlags';
import {BundleResource} from '../../model/CommissionBundle';
import {TypeEnum} from '../../api/generated/portal/PSPBundleResource';
import TableSearchBar from '../../components/Table/TableSearchBar';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import {useUserRole} from '../../hooks/useUserRole';
import {useOrganizationType} from '../../hooks/useOrganizationType';
import CommissionBundlesTable from './list/CommissionBundlesTable';

type Props = {
    children?: React.ReactNode;
    index: number;
    valueTab: number;
};

const CustomTabPanel = (props: Props) => {
    const {children, index, valueTab, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={valueTab !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {valueTab === index && (
                <Box sx={{px: 3, width: '100%'}}>
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

const CommissionBundlesPage = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const {userIsAdmin} = useUserRole();
    const {orgInfo} = useOrganizationType();

    const isPrivateEnabled = useFlagValue('commission-bundles-private');
    const isPublicEnabled = useFlagValue('commission-bundles-public');

    const commissionBundleDetail: BundleResource | Record<any, any> = useAppSelector(
        bundleDetailsSelectors.selectBundleDetails
    );
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
            <TableSearchBar
                componentName="commissionBundlesPage.list"
                setExternalSearchInput={setBundleNameInput}
                customEndButton={
                    orgInfo.types.isPsp &&
                    userIsAdmin && (
                        <Button
                            component={RouterLink}
                            to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
                            variant="contained"
                            sx={{ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto'}}
                            data-testid={'create-bundle-button'}
                        >
                            {t('commissionBundlesPage.list.search.createButton')}
                        </Button>
                    )
                }
                setActiveTab={setTabValue}
                activeTab={tabValue}
                listTabFilter={[
                    {
                        label: t('commissionBundlesPage.privateBundles'),
                        disabled: !isPrivateEnabled,
                        'data-testid': 'private',
                    },
                    {
                        label: t('commissionBundlesPage.publicBundles'),
                        disabled: !isPublicEnabled,
                        'data-testid': 'public',
                    },
                    {
                        label: t('commissionBundlesPage.globalBundles'),
                        'data-testid': 'global',
                    },
                ]}
            />
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
