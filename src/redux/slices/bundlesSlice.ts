import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {BundleResource} from '../../model/CommissionBundle';

interface BundleState {
    list?: Array<BundleResource> | Array<Record<any,any>>;
    selected?: BundleResource | Record<any,any>;
}

const initialState: BundleState = {};

/* eslint-disable functional/immutable-data */
export const bundlesSlice = createSlice({
    name: 'bundles',
    initialState,
    reducers: {
        setBundleSelected: (state, action: PayloadAction<BundleResource>) => ({...state, selected: action.payload }),
    },
});

export const bundlesActions = bundlesSlice.actions;
export const bundlesReducer = bundlesSlice.reducer;

export const bundlesSelectors = {
    selectBundles: (state: RootState): Array<BundleResource> | Array<Record<any, any>> => state.bundles.list ?? [],
    selectBundle: (state: RootState): BundleResource | Record<any, any> => state.bundles.selected ?? {}
};
