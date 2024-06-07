import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {partiesActions} from '../../../redux/slices/partiesSlice';
import {store} from '../../../redux/store';
import routes from '../../../routes';
import {mockedKeys} from '../../../services/__mocks__/apiKeyService';
import {ecAdminSignedDirect} from '../../../services/__mocks__/partyService';
import * as ApiKeyService from '../../../services/apiKeyService';
import AddApiKeyPage from '../AddApiKeyPage';

let getInstitutionApiKeysSpy: jest.SpyInstance;
let createInstitutionApiKeysSpy: jest.SpyInstance;

beforeEach(() => {
    getInstitutionApiKeysSpy = jest.spyOn(ApiKeyService, 'getInstitutionApiKeys');
    createInstitutionApiKeysSpy = jest.spyOn(ApiKeyService, 'createInstitutionApiKeys');
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('<AddApiKeyPage />', () => {
    test('render component AddApiKeyPage', async () => {
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        getInstitutionApiKeysSpy.mockResolvedValue(mockedKeys);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[routes.APIKEYS]}>
                    <Route path={routes.APIKEYS}>
                        <ThemeProvider theme={theme}>
                            <AddApiKeyPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const selectApiKey = screen
            .getByTestId('product-test-id')
            .querySelector('input') as HTMLInputElement;

        fireEvent.mouseDown(selectApiKey);
        fireEvent.select(selectApiKey, {
            target: {value: mockedKeys.institution_api_key_list![0].displayName},
        });
        expect(selectApiKey.value).toBe(mockedKeys.institution_api_key_list![0].displayName);

        const confirmBtn = await screen.findByTestId('api-key-btn-test-id');
        fireEvent.click(confirmBtn);

        const backBtn = await screen.findByTestId('api-key-btn-back-test-id');
        fireEvent.click(backBtn);
    });
});
