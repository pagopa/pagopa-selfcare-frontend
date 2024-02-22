import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';
import ApiKeysPage from '../ApiKeysPage';
import routes from '../../../routes';

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
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
  expect(tree).toMatchSnapshot();
});
