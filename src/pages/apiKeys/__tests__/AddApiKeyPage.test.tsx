import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { store } from '../../../redux/store';
import routes from '../../../routes';
import { createMockedKeys, mockedKeys } from '../../../services/__mocks__/apiKeyService';
import { ecAdminSignedDirect } from '../../../services/__mocks__/partyService';
import * as ApiKeyService from '../../../services/apiKeyService';
import AddApiKeyPage from '../AddApiKeyPage';
import { API_KEY_PRODUCTS } from '../../../model/ApiKey';

let getInstitutionApiKeysSpy: jest.SpyInstance;
let createInstitutionApiKeysSpy: jest.SpyInstance;

beforeEach(() => {
  getInstitutionApiKeysSpy = jest.spyOn(ApiKeyService, 'getInstitutionApiKeys');
  createInstitutionApiKeysSpy = jest.spyOn(ApiKeyService, 'createInstitutionApiKeys');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<AddApiKeyPage />', () => {
  test('render component AddApiKeyPage', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    getInstitutionApiKeysSpy.mockResolvedValue(mockedKeys);
    createInstitutionApiKeysSpy.mockResolvedValue(createMockedKeys);

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

    const confirmBtn = await screen.findByTestId('api-key-btn-test-id');
    expect(confirmBtn).toBeDisabled();

    const selectApiKey = screen.getByTestId('product-test-id');

    fireEvent.mouseDown(screen.getByLabelText('addApiKeyPage.addForm.product.title'));
    fireEvent.click(
      screen.getByText(new RegExp(`addApiKeyPage.products.${API_KEY_PRODUCTS.BIZ.id}`, 'i'))
    );

    expect(selectApiKey).toHaveTextContent(API_KEY_PRODUCTS.BIZ.id);

    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(createInstitutionApiKeysSpy).toBeCalled();
    });
  });
  test('render component AddApiKeyPage createInstitutionApiKeysSpy error', async () => {
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    getInstitutionApiKeysSpy.mockResolvedValue(mockedKeys);
    createInstitutionApiKeysSpy.mockRejectedValue("");

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

    const confirmBtn = await screen.findByTestId('api-key-btn-test-id');
    expect(confirmBtn).toBeDisabled();

    const selectApiKey = screen.getByTestId('product-test-id');

    fireEvent.mouseDown(screen.getByLabelText('addApiKeyPage.addForm.product.title'));
    fireEvent.click(
      screen.getByText(new RegExp(`addApiKeyPage.products.${API_KEY_PRODUCTS.BIZ.id}`, 'i'))
    );

    expect(selectApiKey).toHaveTextContent(API_KEY_PRODUCTS.BIZ.id);

    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(createInstitutionApiKeysSpy).toBeCalled();
    });
  });
});
