import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
<<<<<<< HEAD
import {cleanup, render, waitFor, screen} from '@testing-library/react';
=======
import {cleanup, render, screen, waitFor} from '@testing-library/react';
>>>>>>> 3f32cfc3 (Formatting (#542))
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import ChannelsTable from '../ChannelsTable';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {pspAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import {partiesActions} from '../../../../redux/slices/partiesSlice';
import {useAppDispatch} from '../../../../redux/hooks';
import * as ChannelService from '../../../../services/channelService';
import {mockedChannelsMerged} from '../../../../services/__mocks__/channelService';

const mockGetChannelsMerged = jest.spyOn(ChannelService, 'getChannelsMerged');

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const Component = () => {
    const history = createMemoryHistory();
    const dispatch = useAppDispatch();
    dispatch(partiesActions.setPartySelected(pspAdminSignedDirect));

    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <ChannelsTable channelCodeFilter={'1'}/>
            </Router>
        </ThemeProvider>
    );
};

describe('<ChannelsTable />', () => {
    test('render component ChannelsTable', async () => {
        mockGetChannelsMerged.mockReturnValue(Promise.resolve(mockedChannelsMerged));
        render(
            <Provider store={store}>
                <Component/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).not.toBeInTheDocument();
        });
    });
    test('render component ChannelsTable error getChannelsMerged', async () => {
        mockGetChannelsMerged.mockRejectedValue('error');
        render(
            <Provider store={store}>
                <Component/>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('empty-state-table')).toBeInTheDocument();
        });
    });
});
