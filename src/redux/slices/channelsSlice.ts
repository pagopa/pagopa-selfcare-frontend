import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';

interface ChannelsState {
    associatedPSPTaxCodes: Array<string>;
}

const initialState: ChannelsState = {
    associatedPSPTaxCodes: [],
};

/* eslint-disable functional/immutable-data */
export const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setAssociatedPSPTaxCodes: (state, action: PayloadAction<Array<string>>) => ({
            ...state,
            associatedPSPTaxCodes: action.payload,
        }),
    },
});

export const channelsActions = channelsSlice.actions;
export const channelsReducer = channelsSlice.reducer;

export const channelsSelectors = {
    selectAssociatedPSPTaxCodes: (state: RootState): Array<string> =>
        state.channels.associatedPSPTaxCodes,
};
