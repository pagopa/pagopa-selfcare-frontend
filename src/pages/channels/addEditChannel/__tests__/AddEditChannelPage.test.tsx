import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
<<<<<<< HEAD
import {generatePath, MemoryRouter, Route, Router} from 'react-router-dom';
=======
import {MemoryRouter, Route} from 'react-router-dom';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {store} from '../../../../redux/store';
import AddEditChannelPage from '../AddEditChannelPage';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
<<<<<<< HEAD
import ROUTES from '../../../../routes';
import {FormAction} from '../../../../model/Channel';
import {mockedIban} from '../../../../services/__mocks__/ibanService';
=======
>>>>>>> 3f32cfc3 (Formatting (#542))
import {mockedChannel} from '../../../../services/__mocks__/channelService';

let getChannelDetailMocked: jest.SpyInstance;
let getChannelCodeMocked: jest.SpyInstance;

beforeEach(() => {
    getChannelDetailMocked = jest.spyOn(
        require('../../../../services/channelService'),
        'getChannelDetail'
    );
    getChannelCodeMocked = jest.spyOn(
        require('../../../../services/channelService'),
        'getChannelCode'
    );
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<AddEditChannelPage />', () => {
    const history = createMemoryHistory();

    test('render component AddEditChannelPage formAction Edit', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${mockedChannel.channel_code}/edit`]}>
                    <Route path="/channels/:channelId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditChannelPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(getChannelDetailMocked).toBeCalled();
    });

    test('render component AddEditChannelPage formAction Edit with fetch error', () => {
        const mockError = new Error('Fetch error');
        getChannelDetailMocked.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/${mockedChannel.channel_code}/edit`]}>
                    <Route path="/channels/:channelId/:actionId">
                        <ThemeProvider theme={theme}>
                            <AddEditChannelPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(getChannelDetailMocked).toBeCalled();
    });

    test('render component AddEditChannelPage formAction Createwith fetch error', () => {
        const mockError = new Error('Fetch error');
        getChannelCodeMocked.mockRejectedValueOnce(mockError);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/channels/add-channel/`]}>
                    <Route path="/channels/add-channel/">
                        <ThemeProvider theme={theme}>
                            <AddEditChannelPage/>
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        expect(getChannelCodeMocked).toBeCalled();
    });
});
