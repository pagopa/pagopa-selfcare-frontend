import React, {PropsWithChildren} from 'react';
import {render} from '@testing-library/react';
import type {RenderOptions} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import type {PreloadedState} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {userReducer} from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import {appStateReducer} from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import {RootState} from '../redux/store';
import {partiesReducer} from '../redux/slices/partiesSlice';

// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>;
    store?: any;
}

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState,
        // Automatically create a store instance if no store was passed in
        store = configureStore({
            reducer: {
                parties: partiesReducer,
                user: userReducer,
                appState: appStateReducer,
            },
            preloadedState,
        }),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    function Wrapper({children}: PropsWithChildren<{}>): JSX.Element {
        return <Provider store={store}>{children}</Provider>;
    }

    // Return an object with the store and all of RTL's query functions
    return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
