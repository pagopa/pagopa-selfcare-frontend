import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {mockedDelegatedPSP} from '../../../../services/__mocks__/institutionsService';
import PSPSelectionSearch from '../PSPSelectionSearch';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const channelId = 'XPAY_03_ONUS';
const availablePSP = [...mockedDelegatedPSP.delegation_list!];

const onPSPSelectionChange = jest.fn();

describe('<PSPSelectionSearch />', () => {

    test('render component PSPSelectionSearch with available PSP and PSP selected', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
                    <Route path="/channels/:channelId/associate-psp">
                        <ThemeProvider theme={theme}>
                            <PSPSelectionSearch
                                availablePSP={availablePSP}
                                selectedPSP={undefined}
                                onPSPSelectionChange={onPSPSelectionChange}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const pspSelectionSearch = screen.getByTestId('psp-selection-search');
        expect(pspSelectionSearch).toBeInTheDocument();

        fireEvent.change(pspSelectionSearch, {target: {value: 'PSP1'}});
        const filteredPSP = screen.getByDisplayValue('PSP1');
        const searchButton = screen.getByTestId('search-field-test');
        fireEvent.click(searchButton);
        expect(filteredPSP).toBeInTheDocument();

        fireEvent.click(filteredPSP);
    });

    test('render component PSPSelectionSearch without available PSP and PSP selected', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
                    <Route path="/channels/:channelId/associate-psp">
                        <ThemeProvider theme={theme}>
                            <PSPSelectionSearch
                                availablePSP={[]}
                                selectedPSP={undefined}
                                onPSPSelectionChange={onPSPSelectionChange}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    test('render already associated PSPs as disabled', async () => {
        const associatedTaxCodes = [availablePSP[0].tax_code!];

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
                    <Route path="/channels/:channelId/associate-psp">
                        <ThemeProvider theme={theme}>
                            <PSPSelectionSearch
                                availablePSP={availablePSP}
                                selectedPSP={undefined}
                                associatedPSPTaxCodes={associatedTaxCodes}
                                onPSPSelectionChange={onPSPSelectionChange}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const pspSelectionSearch = screen.getByTestId('psp-selection-search');
        // Type enough to trigger filter (min 3 chars)
        fireEvent.change(pspSelectionSearch, {target: {value: 'Azienda'}});

        // The first PSP should be rendered but disabled
        const associatedItem = screen.getByTestId(
            `PartyItemContainer: ${availablePSP[0].institution_name}`
        );
        expect(associatedItem).toBeInTheDocument();
        expect(associatedItem).toHaveStyle({opacity: '0.5', pointerEvents: 'none'});
    });

    test('clicking an already associated PSP does not trigger selection', async () => {
        const mockSelectionChange = jest.fn();
        const associatedTaxCodes = [availablePSP[0].tax_code!];

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
                    <Route path="/channels/:channelId/associate-psp">
                        <ThemeProvider theme={theme}>
                            <PSPSelectionSearch
                                availablePSP={availablePSP}
                                selectedPSP={undefined}
                                associatedPSPTaxCodes={associatedTaxCodes}
                                onPSPSelectionChange={mockSelectionChange}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const pspSelectionSearch = screen.getByTestId('psp-selection-search');
        fireEvent.change(pspSelectionSearch, {target: {value: 'Azienda'}});

        const associatedItem = screen.getByTestId(
            `PartyItemContainer: ${availablePSP[0].institution_name}`
        );
        fireEvent.click(associatedItem);
        expect(mockSelectionChange).not.toHaveBeenCalled();
    });

    test('non-associated PSPs are rendered without disabled styles', async () => {
        // Pass an empty set so no PSP is associated
        const associatedTaxCodes: string[] = [];

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
                    <Route path="/channels/:channelId/associate-psp">
                        <ThemeProvider theme={theme}>
                            <PSPSelectionSearch
                                availablePSP={availablePSP}
                                selectedPSP={undefined}
                                associatedPSPTaxCodes={associatedTaxCodes}
                                onPSPSelectionChange={onPSPSelectionChange}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const pspSelectionSearch = screen.getByTestId('psp-selection-search');
        fireEvent.change(pspSelectionSearch, {target: {value: 'Azienda'}});

        const pspItem = screen.getByTestId(
            `PartyItemContainer: ${availablePSP[0].institution_name}`
        );
        expect(pspItem).not.toHaveStyle({opacity: '0.5', pointerEvents: 'none'});
    });
});
