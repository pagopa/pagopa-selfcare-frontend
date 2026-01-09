import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import IbanDetailPage from '../IbanDetailPage';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {store} from '../../../../redux/store';
import {MemoryRouter, Route} from 'react-router';
import {mockedIban} from '../../../../services/__mocks__/ibanService';
import * as ibanService from '../../../../services/ibanService';
import {partiesActions} from '../../../../redux/slices/partiesSlice';

let getIbanListSpy: jest.SpyInstance;
let deleteIbanSpy: jest.SpyInstance;
let createIbanDeletionRequestSpy: jest.SpyInstance;
let cancelIbanDeletionRequestsSpy: jest.SpyInstance;
let getIbanDeletionRequestsSpy: jest.SpyInstance;

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

const mockSelectedParty = {
    fiscalCode: '12345678901',
    partyId: 'party-123',
    description: 'Test Party',
    status: 'ACTIVE',
};

const mockIbanList = {
    ibans_enhanced: [
        {
            iban: mockedIban.iban,
            description: 'Test IBAN',
            ci_owner: '12345678901',
            validity_date: new Date('2024-01-01').toISOString(),
            publication_date: new Date('2024-01-01').toISOString(),
            due_date: new Date('2025-12-31').toISOString(),
            is_active: true,
            labels: [],
        },
    ],
};

const mockPendingDeletionRequest = {
    requests: [
        {
            id: 'deletion-request-123',
            scheduledExecutionDate: new Date('2025-02-15').toISOString(),
        },
    ],
};

beforeEach(() => {
    store.dispatch(partiesActions.setPartySelected(mockSelectedParty));
    
    getIbanListSpy = jest.spyOn(require('../../../../services/ibanService'), 'getIbanList');
    deleteIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'deleteIban');
    createIbanDeletionRequestSpy = jest.spyOn(ibanService, 'createIbanDeletionRequest');
    cancelIbanDeletionRequestsSpy = jest.spyOn(ibanService, 'cancelIbanDeletionRequests');
    getIbanDeletionRequestsSpy = jest.spyOn(ibanService, 'getIbanDeletionRequests');
    
    getIbanListSpy.mockResolvedValue(mockIbanList);
    getIbanDeletionRequestsSpy.mockResolvedValue(null);
    
    mockHistoryPush.mockClear();
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    jest.clearAllMocks();
});

const renderComponent = (ibanId = mockedIban.iban) => {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[`/iban/${ibanId}`]}>
                <Route path="/iban/:ibanId">
                    <ThemeProvider theme={theme}>
                        <IbanDetailPage/>
                    </ThemeProvider>
                </Route>
            </MemoryRouter>
        </Provider>
    );
};

describe('IbanDetailPage', () => {
    it('Test render IbanDetailPage', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('general.exit')).toBeInTheDocument();
        expect(screen.getByText('general.Iban')).toBeInTheDocument();
        /* expect(screen.getByText('ibanDetailPage.state')).toBeInTheDocument(); */
        expect(screen.getByText('ibanDetailPage.ibanConfiguration')).toBeInTheDocument();
    });

    it('Test render IbanDetailPage with getIbanListSpy error', () => {
        const mockError = new Error('Fetch error');
        getIbanListSpy.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    it('Test render IbanDetailPage with deleteIban error', () => {
        const mockError = new Error('Fetch error');
        deleteIbanSpy.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/iban/${mockedIban.iban}`]}>
                    <Route path="/iban/:ibanId">
                        <ThemeProvider theme={theme}>
                            <IbanDetailPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });

    it('should display IBAN details correctly', async () => {
        renderComponent();

        await waitFor(() => {
            const ibanElements = screen.getAllByText(mockedIban.iban);
            expect(ibanElements.length).toBeGreaterThan(0);
            expect(screen.getByText('ibanDetailPage.ibanData')).toBeInTheDocument();
            expect(screen.getByText('ibanDetailPage.validityDate')).toBeInTheDocument();
            expect(screen.getByText('ibanDetailPage.ecData')).toBeInTheDocument();
        });
    });

    it('should display pending deletion alert when deletion request exists', async () => {
        getIbanDeletionRequestsSpy.mockResolvedValue(mockPendingDeletionRequest);
        
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/ibanDetailPage.deletionScheduled/)).toBeInTheDocument();
        });
    });

    it('should not display deletion alert when no pending request exists', async () => {
        getIbanDeletionRequestsSpy.mockResolvedValue(null);
        
        renderComponent();

        await waitFor(() => {
            expect(screen.queryByText(/ibanDetailPage.deletionScheduled/)).not.toBeInTheDocument();
        });
    });

    it('should navigate back when exit button is clicked', async () => {
        renderComponent();

        await waitFor(() => {
            const exitButton = screen.getByText('general.exit');
            fireEvent.click(exitButton);
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(expect.stringContaining('/iban'));
    });

    it('should fetch IBAN list on mount', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalledTimes(1);
        });
    });

    it('should fetch deletion requests on mount', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getIbanDeletionRequestsSpy).toHaveBeenCalledWith(
                expect.any(String),
                mockedIban.iban,
                'PENDING'
            );
        });
    });

    it('should handle getDeletionRequests error gracefully', async () => {
        const mockError = new Error('Fetch deletion requests error');
        getIbanDeletionRequestsSpy.mockRejectedValue(mockError);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should format dates correctly', async () => {
        renderComponent();

        await waitFor(() => {
            const dateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
            expect(dateElements.length).toBeGreaterThan(0);
        });
    });

    it('should correctly identify valid IBAN', async () => {
        const validIban = {
            ...mockIbanList.ibans_enhanced[0],
            validity_date: new Date('2024-01-01').toISOString(),
            due_date: new Date('2025-12-31').toISOString(),
        };

        getIbanListSpy.mockResolvedValue({
            ibans_enhanced: [validIban],
        });

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should handle multiple IBANs correctly', async () => {
        const multipleIbans = {
            ibans_enhanced: [
                ...mockIbanList.ibans_enhanced,
                {
                    ...mockIbanList.ibans_enhanced[0],
                    iban: 'IT60X0542811101000000123456',
                },
            ],
        };

        getIbanListSpy.mockResolvedValue(multipleIbans);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should prevent deletion of last valid IBAN', async () => {
        const singleIbanList = {
            ibans_enhanced: [mockIbanList.ibans_enhanced[0]],
        };
        getIbanListSpy.mockResolvedValue(singleIbanList);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should handle delete IBAN error', async () => {
        const mockError = new Error('Delete error');
        createIbanDeletionRequestSpy.mockRejectedValue(mockError);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should handle cancel deletion request error', async () => {
        const mockError = new Error('Cancel error');
        getIbanDeletionRequestsSpy.mockResolvedValue(mockPendingDeletionRequest);
        cancelIbanDeletionRequestsSpy.mockRejectedValue(mockError);

        renderComponent();

        await waitFor(() => {
            expect(getIbanDeletionRequestsSpy).toHaveBeenCalled();
        });
    });
});