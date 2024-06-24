import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {partiesActions} from '../../../../redux/slices/partiesSlice';
import {store} from '../../../../redux/store';
import {mockedCreditorInstitutionInfoArray} from '../../../../services/__mocks__/creditorInstitutionService';
import {ecAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import {mockedSegregationCodeList} from '../../../../services/__mocks__/stationService';
import * as creditorInsitutionService from '../../../../services/creditorInstitutionService';
import StationAssociateECPage from '../StationAssociateECPage';

let getStationAvailableECSpy: jest.SpyInstance;
let getCreditorInstitutionSegregationCodesSpy: jest.SpyInstance;
let getAvailableCreditorInstitutionsForStationSpy: jest.SpyInstance;
let associateEcToStationSpy: jest.SpyInstance;

beforeEach(() => {
    getCreditorInstitutionSegregationCodesSpy = jest.spyOn(
        require('../../../../services/stationService'),
        'getCreditorInstitutionSegregationCodes'
    );
    getAvailableCreditorInstitutionsForStationSpy = jest.spyOn(
        creditorInsitutionService,
        'getAvailableCreditorInstitutionsForStation'
    );
    associateEcToStationSpy = jest.spyOn(
        require('../../../../services/stationService'),
        'associateEcToStation'
    );
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<StationAssociateECPage />', () => {
    const stationId = 'XPAY_03_ONUS';
    test('render component StationAssociateECPage', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );

        getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
        associateEcToStationSpy.mockResolvedValue({stationCode: '123'});
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const segCodeMocked = mockedSegregationCodeList.availableCodes
            ? mockedSegregationCodeList.availableCodes[0]
            : '';

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })

        const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
        expect(auxDigit.value).toBe('3');

        const segCode = screen.getByTestId('segregation-code-test');
        fireEvent.change(segCode, {target: {value: segCodeMocked}});

        const confirm = screen.getByTestId('confirm-btn-test');
        fireEvent.click(confirm);

        await waitFor(() => {
            expect(associateEcToStationSpy).toBeCalled();
        })
    });

    test('render component StationAssociateECPage getAvailableCreditorInstitutionsForStation error', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockRejectedValueOnce(new Error('error'));

        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    test('render component StationAssociateECPage getCreditorInstitutionSegregationcodes generic error', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );
        getCreditorInstitutionSegregationCodesSpy.mockRejectedValueOnce(new Error('error'));
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })
    });

    test('render cosmponent StationAssociateECPage associateEcToStation error 404', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );

        getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
        associateEcToStationSpy.mockRejectedValue({message:JSON.stringify({status: 404})});
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const segCodeMocked = mockedSegregationCodeList.availableCodes
            ? mockedSegregationCodeList.availableCodes[0]
            : '';

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })

        const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
        expect(auxDigit.value).toBe('3');

        const segCode = screen.getByTestId('segregation-code-test');
        fireEvent.change(segCode, {target: {value: segCodeMocked}});

        const confirm = screen.getByTestId('confirm-btn-test');
        fireEvent.click(confirm);

        await waitFor(() => {
            expect(associateEcToStationSpy).toBeCalled();
        })
    });

    test('render component StationAssociateECPage associateEcToStation error 409', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );

        getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
        associateEcToStationSpy.mockRejectedValue({message:JSON.stringify({status: 409})});
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const segCodeMocked = mockedSegregationCodeList.availableCodes
            ? mockedSegregationCodeList.availableCodes[0]
            : '';

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })

        const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
        expect(auxDigit.value).toBe('3');

        const segCode = screen.getByTestId('segregation-code-test');
        fireEvent.change(segCode, {target: {value: segCodeMocked}});

        const confirm = screen.getByTestId('confirm-btn-test');
        fireEvent.click(confirm);

        await waitFor(() => {
            expect(associateEcToStationSpy).toBeCalled();
        })
    });

    test('render component StationAssociateECPage associateEcToStation error 404', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );

        getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
        associateEcToStationSpy.mockRejectedValue({message:JSON.stringify({status: 404})});
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const segCodeMocked = mockedSegregationCodeList.availableCodes
            ? mockedSegregationCodeList.availableCodes[0]
            : '';

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })

        const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
        expect(auxDigit.value).toBe('3');

        const segCode = screen.getByTestId('segregation-code-test');
        fireEvent.change(segCode, {target: {value: segCodeMocked}});

        const confirm = screen.getByTestId('confirm-btn-test');
        fireEvent.click(confirm);

        await waitFor(() => {
            expect(associateEcToStationSpy).toBeCalled();
        })
    });

    test('render component StationAssociateECPage associateEcToStation error 409', async () => {
        getAvailableCreditorInstitutionsForStationSpy.mockResolvedValue(
            mockedCreditorInstitutionInfoArray
        );

        getCreditorInstitutionSegregationCodesSpy.mockResolvedValue(mockedSegregationCodeList);
        associateEcToStationSpy.mockRejectedValue({message:JSON.stringify({status: 409})});
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${stationId}/associate-ec`]}>
                    <Route path="/stations/:stationId/associate-ec">
                        <ThemeProvider theme={theme}>
                            <StationAssociateECPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        const segCodeMocked = mockedSegregationCodeList.availableCodes
            ? mockedSegregationCodeList.availableCodes[0]
            : '';

        let ecAutocomplete = screen.getByTestId('ec-selection-id-test');
        let ecSelectionSearch = within(ecAutocomplete).getByRole("combobox");
    
        ecAutocomplete.focus();
        fireEvent.change(ecSelectionSearch as Element, {
            target: { value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName },
        });
        await waitFor(() => {
            expect(screen.queryByText(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName)).toBeInTheDocument();
        })
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'ArrowDown' });
        fireEvent.keyDown(ecAutocomplete as Element, { key: 'Enter' });

        await waitFor(() => {
            expect(getCreditorInstitutionSegregationCodesSpy).toBeCalled();
        })

        const auxDigit = screen.getByTestId('aux-digit-test') as HTMLInputElement;
        expect(auxDigit.value).toBe('3');

        const segCode = screen.getByTestId('segregation-code-test');
        fireEvent.change(segCode, {target: {value: segCodeMocked}});

        const confirm = screen.getByTestId('confirm-btn-test');
        fireEvent.click(confirm);

        await waitFor(() => {
            expect(associateEcToStationSpy).toBeCalled();
        })
    });
});
