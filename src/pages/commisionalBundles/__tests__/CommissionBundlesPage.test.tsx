import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import CommissionBundlesPage from '../CommissionBundlesPage';
import * as useFeatureFlags from "../../../hooks/useFeatureFlags";

let spyOnUseFlagValue: jest.SpyInstance<boolean, string[]>;

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  spyOnUseFlagValue = jest.spyOn(useFeatureFlags, "useFlagValue");
});

afterEach(cleanup);

describe('<CommisionalBundlesPage />', () => {
  test('render component CommisionalBundlesPage all package types', () => {
    spyOnUseFlagValue.mockReturnValue(true);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("tab-private")).not.toBeDisabled();
    expect(screen.getByTestId("tab-public")).not.toBeDisabled();
    expect(screen.getByTestId("tab-global")).not.toBeDisabled();
  });

  test('render component CommisionalBundlesPage only global', () => {
    spyOnUseFlagValue.mockReturnValue(false);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("tab-private")).toBeDisabled();
    expect(screen.getByTestId("tab-public")).toBeDisabled();
    expect(screen.getByTestId("tab-global")).not.toBeDisabled();
  });

  test('render component CommisionalBundlesPage only private & global', () => {
    spyOnUseFlagValue.mockImplementation((arg) => arg === "commission-bundles-private") ;

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("tab-private")).not.toBeDisabled();
    expect(screen.getByTestId("tab-public")).toBeDisabled();
    expect(screen.getByTestId("tab-global")).not.toBeDisabled();
  });

  test('render component CommisionalBundlesPage only public & global', () => {
    spyOnUseFlagValue.mockImplementation((arg) => arg === "commission-bundles-public") ;

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles`]}>
          <Route path="/comm-bundles">
            <ThemeProvider theme={theme}>
              <CommissionBundlesPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("tab-private")).toBeDisabled();
    expect(screen.getByTestId("tab-public")).not.toBeDisabled();
    expect(screen.getByTestId("tab-global")).not.toBeDisabled();
  });
});
