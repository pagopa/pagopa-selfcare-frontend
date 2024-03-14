import React from 'react';
import {render} from '@testing-library/react';
import ChannelsTableSearchBar from '../ChannelsTableSearchBar';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {store} from "../../../../redux/store";
import {featureFlagsActions} from "../../../../redux/slices/featureFlagsSlice";

test('render component ChannelsTableSearchBar', async () => {
    const history = createMemoryHistory();
    const flags = {
        flags: {['isOperator']: false}
    };
    await store.dispatch(featureFlagsActions.setFeatureFlags(flags));
    render(
        <Provider store={store}>
            <Router history={history}>
                <ChannelsTableSearchBar channelCodeInput={''} setChannelCodeInput={jest.fn()}/>
            </Router>
        </Provider>
    );
});

describe('<ChannelsTableSearchBar />', () => {
});
