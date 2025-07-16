import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { CreditorInstitutionResource } from '../../api/generated/portal/CreditorInstitutionResource';
import { StationMaintenanceResource } from '../../api/generated/portal/StationMaintenanceResource';

interface InitialSelectedStationState {
    creditInstitutions: CreditorInstitutionResource;
};

interface InitialStationsState {
    selected: InitialSelectedStationState;
    maintenance: StationMaintenanceReduxState;
};

export interface StationMaintenanceReduxState {
  stationMaintenance?: StationMaintenanceResource;
  hoursRemaining?: number;
}

const initialState: InitialStationsState = {
    selected: {
        creditInstitutions: {} as CreditorInstitutionResource
    },
    maintenance: {} as StationMaintenanceReduxState
};

/* eslint-disable functional/immutable-data */
export const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    // Selected station
    // Credit institution
    setSelectedCreditInstitution: (state, action: PayloadAction<CreditorInstitutionResource>) => ({
        ...state,
        selected: {
            ...state.selected,
            creditInstitutions: action.payload 
        }
    }),

    // Maintenance
    setStationMaintenanceState: (state, action: PayloadAction<StationMaintenanceReduxState>) => ({
        ...state,
        maintenance: action.payload,
    })
  },
});

export const stationsActions = stationsSlice.actions;
export const stationsReducer = stationsSlice.reducer;

export const stationsSelectors = {
  selectSelectedStationCreditInstitution: (state: RootState): CreditorInstitutionResource | Record<any, any> =>
    state.stations.selected.creditInstitutions,
  selectStationMaintenanceState: (state: RootState): StationMaintenanceReduxState | Record<any, any> =>
    state.stations.maintenance,
};
