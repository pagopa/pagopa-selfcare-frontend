import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CIBrokerDelegationResource } from "../../api/generated/portal/CIBrokerDelegationResource";
import { StationMaintenanceResource } from "../../api/generated/portal/StationMaintenanceResource";
import { RootState } from "../store";

const initialBrokerDelegationState: CIBrokerDelegationResource = {};

export interface StationMaintenanceReduxState {
  stationMaintenance?: StationMaintenanceResource;
  hoursRemaining?: number;
};

interface InitialBrokersState {
    delegations: {
        selected: CIBrokerDelegationResource;
    };
    maintenance: StationMaintenanceReduxState;
};

const initialState: InitialBrokersState = {
    delegations: {
        selected: {} as CIBrokerDelegationResource,
    },
    maintenance: {} as StationMaintenanceReduxState
};

/* eslint-disable functional/immutable-data */
export const brokersSlice = createSlice({
  name: 'brokers',
  initialState,
  reducers: {

    // Maintenance
    setStationMaintenanceState: (state, action: PayloadAction<StationMaintenanceReduxState>) => ({
        ...state,
        maintenance: action.payload,
    }),
    setSelectedDelegation: (state, action: PayloadAction<CIBrokerDelegationResource>) => ({
        ...state,
        delegations: {
            ...state.delegations,
            selected: action.payload,
        }
    })
            
  },
});

export const brokersActions = brokersSlice.actions;
export const brokersReducer = brokersSlice.reducer;

export const brokersSelectors = {
  selectStationMaintenanceState: (state: RootState): StationMaintenanceReduxState | Record<any, any> =>
    state.brokers.maintenance,
  selectDelegationDetail: (state: RootState): CIBrokerDelegationResource | undefined =>
        state.brokers.delegations.selected,
};
