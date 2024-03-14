import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';
import routes from '../../../routes';
import AddApiKeyPage from '../AddApiKeyPage';

describe('<AddApiKeyPage />', () => {
  test('render component AddApiKeyPage', async () => {
    render(
      <Provider store={store}>
      <MemoryRouter initialEntries={[routes.APIKEYS]}>
        <Route path={routes.APIKEYS}>
            <ThemeProvider theme={theme}>
              <AddApiKeyPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});


