import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { InstitutionUploadData } from '../../api/generated/portal/InstitutionUploadData';

const initialState = {};

/* eslint-disable functional/immutable-data */
export const institutionsDataDetailsSlice = createSlice({
  name: 'institutionsDataDetails',
  initialState,
  reducers: {
    setInstitutionDataDetailsState: (_, action: PayloadAction<InstitutionUploadData>) => action.payload,
  },
});

export const institutionsDataDetailsActions = institutionsDataDetailsSlice.actions;
export const institutionsDataDetailsReducer = institutionsDataDetailsSlice.reducer;

export const institutionsDataDetailsSelectors = {
  selectInstitutionsDataDetailsDetails: (state: RootState): InstitutionUploadData | Record<any, any> => state.institutionsDataDetails,
};
