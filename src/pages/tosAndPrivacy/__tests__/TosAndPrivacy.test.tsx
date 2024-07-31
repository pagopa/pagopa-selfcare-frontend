import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import { TosAndPrivacy } from '../TosAndPrivacy';
import { rewriteLinks } from '../../../utils/onetrust-utils';
import routes from '../../../routes';
import tosJson from '../../../data/tos.json';
import privacyJson from '../../../data/privacy.json';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<TOS_AND_PRIVACY test />', () => {
  test('render component TOS page', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-receipts`]}>
          <Route path="/payments-receipts">
            <ThemeProvider theme={theme}>
              <TosAndPrivacy
                html={tosJson.html}
                waitForElementCondition={'.otnotice-content'}
                waitForElementFunction={() => {
                  rewriteLinks(routes.TOS, '.otnotice-content a');
                }}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });

  test('render component PRIVACY page', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/payments-receipts`]}>
          <Route path="/payments-receipts">
            <ThemeProvider theme={theme}>
              <TosAndPrivacy
                html={privacyJson.html}
                waitForElementCondition={'.otnotice-content'}
                waitForElementFunction={() => {
                  rewriteLinks(routes.TOS, '.otnotice-content a');
                }}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
