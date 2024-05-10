import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { BundleResource } from '../../model/CommissionBundle';

const initialState = {};

/* eslint-disable functional/immutable-data */
export const bundleDetailsSlice = createSlice({
  name: 'bundleDetails',
  initialState,
  reducers: {
    setBundleDetailsState: (_, action: PayloadAction<BundleResource>) => action.payload,
  },
});

export const bundleDetailsActions = bundleDetailsSlice.actions;
export const bundleDetailsReducer = bundleDetailsSlice.reducer;

export const bundleDetailsSelectors = {
  selectBundleDetails: (state: RootState): BundleResource | Record<any, any> => state.bundleDetails,
};
