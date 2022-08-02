import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@pagopa/selfcare-common-frontend/index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { CONFIG } from '@pagopa/selfcare-common-frontend/config/env';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { MOCK_USER, testToken } from './utils/constants';
import { ENV } from './utils/env';
import './consentAndAnalyticsConfiguration.ts';
import './locale';
import ROUTES from './routes';

// eslint-disable-next-line functional/immutable-data
CONFIG.MOCKS.MOCK_USER = MOCK_USER;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGIN = ENV.URL_FE.LOGIN;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGOUT = ENV.URL_FE.LOGOUT;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.ASSISTANCE = ENV.URL_FE.ASSISTANCE;
// eslint-disable-next-line functional/immutable-data
CONFIG.TEST.JWT = testToken;

// eslint-disable-next-line functional/immutable-data
CONFIG.HEADER.LINK.PRODUCTURL = ROUTES.HOME;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
