import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';
import ApiKeysPage from '../ApiKeysPage';
import routes from '../../../routes';

describe('<ApiKeysPage />', () => {
    test('render component ApiKeysPage', async () => {
      render(
        <Provider store={store}>
        <MemoryRouter initialEntries={[routes.APIKEYS]}>
          <Route path={routes.APIKEYS}>
            <ThemeProvider theme={theme}>
              <ApiKeysPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
      );
    });
  });
