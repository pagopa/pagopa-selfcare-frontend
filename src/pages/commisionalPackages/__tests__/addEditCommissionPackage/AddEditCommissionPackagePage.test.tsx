import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackagePage from '../../addEditCommissionPackage/AddEditCommissionPackagePage';
import { FormAction } from '../../../../model/CommissionPackage';

let spyOnGetCommissionPackageDetails: jest.SpyInstance<any, unknown[]>;

beforeEach(() => {
  spyOnGetCommissionPackageDetails = jest.spyOn(
    require('../../../../services/__mocks__/bundleService'),
    'getCommissionPackageDetails'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditCommissionPackagePage />', () => {
  const renderComponent = (initialEntries: string, path: string) => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialEntries]}>
          <Route path={path}>
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackagePage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  };

  test('render component AddEditCommissionPackagePage with view on create', () => {
    const initialEntries = `/comm-packages/add-package/`;

    renderComponent(initialEntries, initialEntries);

    const icon = screen.getByTestId('arrow-back-test');
    fireEvent.click(icon);
  });

  test('render component AddEditCommissionPackagePage with view on edit', () => {
    const name = 'someNameId';
    const initialEntries = `/comm-packages/${name}/${FormAction.Edit}`;
    const path = '/comm-packages/:nameId/:actionId';
    renderComponent(initialEntries, path);

    const icon = screen.getByTestId('arrow-back-test');
    fireEvent.click(icon);
  });

  test('Test fetch getCommissionPackageDetails catch case', async () => {
    const mockError = new Error('API error message getCommissionPackageDetails');
    spyOnGetCommissionPackageDetails.mockRejectedValue(mockError);

    const name = 'someNameId';
    const initialEntries = `/comm-packages/${name}/${FormAction.Edit}`;
    const path = '/comm-packages/:nameId/:actionId';

    renderComponent(initialEntries, path);

    await waitFor(() => {
      expect(spyOnGetCommissionPackageDetails).toHaveBeenCalled();
    });
  });
});

//SNAPSHOT TESTING
it('renders correctly', () => {
  const tree = render(
    <Provider store={store}>
      {/** Add form */}
      <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
        <Route path={'/comm-packages/:nameId/:actionId'}>
          <ThemeProvider theme={theme}>
            <AddEditCommissionPackagePage />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
      {/** Edit form */}
      <MemoryRouter initialEntries={[`/comm-packages/someNameId/${FormAction.Edit}`]}>
        <Route path={'/comm-packages/:nameId/:actionId'}>
          <ThemeProvider theme={theme}>
            <AddEditCommissionPackagePage />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  expect(tree).toMatchSnapshot();
});
