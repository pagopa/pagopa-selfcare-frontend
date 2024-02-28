import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionBundlePage from '../../addEditCommissionBundle/AddEditCommissionBundlePage';
import { FormAction } from '../../../../model/CommissionBundle';

let spyOnGetCommissionBundleDetails: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  spyOnGetCommissionBundleDetails = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getCommissionBundleDetails'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditCommissionBundlePage />', () => {
  const renderComponent = (initialEntries: string, path: string) => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Route path={path}>
            <ThemeProvider theme={theme}>
              <AddEditCommissionBundlePage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  };

  test('render component AddEditCommissionBundlePage with view on create', () => {
    const initialEntries = `/comm-bundles/add-bundle/`;

    renderComponent(initialEntries, initialEntries);

    const icon = screen.getByTestId('arrow-back-test');
    fireEvent.click(icon);
  });

  test('render component AddEditCommissionBundlePage with view on edit', () => {
    const name = 'someNameId';
    const initialEntries = `/comm-bundles/${name}/${FormAction.Edit}`;
    const path = '/comm-bundles/:bundleId/:actionId';
    renderComponent(initialEntries, path);

    const icon = screen.getByTestId('arrow-back-test');
    fireEvent.click(icon);
  });

  test('Test fetch getCommissionBundleDetails catch case', async () => {
    const mockError = new Error('API error message getCommissionBundleDetails');
    spyOnGetCommissionBundleDetails.mockRejectedValue(mockError);

    const name = 'someNameId';
    const initialEntries = `/comm-bundles/${name}/${FormAction.Edit}`;
    const path = '/comm-bundles/:bundleId/:actionId';

    renderComponent(initialEntries, path);

    await waitFor(() => {
      expect(spyOnGetCommissionBundleDetails).toHaveBeenCalled();
    });
  });
});
