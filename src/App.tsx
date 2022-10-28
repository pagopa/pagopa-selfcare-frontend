import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { TOSAgreement } from '@pagopa/mui-italia';
import { Trans, useTranslation } from 'react-i18next';
import withLogin from './decorators/withLogin';
import Layout from './components/Layout/Layout';
import routes from './routes';
import Home from './pages/home/Home';
import withSelectedPartyProducts from './decorators/withSelectedPartyProducts';
import Auth from './pages/auth/Auth';
import { TOS } from './pages/tos/TOS';
import { useTOSAgreementLocalStorage } from './hooks/useTOSAgreementLocalStorage';

// import Wizard from './components/Wizard/Wizard';

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => {
    const { isTOSAccepted, acceptTOS } = useTOSAgreementLocalStorage();
    const { t } = useTranslation();

    return (
      <Layout>
        {!isTOSAccepted && window.location.pathname !== routes.TOS ? (
          <Box width="100%" px={2}>
            <TOSAgreement
              productName={t('tos.title')}
              description={t('tos.description')}
              onConfirm={() => acceptTOS()}
            >
              <Typography sx={{ px: 8 }} color="text.secondary">
                <Trans i18nKey="tos.termsDescription">
                  Entrando dichiari di aver letto e accettato l’Informativa Privacy e i Termini e
                  condizioni d’uso di PagoPA
                  <Link
                    sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => {
                      window.location.assign(routes.TOS);
                    }}
                  >
                    <strong> Accedi</strong>
                  </Link>
                </Trans>
              </Typography>
            </TOSAgreement>
          </Box>
        ) : (
          <Switch>
            <Route path={routes.HOME} exact={true}>
              <Home />
            </Route>
            {/* <Route path={routes.WIZARD} exact={true}>
        <Wizard />
      </Route> */}
            <Route path={routes.TOS} exact={true}>
              <TOS />
            </Route>
            <Route path="*">
              <Redirect to={routes.HOME} />
            </Route>
          </Switch>
        )}
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
