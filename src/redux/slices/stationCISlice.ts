import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { CreditorInstitutionResource } from '../../api/generated/portal/CreditorInstitutionResource';

const initialState = {};

/* eslint-disable functional/immutable-data */
export const stationCISlice = createSlice({
  name: 'stationCI',
  initialState,
  reducers: {
    setStationCIState: (_, action: PayloadAction<CreditorInstitutionResource>) => action.payload,
  },
});

export const stationCIActions = stationCISlice.actions;
export const stationCIReducer = stationCISlice.reducer;

export const stationCISelectors = {
  selectStationCI: (state: RootState): CreditorInstitutionResource | Record<any, any> =>
    state.stationCI,
};
