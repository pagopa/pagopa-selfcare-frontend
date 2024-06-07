import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import DelegationsPage from '../DelegationsPage';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<DelegationsPage />', () => {
    test('render component DelegationsPage', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list`]}>
                    <Route path="/delegations-list">
                        <ThemeProvider theme={theme}>
                            <DelegationsPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        // expect(screen.queryByTestId('alert-test')).not.toBeInTheDocument();
        // const downloadCSVButton = screen.getByTestId('download-list-button');

        // fireEvent.click(downloadCSVButton);

        // let alertTest;
        // await waitFor(() => {
        //   alertTest = screen.queryByTestId('alert-test');
        //   expect(alertTest).toBeInTheDocument();
        // });

        // const buttonGotIt = screen.getByTestId('got-it-button');
        // fireEvent.click(buttonGotIt);
        // await waitFor(() => {
        //   expect(alertTest).not.toBeInTheDocument();
        // });
    });

    test('render component DelegationsPage with mocked time', async () => {
        jest.setSystemTime(new Date(2020, 3, 1, 5, 5))
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/delegations-list`]}>
                    <Route path="/delegations-list">
                        <ThemeProvider theme={theme}>
                            <DelegationsPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        // expect(screen.queryByTestId('alert-test')).not.toBeInTheDocument();
        // const downloadCSVButton = screen.getByTestId('download-list-button');

        // fireEvent.click(downloadCSVButton);

        // let alertTest;
        // await waitFor(() => {
        //   alertTest = screen.queryByTestId('alert-test');
        //   expect(alertTest).toBeInTheDocument();
        // });


    });
});
