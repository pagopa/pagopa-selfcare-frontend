import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import StandInAndCupForm from '../StandInAndCupForm';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {ibanList} from '../../../../services/__mocks__/ibanService';
import {Ibans} from '../../../../api/generated/portal/Ibans';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const TestStandInAndCupForm = ({
                                   ibanList
                               }: {
    ibanList: Ibans
}) => {
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={[`/iban`]}>
                <Route path="/iban">
                    <ThemeProvider theme={theme}>
                        <StandInAndCupForm ibanList={ibanList} error={false} loading={false}/>
                    </ThemeProvider>
                </Route>
            </MemoryRouter>
        </Provider>
    );
};

describe('StandInAndCupForm', () => {
    it('Test render StandInAndCupForm', () => {
        render(<TestStandInAndCupForm ibanList={ibanList}/>);
    });

    it('Input test with manageButton false and no cup and standIn selected, update with different iban', async () => {
        const ibanListMocked: Ibans = {
            ibans_enhanced: [
                {
                    iban: 'IT60X0542811101000000123456',
                    publication_date: '2024-06-01T23:59:59.999Z',
                    validity_date: '2024-04-01T13:49:19.897Z',
                    due_date: '2024-04-01T13:49:19.897Z',
                    ci_owner: 'RSSMRA98H27F205Q',
                    labels: [],
                    description: 'Tassa di concorso - servizio tesoreria comunale',
                    is_active: true,
                },
                {
                    iban: 'IT60X0542811101000000123457',
                    publication_date: '2024-06-01T23:59:59.999Z',
                    validity_date: '2024-04-01T13:49:19.897Z',
                    due_date: '2024-04-01T13:49:19.897Z',
                    ci_owner: 'RSSMRA98H27F205Q',
                    labels: [],
                    description: 'Tassa di concorso - servizio tesoreria comunale',
                    is_active: true,
                },
            ],
        };

        render(<TestStandInAndCupForm ibanList={ibanListMocked}/>);

        const manageButton = screen.getByTestId('iban-manage-btn');
        fireEvent.click(manageButton);

        const manageChip = screen.getByText('ibanPage.updateInProgress');
        expect(manageChip).toBeInTheDocument();

        const standInIbanSelect = screen.getByTestId('stand-in-test');
        fireEvent.click(standInIbanSelect);

        const cupIbanSelect = screen.getByTestId('cup-test');

        fireEvent.change(standInIbanSelect, {target: {value: 'IT60X0542811101000000123456'}});
        fireEvent.change(cupIbanSelect, {target: {value: 'IT60X0542811101000000123457'}});

        const uploadIbans = screen.getByTestId('upload-iban-test');
        fireEvent.click(uploadIbans);

        const confirmBtn = await screen.findByTestId('confirm-button-test');
        fireEvent.click(confirmBtn);

        fireEvent.submit(confirmBtn);
    });

    it('Input test with manageButton false and with cup and standIn selected, update with different iban', async () => {
        render(<TestStandInAndCupForm ibanList={ibanList}/>);

        const manageButton = screen.getByTestId('iban-manage-btn');
        fireEvent.click(manageButton);

        const manageChip = screen.getByText('ibanPage.updateInProgress');
        expect(manageChip).toBeInTheDocument();

        const standInIbanSelect = screen.getByTestId('stand-in-test');
        fireEvent.click(standInIbanSelect);

        const cupIbanSelect = screen.getByTestId('cup-test');

        fireEvent.change(standInIbanSelect, {target: {value: 'IT99C0222211111000000000003'}});
        fireEvent.change(cupIbanSelect, {target: {value: 'IT99C0222211111000000000004'}});

        const uploadIbans = screen.getByTestId('upload-iban-test');
        fireEvent.click(uploadIbans);

        const confirmBtn = await screen.findByTestId('confirm-button-test');
        fireEvent.click(confirmBtn);

        fireEvent.submit(confirmBtn);
    });

    it('Input test with manageButton false and with cup and standIn selected, update with same iban', async () => {
        render(<TestStandInAndCupForm ibanList={ibanList}/>);

        const manageButton = screen.getByTestId('iban-manage-btn');
        fireEvent.click(manageButton);

        const manageChip = screen.getByText('ibanPage.updateInProgress');
        expect(manageChip).toBeInTheDocument();

        const standInIbanSelect = screen.getByTestId('stand-in-test');
        fireEvent.click(standInIbanSelect);

        const cupIbanSelect = screen.getByTestId('cup-test');

        fireEvent.change(standInIbanSelect, {target: {value: 'IT99C0222211111000000000003'}});
        fireEvent.change(cupIbanSelect, {target: {value: 'IT99C0222211111000000000003'}});

        const uploadIbans = screen.getByTestId('upload-iban-test');
        fireEvent.click(uploadIbans);

        const confirmBtn = await screen.findByTestId('confirm-button-test');
        fireEvent.click(confirmBtn);

        fireEvent.submit(confirmBtn);
    });

    it('Input test with manageButton false and no cup and standIn selected', async () => {
        render(<TestStandInAndCupForm ibanList={ibanList}/>);

        const manageButton = screen.getByTestId('iban-manage-btn');
        fireEvent.click(manageButton);

        const manageChip = screen.getByText('ibanPage.updateInProgress');
        expect(manageChip).toBeInTheDocument();

        const standInIbanSelect = screen.getByTestId('stand-in-test');
        fireEvent.click(standInIbanSelect);

        const uploadIbans = screen.getByTestId('upload-iban-test');
        fireEvent.click(uploadIbans);

        const confirmBtn = await screen.findByTestId('confirm-button-test');
        fireEvent.click(confirmBtn);

        fireEvent.submit(confirmBtn);
    });

    it('Input test with manageButton true', () => {
        render(<TestStandInAndCupForm ibanList={ibanList}/>);

        const ibanStandInValue = screen.getByTestId('iban-standin-with-manage-btn-false');
        const ibanCupValue = screen.getByTestId('iban-cup-with-manage-btn-false');

        expect(ibanStandInValue).toBeInTheDocument();
        expect(ibanCupValue).toBeInTheDocument();
    });
});
