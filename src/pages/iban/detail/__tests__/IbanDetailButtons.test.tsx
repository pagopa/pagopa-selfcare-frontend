import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import IbanDetailButtons from '../components/IbanDetailButtons';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {createMemoryHistory} from 'history';

let deleteIbanSpy: jest.SpyInstance;

beforeEach(() => {
    deleteIbanSpy = jest.spyOn(require('../../../../services/ibanService'), 'deleteIban');
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

const renderIbanDetailButtons = (active: boolean, iban: string) => {
    render(
        <Provider store={store}>
            <Router history={createMemoryHistory()}>
                <ThemeProvider theme={theme}>
                    <IbanDetailButtons active={active} iban={iban} setShowDeleteModal={jest.fn()} isExistPendingDeletionRequest={false} setShowCancelIbanDeletionRequestModal={jest.fn()}/>
                </ThemeProvider>
            </Router>
        </Provider>
    );
};

describe('IbanDetailButtons', () => {
    it('should render the buttons', () => {
        const active = false;
        const iban = 'IT99C0222211111000000000002';

        renderIbanDetailButtons(active, iban);

        expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
        expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('delete-button-test'));
    });

    it('should render different buttons when active is true', () => {
        const active = true;
        const iban = 'IT99C0222211111000000000002';

        renderIbanDetailButtons(active, iban);

        expect(screen.getByText('ibanDetailPage.buttons.delete')).toBeInTheDocument();
        expect(screen.getByText('ibanDetailPage.buttons.edit')).toBeInTheDocument();
        // expect(screen.getByText('ibanDetailPage.buttons.deactivate')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('delete-button-test'));
    });
});
