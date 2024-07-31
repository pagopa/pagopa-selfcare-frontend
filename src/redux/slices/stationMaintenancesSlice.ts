import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { StationMaintenanceResource } from '../../api/generated/portal/StationMaintenanceResource';

export interface StationMaintenanceReduxState {
  stationMaintenance?: StationMaintenanceResource;
  hoursRemaining?: number;
}

const initialState: StationMaintenanceReduxState = {};

/* eslint-disable functional/immutable-data */
export const stationMaintenanceSlice = createSlice({
  name: 'stationMaintenance',
  initialState,
  reducers: {
    setStationMaintenanceState: (_, action: PayloadAction<StationMaintenanceReduxState>) =>
      action.payload,
  },
});

export const stationMaintenanceActions = stationMaintenanceSlice.actions;
export const stationMaintenanceReducer = stationMaintenanceSlice.reducer;

export const stationMaintenanceSelectors = {
  selectStationMaintenanceState: (state: RootState): StationMaintenanceReduxState | Record<any, any> =>
    state.stationMaintenance,
};
