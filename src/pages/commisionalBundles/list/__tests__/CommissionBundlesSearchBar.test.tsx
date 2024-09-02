import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import CommissionBundlesSearchBar from '../CommissionBundlesSearchBar';

describe('<CommissionBundlesSearchBar />', () => {
  test('Render component', async () => {
    const setFilters = jest.fn();
    const setTab = jest.fn();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesSearchBar
                tabValue={undefined}
                setFiltersValues={setFilters}
                setTabValue={setTab}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('tab-global'));

    await waitFor(() => {
      expect(setTab).toBeCalled();
    });

    fireEvent.click(screen.getByTestId("button-search"));

    await waitFor(() => {
      expect(setFilters).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByTestId("reset-filter-button"));

    await waitFor(() => {
      expect(setFilters).toHaveBeenCalledTimes(2);
    });
  });
});
