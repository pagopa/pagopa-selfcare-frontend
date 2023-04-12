import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

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
import ChannelAssociatePSPPage from './pages/channels/chennelAssociatePSP/ChannelAssociatePSPPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NodeSignInPage from './pages/dashboard/nodeSignIn/NodeSignInPage';
import StationsPage from './pages/stations/list/StationsPage';
import StationDetailPage from './pages/stations/detail/StationDetailPage';
import AddEditStationPage from './pages/stations/addEditStation/AddEditStationPage';
import { ENV } from './utils/env';

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
        <Switch>
          <Route path={routes.HOME} exact={true}>
            {ENV.FEATURES.DASHBOARD.ENABLED ? <DashboardPage /> : <ApiKeysPage />}
          </Route>
          <Route path={routes.NODE_SIGNIN} exact={true}>
            <NodeSignInPage />
          </Route>
          <Route path={routes.APIKEYS} exact={true}>
            <ApiKeysPage />
          </Route>
          <Route path={routes.APIKEYS_CREATE} exact={true}>
            <AddApiKeyPage />
          </Route>
          <Route path={routes.CHANNELS} exact={true}>
            <ChannelsPage />
          </Route>
          <Route path={routes.CHANNEL_ADD} exact={true}>
            <AddEditChannelPage />
          </Route>
          <Route path={routes.CHANNEL_DETAIL} exact={true}>
            <ChannelDetailPage />
          </Route>
          <Route path={routes.CHANNEL_PSP_LIST} exact={true}>
            <ChannelPSPListPage />
          </Route>
          <Route path={routes.CHANNEL_ASSOCIATE_PSP} exact={true}>
            <ChannelAssociatePSPPage />
          </Route>
          <Route path={routes.CHANNEL_EDIT} exact={true}>
            <AddEditChannelPage />
          </Route>
          <Route path={routes.STATION_ADD} exact={true}>
            <AddEditStationPage />
          </Route>
          <Route path={routes.STATION_DETAIL} exact={true}>
            <StationDetailPage />
          </Route>
          <Route path={routes.TOS} exact={true}>
            <TOS />
          </Route>
          <Route path={routes.STATIONS} exact={true}>
            <StationsPage />
          </Route>
          <Route path="*">
            <Redirect to={routes.HOME} />
          </Route>
        </Switch>
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
