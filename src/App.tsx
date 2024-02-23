/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';

import withLogin from './decorators/withLogin';
import Layout from './components/Layout/Layout';
import routes from './routes';
import ApiKeysPage from './pages/apiKeys/ApiKeysPage';
import withSelectedPartyProducts from './decorators/withSelectedPartyProducts';
import Auth from './pages/auth/Auth';
import { TOS } from './pages/tos/TOS';

import TOSWall from './components/TOS/TOSWall';
import useTOSAgreementLocalStorage from './hooks/useTOSAgreementLocalStorage';
import AddApiKeyPage from './pages/apiKeys/AddApiKeyPage';
import ChannelsPage from './pages/channels/list/ChannelsPage';
import AddEditChannelPage from './pages/channels/addEditChannel/AddEditChannelPage';
import ChannelDetailPage from './pages/channels/detail/ChannelDetailPage';
import ChannelPSPListPage from './pages/channels/channelPSPList/ChannelPSPListPage';
import ChannelAssociatePSPPage from './pages/channels/channelAssociatePSP/ChannelAssociatePSPPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NodeSignInPage from './pages/dashboard/nodeSignIn/NodeSignInPage';
import StationsPage from './pages/stations/list/StationsPage';
import StationDetailPage from './pages/stations/detail/StationDetailPage';
import AddEditStationPage from './pages/stations/addEditStation/AddEditStationPage';
import { ENV } from './utils/env';
import StationECListPage from './pages/stations/stationECList/StationECPage';
import StationAssociateECPage from './pages/stations/stationAssociateEC/StationAssociateECPage';
import IbanPage from './pages/iban/IbanPage';
import IbanDetailPage from './pages/iban/detail/IbanDetailPage';
import AddEditIbanPage from './pages/iban/addEditIban/AddEditIbanPage';
import CommissionPackagesPage from './pages/commisionalPackages/CommissionPackagesPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import AddEditCommissionPackagePage from './pages/commisionalPackages/addEditCommissionPackage/AddEditCommissionPackagePage';
import AddEditOperationTablePage from './pages/operationTable/addEditOperationTable/AddEditOperationTablePage';
import OperationTableDetailPage from './pages/operationTable/detail/OperationTableDetailPage';
import OperationTableListPage from './pages/operationTable/list/OperationTableListPage';

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => {
    const location = useLocation();
    const { isTOSAccepted, acceptTOS } = useTOSAgreementLocalStorage();

    if (!isTOSAccepted && location.pathname !== routes.TOS) {
      return (
        <Layout>
          <TOSWall acceptTOS={acceptTOS} detailRoute={routes.TOS} />
        </Layout>
      );
    }

    return (
      <Layout>
        <BrowserRouter>
          <Switch>
            <Route path={routes.HOME} exact={true}>
              {ENV.FEATURES.DASHBOARD.ENABLED ? <DashboardPage /> : <ApiKeysPage />}
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
              {ENV.FEATURES.DASHBOARD.ENABLED ? (
                <ProtectedRoute permission="apikey">
                  <AddApiKeyPage />
                </ProtectedRoute>
              ) : (
                <AddApiKeyPage />
              )}
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
            <Route path={routes.COMMISSION_PACKAGES} exact={true}>
              <ProtectedRoute permission="commission-packages">
                <CommissionPackagesPage />
              </ProtectedRoute>
            </Route>
            <Route path={routes.COMMISSION_PACKAGES_ADD} exact={true}>
              <ProtectedRoute permission="commission-packages">
                <AddEditCommissionPackagePage />
              </ProtectedRoute>
            </Route>
            <Route path={routes.COMMISSION_PACKAGES_EDIT} exact={true}>
              <ProtectedRoute permission="commission-packages">
                <AddEditCommissionPackagePage />
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

            <Route path={routes.TOS} exact={true}>
              <TOS />
            </Route>
            <Route path="*">
              <Redirect to={routes.HOME} />
            </Route>
          </Switch>
        </BrowserRouter>
      </Layout>
    );
  })
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
      <Route path="*">
        <SecuredRoutes />
      </Route>
    </Switch>
  </ErrorBoundary>
);

export default App;
