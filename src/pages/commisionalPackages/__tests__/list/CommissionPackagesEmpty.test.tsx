import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionPackagesEmpty from '../../list/CommissionPackagesEmpty';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/comm-packages`]}>
        <Route path="/comm-packages">
          <ThemeProvider theme={theme}>
            <CommissionPackagesEmpty packageType={''} />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});