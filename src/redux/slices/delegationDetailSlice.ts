import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { CIBrokerDelegationResource } from '../../api/generated/portal/CIBrokerDelegationResource';

const initialState: CIBrokerDelegationResource = {};

/* eslint-disable functional/immutable-data */
export const delegationDetailSlice = createSlice({
  name: 'delegationDetail',
  initialState,
  reducers: {
    setDelegationDetailState: (_, action: PayloadAction<CIBrokerDelegationResource>) =>
      action.payload,
  },
});

export const delegationDetailActions = delegationDetailSlice.actions;
export const delegationDetailReducer = delegationDetailSlice.reducer;

export const delegationDetailSelectors = {
  selectDelegationDetail: (state: RootState): CIBrokerDelegationResource | undefined =>
    state.delegationDetail,
};
