import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {FeatureFlags, FeatureFlagsFlags} from '../../api/generated/portal/FeatureFlags';

interface FeatureFlagsState {
    flags?: FeatureFlagsFlags;
}

const initialState: FeatureFlagsState = {flags: undefined};

/* eslint-disable functional/immutable-data */
export const featureFlagsSlice = createSlice({
    name: 'feature-flags',
    initialState,
    reducers: {
        setFeatureFlags: (state, action: PayloadAction<FeatureFlags>) => {
            state.flags = action.payload.flags;
        },
    },
});

export const featureFlagsActions = featureFlagsSlice.actions;
export const featureFlagsReducer = featureFlagsSlice.reducer;

export const featureFlagsSelectors = {
    selectFeatureFlags: (state: RootState): FeatureFlagsFlags | undefined => state.featureFlags.flags,
};
