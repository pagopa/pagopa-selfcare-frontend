import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { CreditorInstitutionResource } from '../../api/generated/portal/CreditorInstitutionResource';

interface InitialSelectedStationState {
    creditInstitutions: CreditorInstitutionResource;
};

interface InitialStationsState {
    selected: InitialSelectedStationState;
};

const initialState = {
    selected: {
        creditInstitutions: {} as CreditorInstitutionResource
    }
};

/* eslint-disable functional/immutable-data */
export const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setSelectedCreditInstitution: (state, action: PayloadAction<CreditorInstitutionResource>) => ({
        ...state,
        selected: {
            ...state.selected,
            creditInstitutions: action.payload 
        }
    }),
  },
});

export const stationsActions = stationsSlice.actions;
export const stationsReducer = stationsSlice.reducer;

export const stationsSelectors = {
  selectSelectedStationCreditInstitution: (state: RootState): CreditorInstitutionResource | Record<any, any> =>
    state.stations.selected.creditInstitutions,
};
