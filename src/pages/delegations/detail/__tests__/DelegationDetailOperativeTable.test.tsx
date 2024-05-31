import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { mockedCIOperativeTable } from '../../../../services/__mocks__/creditorInstitutionService';
import DelegationDetailOperativeTable from '../DelegationDetailOperativeTable';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<DelegationDetailOperativeTable />', () => {
  test('render component Drawer with operative table', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
          <Route path="/delegations-list/detail">
            <ThemeProvider theme={theme}>
              <DelegationDetailOperativeTable operativeTable={mockedCIOperativeTable} />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('operative-table-column')).toBeInTheDocument();
    });
  });
});
