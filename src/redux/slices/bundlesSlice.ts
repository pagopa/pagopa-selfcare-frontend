import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {BundleResource} from '../../model/CommissionBundle';

interface BundleState {
    selected?: BundleResource | Record<any,any>;
}

const initialState: BundleState = {};

/* eslint-disable functional/immutable-data */
export const bundlesSlice = createSlice({
    name: 'bundles',
    initialState,
    reducers: {
        setSelectedBundle: (state, action: PayloadAction<BundleResource>) => ({...state, selected: action.payload }),
    },
});

export const bundlesActions = bundlesSlice.actions;
export const bundlesReducer = bundlesSlice.reducer;

export const bundlesSelectors = {
    selectBundle: (state: RootState): BundleResource | Record<any, any> => state.bundles.selected ?? {}
};
