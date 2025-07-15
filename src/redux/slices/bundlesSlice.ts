import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {BundleResource} from '../../model/CommissionBundle';

const initialState = {};

/* eslint-disable functional/immutable-data */
export const bundlesSlice = createSlice({
    name: 'bundles',
    initialState,
    reducers: {
        setBundleDetailsState: (_, action: PayloadAction<BundleResource>) => action.payload,
    },
});

export const bundlesActions = bundlesSlice.actions;
export const bundlesReducer = bundlesSlice.reducer;

export const bundlesSelectors = {
    selectBundles: (state: RootState): BundleResource | Record<any, any> => state.bundleDetails,
};
