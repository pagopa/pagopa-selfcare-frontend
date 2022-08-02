import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch } from 'react-router-dom';
import withLogin from './decorators/withLogin';
import Layout from './components/Layout/Layout';
import routes from './routes';
import Home from './pages/home/Home';
import withSelectedPartyProducts from './decorators/withSelectedPartyProducts';
import Auth from './pages/auth/Auth';
// import Wizard from './components/Wizard/Wizard';

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => (
    <Layout>
      <Switch>
        <Route path={routes.HOME} exact={true}>
          <Home />
        </Route>
        {/* <Route path={routes.WIZARD} exact={true}>
          <Wizard />
        </Route> */}
        <Route path="*">
          <Redirect to={routes.HOME} />
        </Route>
      </Switch>
    </Layout>
  ))
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
