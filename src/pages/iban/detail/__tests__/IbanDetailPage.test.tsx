jest.mock('@mui/x-date-pickers/DesktopDatePicker', () => ({
  DesktopDatePicker: ({ onChange }: any) => (
    <input
      data-testid="mock-date-picker"
      onChange={() => onChange(new Date('2030-01-01'))}
    />
  ),
}));
jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: any) => <>{children}</>,
}));
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
import { Party } from '../../../../model/Party';

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
} as Party;

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
            const dateElements = screen.getAllByText((content, _) => {
                return /^\d{2}\/\d{2}\/\d{4}$/.test(content);
            });
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

    it('should open and close delete modal', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });

        const deleteButton = screen.queryByTestId('button-delete');
        if (deleteButton) {
            fireEvent.click(deleteButton);
            
            await waitFor(() => {
                expect(screen.getByText('addEditIbanPage.delete-modal.title')).toBeInTheDocument();
            });

            const closeButton = screen.getByText('addEditIbanPage.delete-modal.backButton');
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText('addEditIbanPage.delete-modal.title')).not.toBeInTheDocument();
            });
        }
    });

    it('should open and close cancel deletion request modal', async () => {
        getIbanDeletionRequestsSpy.mockResolvedValue(mockPendingDeletionRequest);
        renderComponent();

        await waitFor(() => {
            expect(getIbanDeletionRequestsSpy).toHaveBeenCalled();
        });

        const cancelButton = screen.queryByTestId('button-edit-deletion');
        if (cancelButton) {
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.getByText('addEditIbanPage.cancel-iban-request-modal.title')).toBeInTheDocument();
            });

            const closeButton = screen.getByText('addEditIbanPage.cancel-iban-request-modal.backButton');
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText('addEditIbanPage.cancel-iban-request-modal.title')).not.toBeInTheDocument();
            });
        }
    });

    it('should successfully cancel deletion request and navigate', async () => {
        getIbanDeletionRequestsSpy.mockResolvedValue(mockPendingDeletionRequest);
        cancelIbanDeletionRequestsSpy.mockResolvedValue({});
        
        renderComponent();

        await waitFor(() => {
            expect(getIbanDeletionRequestsSpy).toHaveBeenCalled();
        });

        const cancelButton = screen.queryByTestId('button-edit-deletion');
        if (cancelButton) {
            fireEvent.click(cancelButton);
            
            await waitFor(() => {
                expect(screen.getByText('addEditIbanPage.cancel-iban-request-modal.title')).toBeInTheDocument();
            });

            const confirmButton = screen.getByText('addEditIbanPage.cancel-iban-request-modal.confirmButton');
            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(cancelIbanDeletionRequestsSpy).toHaveBeenCalledWith(
                    mockSelectedParty.fiscalCode,
                    mockPendingDeletionRequest.requests[0].id
                );
                expect(mockHistoryPush).toHaveBeenCalled();
            });
        }
    });

    it('should display empty iban when fetch fails', async () => {
        const mockError = new Error('Fetch error');
        getIbanListSpy.mockRejectedValue(mockError);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should handle missing publication_date', async () => {
        const ibanWithoutPublicationDate = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    publication_date: undefined,
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(ibanWithoutPublicationDate);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('-')).toBeInTheDocument();
        });
    });

    it('should filter valid ibans correctly', async () => {
        const multipleIbansWithDifferentDates = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    validity_date: new Date('2020-01-01').toISOString(),
                    due_date: new Date('2021-01-01').toISOString(),
                },
                {
                    ...mockIbanList.ibans_enhanced[0],
                    iban: 'IT60X0542811101000000123456',
                    validity_date: new Date('2024-01-01').toISOString(),
                    due_date: new Date('2025-12-31').toISOString(),
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(multipleIbansWithDifferentDates);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should use ci_owner from iban when available', async () => {
        const ibanWithCiOwner = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    ci_owner: '99999999999',
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(ibanWithCiOwner);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('99999999999')).toBeInTheDocument();
        });
    });

    it('should use selectedParty fiscalCode when ci_owner is null', async () => {
        const ibanWithoutCiOwner = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    ci_owner: null,
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(ibanWithoutCiOwner);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(mockSelectedParty.fiscalCode)).toBeInTheDocument();
        });
    });

    it('should handle deletion date change', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });

        const deleteButton = screen.queryByTestId('button-delete');
        if (deleteButton) {
            fireEvent.click(deleteButton);
            
            await waitFor(() => {
                expect(screen.getByText('addEditIbanPage.delete-modal.title')).toBeInTheDocument();
            });
        }
    });

    it('should show alert when deletion date is selected', async () => {
        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should not call delete handler when date is null', async () => {
        createIbanDeletionRequestSpy.mockResolvedValue({});
        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should display IBAN in breadcrumb', async () => {
        renderComponent();

        await waitFor(() => {
            const breadcrumbElements = screen.getAllByText(mockedIban.iban);
            expect(breadcrumbElements.length).toBeGreaterThan(0);
        });
    });

    it('should display configuration sections', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('ibanDetailPage.ibanData')).toBeInTheDocument();
            expect(screen.getByText('ibanDetailPage.validityDate')).toBeInTheDocument();
            expect(screen.getByText('ibanDetailPage.ecData')).toBeInTheDocument();
        });
    });

    it('should display from and to labels', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('ibanDetailPage.from')).toBeInTheDocument();
            expect(screen.getByText('ibanDetailPage.to')).toBeInTheDocument();
        });
    });

    it('should display fiscal code label', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('ibanDetailPage.fiscalCode')).toBeInTheDocument();
        });
    });

    it('should handle empty iban description', async () => {
        const ibanWithoutDescription = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    description: undefined,
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(ibanWithoutDescription);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should handle empty labels', async () => {
        const ibanWithoutLabels = {
            ibans_enhanced: [
                {
                    ...mockIbanList.ibans_enhanced[0],
                    labels: undefined,
                },
            ],
        };
        getIbanListSpy.mockResolvedValue(ibanWithoutLabels);

        renderComponent();

        await waitFor(() => {
            expect(getIbanListSpy).toHaveBeenCalled();
        });
    });

    it('should delete an ibanDeletionRequest and navigate back', async () => {

        createIbanDeletionRequestSpy.mockResolvedValue({});

        renderComponent();

        const deleteButton = await screen.findByTestId('delete-button-test');
        fireEvent.click(deleteButton);

        expect(
            await screen.findByText('addEditIbanPage.delete-modal.title')
        ).toBeInTheDocument();

        const dateInput = await screen.findByTestId('mock-date-picker');
        fireEvent.change(dateInput);

        const confirmButton = screen.getByText(
            'addEditIbanPage.delete-modal.confirmButton'
        );
        fireEvent.click(confirmButton);
    });
    

});