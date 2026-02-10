/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton } from '@mui/material';
import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { MaintenanceMessage } from './api/generated/portal/MaintenanceMessage';
import Layout from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import TOSWall from './components/TOS/TOSWall';
import privacyJson from './data/privacy.json';
import tosJson from './data/tos.json';
import withFeatureFlags from './decorators/withFeatureFlags';
import withLogin from './decorators/withLogin';
import withSelectedPartyProducts from './decorators/withSelectedPartyProducts';
import { useFlagValue } from './hooks/useFeatureFlags';
import useTOSAgreementLocalStorage from './hooks/useTOSAgreementLocalStorage';
import AddApiKeyPage from './pages/apiKeys/AddApiKeyPage';
import ApiKeysPage from './pages/apiKeys/ApiKeysPage';
import Auth from './pages/auth/Auth';
import AddEditChannelPage from './pages/channels/addEditChannel/AddEditChannelPage';
import ChannelAssociatePSPPage from './pages/channels/channelAssociatePSP/ChannelAssociatePSPPage';
import ChannelPSPListPage from './pages/channels/channelPSPList/ChannelPSPListPage';
import ChannelDetailPage from './pages/channels/detail/ChannelDetailPage';
import ChannelsPage from './pages/channels/list/ChannelsPage';
import CommissionBundlesPage from './pages/commisionalBundles/CommissionBundlesPage';
import AddEditCommissionBundlePage from './pages/commisionalBundles/addEditCommissionBundle/AddEditCommissionBundlePage';
import CommissionBundleDetailActivationPage from './pages/commisionalBundles/detail/CommissionBundleDetailActivationPage';
import CommissionBundleDetailOffersAddRecipientsPage from './pages/commisionalBundles/detail/CommissionBundleDetailOffersAddRecipientsPage';
import CommissionBundleDetailPage from './pages/commisionalBundles/detail/CommissionBundleDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NodeSignInPage from './pages/dashboard/nodeSignIn/NodeSignInPage';
import DelegationsPage from './pages/delegations/DelegationsPage';
import DelegationDetailPage from './pages/delegations/detail/DelegationDetailPage';
import IbanPage from './pages/iban/IbanPage';
import AddEditIbanPage from './pages/iban/addEditIban/AddEditIbanPage';
import IbanDetailPage from './pages/iban/detail/IbanDetailPage';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import PaymentNoticesPage from './pages/notices/PaymentNoticesPage';
import PaymentNoticesAddEditPage from './pages/notices/addEdit/PaymentNoticesAddEditPage';
import AddEditOperationTablePage from './pages/operationTable/addEditOperationTable/AddEditOperationTablePage';
import OperationTableDetailPage from './pages/operationTable/detail/OperationTableDetailPage';
import OperationTableListPage from './pages/operationTable/list/OperationTableListPage';
import PaymentsReceiptsPage from './pages/paymentsReceipts/PaymentsReceiptsPage';
import StationMaintenanceAddEditDetail from './pages/stationMaintenances/addEditDetail/StationMaintenanceAddEditDetail';
import StationMaintenancesPage from './pages/stationMaintenances/list/StationMaintenancesPage';
import AddEditStationPage from './pages/stations/addEditStation/AddEditStationPage';
import StationDetailPage from './pages/stations/detail/StationDetailPage';
import StationsPage from './pages/stations/list/StationsPage';
import StationAssociateECPage from './pages/stations/stationAssociateEC/StationAssociateECPage';
import StationECListPage from './pages/stations/stationECList/StationECPage';
import { TosAndPrivacy } from './pages/tosAndPrivacy/TosAndPrivacy';
import routes from './routes';
import { getMaintenanceMessage } from './services/maintenanceService';
import { rewriteLinks } from './utils/onetrust-utils';
import QuicksightDashboardPage from './pages/quicksight/QuicksightDashboardPage';
import SettingsPage from './pages/settings/SettingsPage';

const SecuredRoutes = withLogin(
  withFeatureFlags(
    withSelectedPartyProducts(() => {
      const location = useLocation();
      const { t } = useTranslation();
      const { isTOSAccepted, acceptTOS } = useTOSAgreementLocalStorage();
      const [showMaintenanceAlert, setShowMaintenanceAlert] = useState<boolean>(
        useFlagValue('maintenance-banner')
      );
      const maintenanceMode = useFlagValue('maintenance');
      const [maintenanceText, setMaintenanceText] = useState<MaintenanceMessage>({
        pageMessage: t(`general.maintenancePageText`),
        bannerMessage: t(`general.maintenanceAlert`),
      });

      useEffect(() => {
        if (maintenanceMode || showMaintenanceAlert) {
          getMaintenanceMessage()
            .then((el) => setMaintenanceText(el))
            .catch((_) => {});
        }
      }, []);

      if (maintenanceMode) {
        return (
          <Layout>
            <MaintenancePage message={maintenanceText.pageMessage} />
          </Layout>
        );
      }

      if (
        !isTOSAccepted &&
        location.pathname !== routes.TOS &&
        location.pathname !== routes.PRIVACY
      ) {
        return (
          <Layout>
            <TOSWall acceptTOS={acceptTOS} tosRoute={routes.TOS} privacyRoute={routes.PRIVACY} />
          </Layout>
        );
      }

      return (
        <>
          {showMaintenanceAlert && (
            <Alert
              severity="warning"
              variant="filled"
              action={
                <IconButton
                  onClick={() => setShowMaintenanceAlert(false)}
                  data-testid="close-maintenance-alert"
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: maintenanceText.bannerMessage }} />
            </Alert>
          )}
          <Layout>
            <BrowserRouter>
              <Switch>
                <Route path={routes.HOME} exact={true}>
                  {<DashboardPage />}
                </Route>

                <Route path={routes.NODE_SIGNIN} exact={true}>
                  <ProtectedRoute permission="node-signin">
                    <NodeSignInPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.APIKEYS} exact={true}>
                  <ProtectedRoute permission="apikey">
                    <ApiKeysPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.APIKEYS_CREATE} exact={true}>
                  <ProtectedRoute permission="apikey">
                    <AddApiKeyPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.CHANNELS} exact={true}>
                  <ProtectedRoute permission="channels">
                    <ChannelsPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.CHANNEL_ADD} exact={true}>
                  <ProtectedRoute permission="channels">
                    <AddEditChannelPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.CHANNEL_DETAIL} exact={true}>
                  <ProtectedRoute permission="channels">
                    <ChannelDetailPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.CHANNEL_PSP_LIST} exact={true}>
                  <ProtectedRoute permission="channels">
                    <ChannelPSPListPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.CHANNEL_ASSOCIATE_PSP} exact={true}>
                  <ProtectedRoute permission="channels">
                    <ChannelAssociatePSPPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.CHANNEL_EDIT} exact={true}>
                  <ProtectedRoute permission="channels">
                    <AddEditChannelPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.STATIONS} exact={true}>
                  <ProtectedRoute permission="stations">
                    <StationsPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.STATION_ADD} exact={true}>
                  <ProtectedRoute permission="stations">
                    <AddEditStationPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.STATION_DETAIL} exact={true}>
                  <ProtectedRoute permission="stations">
                    <StationDetailPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.STATION_EC_LIST} exact={true}>
                  <ProtectedRoute permission="stations">
                    <StationECListPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.STATION_ASSOCIATE_EC} exact={true}>
                  <ProtectedRoute permission="stations">
                    <StationAssociateECPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.STATION_EDIT} exact={true}>
                  <ProtectedRoute permission="stations">
                    <AddEditStationPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.IBAN} exact={true}>
                  <ProtectedRoute permission="iban">
                    <IbanPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.IBAN_ADD} exact={true}>
                  <ProtectedRoute permission="iban">
                    <AddEditIbanPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.IBAN_DETAIL} exact={true}>
                  <ProtectedRoute permission="iban">
                    <IbanDetailPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.IBAN_EDIT} exact={true}>
                  <ProtectedRoute permission="iban">
                    <AddEditIbanPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.COMMISSION_BUNDLES} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-list"
                    flagValue="commission-bundles"
                  >
                    <CommissionBundlesPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.COMMISSION_BUNDLES_DETAIL} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-list"
                    flagValue="commission-bundles"
                  >
                    <CommissionBundleDetailPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.COMMISSION_BUNDLES_ADD_RECIPIENT} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-add-recipient"
                    flagValue="commission-bundles-private"
                  >
                    <CommissionBundleDetailOffersAddRecipientsPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.COMMISSION_BUNDLES_ADD} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-addedit"
                    flagValue="commission-bundles"
                  >
                    <AddEditCommissionBundlePage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.COMMISSION_BUNDLES_EDIT} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-addedit"
                    flagValue="commission-bundles"
                  >
                    <AddEditCommissionBundlePage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.COMMISSION_BUNDLES_ACTIVATE} exact={true}>
                  <ProtectedRoute
                    permission="commission-bundles-activate"
                    flagValue="commission-bundles-public"
                  >
                    <CommissionBundleDetailActivationPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.OPERATION_TABLE_ADDEDIT} exact={true}>
                  <ProtectedRoute permission="operation-table-read-write">
                    <AddEditOperationTablePage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.OPERATION_TABLE_DETAILS} exact={true}>
                  <ProtectedRoute permission="operation-table-list">
                    <OperationTableDetailPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.OPERATION_TABLE_LIST} exact={true}>
                  <ProtectedRoute permission="operation-table-list">
                    <OperationTableListPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.DELEGATIONS_LIST} exact={true}>
                  <ProtectedRoute permission="delegations-list" flagValue="delegations-list">
                    <DelegationsPage />
                  </ProtectedRoute>
                </Route>
                <Route path={routes.DELEGATIONS_DETAIL} exact={true}>
                  <ProtectedRoute permission="delegations-list" flagValue="delegations-list">
                    <DelegationDetailPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.PAYMENTS_RECEIPTS} exact={true}>
                  <ProtectedRoute permission="payments-receipts" flagValue="payments-receipts">
                    <PaymentsReceiptsPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.PAYMENT_NOTICES} exact={true}>
                  <ProtectedRoute permission="payment-notices" flagValue="payment-notices">
                    <PaymentNoticesPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.PAYMENT_NOTICES_ADDEDIT} exact={true}>
                  <ProtectedRoute permission="payment-notices-addedit" flagValue="payment-notices">
                    <PaymentNoticesAddEditPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.STATION_MAINTENANCES_LIST} exact={true}>
                  <ProtectedRoute
                    permission="station-maintenances"
                    flagValue="station-maintenances"
                  >
                    <StationMaintenancesPage />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.STATION_MAINTENANCES_ADD_EDIT_DETAIL} exact={true}>
                  <ProtectedRoute
                    permission="station-maintenances"
                    flagValue="station-maintenances"
                  >
                    <StationMaintenanceAddEditDetail />
                  </ProtectedRoute>
                </Route>

                <Route path={routes.QUICKSIGHT_DASHBOARD} exact={true}>
                  <ProtectedRoute
                    permission="quicksight-dashboard"
                    flagValue="quicksight-dashboard"
                  >
                    <QuicksightDashboardPage />
                  </ProtectedRoute>
                </Route>
                
              <Route path={routes.SETTINGS} exact={true}>
                  <ProtectedRoute
                    permission="settings"
                    flagValue="settings-section"
                    orgCheckCondition={(orgInfo) => orgInfo.types.isEcIPA}
                  >
                    <SettingsPage />
                  </ProtectedRoute>
                </Route>


                <Route path="*">
                  <Redirect to={routes.HOME} />
                </Route>
              </Switch>
            </BrowserRouter>
          </Layout>
        </>
      );
    })
  )
);

const App = () => (
  <ErrorBoundary>
    <LoadingOverlay />
    <UserNotifyHandle />
    <UnloadEventHandler />
    <Switch>
      <Route path={routes.AUTH}>
        <Auth />
      </Route>
      <Route path={routes.TOS} exact={true}>
        <TosAndPrivacy
          html={tosJson.html}
          waitForElementCondition={'.otnotice-content'}
          waitForElementFunction={() => {
            rewriteLinks(routes.TOS, '.otnotice-content a');
          }}
        />
      </Route>

      <Route path={routes.PRIVACY} exact={true}>
        <TosAndPrivacy
          html={privacyJson.html}
          waitForElementCondition={'.otnotice-content'}
          waitForElementFunction={() => {
            rewriteLinks(routes.PRIVACY, '.otnotice-content a');
          }}
        />
      </Route>
      <Route path="*">
        <SecuredRoutes />
      </Route>
    </Switch>
  </ErrorBoundary>
);

export default App;
