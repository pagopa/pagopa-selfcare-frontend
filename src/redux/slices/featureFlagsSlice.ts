import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {FeatureFlags, FeatureFlagsFlags} from '../../api/generated/portal/FeatureFlags';

interface FeatureFlagsState {
    list?: FeatureFlagsFlags;
}

const initialState: FeatureFlagsState = {list: undefined};

/* eslint-disable functional/immutable-data */
export const featureFlagsSlice = createSlice({
    name: 'feature-flags',
    initialState,
    reducers: {
        setFeatureFlags: (state, action: PayloadAction<FeatureFlags>) => {
            state.list = action.payload.flags;
        },
    },
});

export const featureFlagsActions = featureFlagsSlice.actions;
export const featureFlagsReducer = featureFlagsSlice.reducer;

export const featureFlagsSelectors = {
    selectFeatureFlags: (state: RootState): FeatureFlagsFlags | undefined => state.featureFlags.list,
};
