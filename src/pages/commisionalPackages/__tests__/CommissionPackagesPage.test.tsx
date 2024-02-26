import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionPackagesPage from '../CommissionPackagesPage';

describe('<CommissionPackagesPage />', () => {
  test('render component CommissionPackagesPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages`]}>
          <Route path="/comm-packages">
            <ThemeProvider theme={theme}>
              <CommissionPackagesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
