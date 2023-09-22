import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionPackagePage from '../addEditCommissionPackage/AddEditCommissionPackagePage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditCommissionPackagePage />', () => {
  const renderConponent = () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package`]}>
          <Route path="/comm-packages/add-package">
            <ThemeProvider theme={theme}>
              <AddEditCommissionPackagePage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  };

  test('render component AddEditCommissionPackagePage', () => {
    jest.mock('react-router-dom', () => ({
      useParams: () => ({
        nameId: 'someNameId',
        actionId: 'edit',
      }),
    }));

    renderConponent();

    const icon = screen.getByTestId('arrow-back-test');
    fireEvent.click(icon);
  });
});
