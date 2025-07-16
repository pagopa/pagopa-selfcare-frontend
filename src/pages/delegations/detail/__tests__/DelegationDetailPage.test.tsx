import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../../redux/store';
import DelegationDetailPage from '../DelegationDetailPage';
import {brokersActions} from '../../../../redux/slices/brokersSlide';
import {mockedCIDelegations} from '../../../../services/__mocks__/brokerService';
import {useAppDispatch} from '../../../../redux/hooks';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const ComponentRender = () => {
    const dispatcher = useAppDispatch();
    dispatcher(brokersActions.setSelectedDelegation(mockedCIDelegations[0]));

    return (
        <MemoryRouter initialEntries={[`/delegations-list/detail`]}>
            <Route path="/delegations-list/detail">
                <ThemeProvider theme={theme}>
                    <DelegationDetailPage/>
                </ThemeProvider>
            </Route>
        </MemoryRouter>
    );
};

describe('<DelegationDetailPage />', () => {
    test('render component DelegationDetailPage', async () => {
        render(
            <Provider store={store}>
                <ComponentRender/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('exit-btn-test')).toBeInTheDocument();
        });
    });
});
