import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import ChannelsPage, {clearLocationState} from '../ChannelsPage';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import * as useUserRole from '../../../../hooks/useUserRole';
import {ROLE} from '../../../../model/RolePermission';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<ChannelsPage />', () => {
    const history = createMemoryHistory();

    test('render component ChannelsPage', () => {
        history.location.state = {alertSuccessMessage: 'Success!'};
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <ChannelsPage/>
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        expect(screen.getByTestId('alert-test')).toBeInTheDocument();
    });

    test('render component ChannelsPage operator', async () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: false
        });
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <ChannelsPage/>
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    });

    it('should replace the current state of window history', () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: true,
            userIsAdmin: false
        });
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <ChannelsPage/>
                    </Router>
                </ThemeProvider>
            </Provider>
        );

        const mockReplaceState = jest.fn();
        window.history.replaceState = mockReplaceState;

        clearLocationState();

        expect(mockReplaceState).toHaveBeenCalledWith({}, document.title);
    });
});

