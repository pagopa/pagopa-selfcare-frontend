import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { InstitutionUploadData } from '../../api/generated/portal/InstitutionUploadData';

const initialState : InstitutionUploadData = {
    taxCode: '',
    fullName: '',
    cbill: '',
    appChannel: false,
    webChannel: false,
    info: '',
    organization: '',
    logo: undefined,
    physicalChannel: '',
    posteName: undefined,
    posteAuth: undefined,
    posteAccountNumber: undefined 
};

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
  selectInstitutionsDataDetailsDetails: (state: RootState): InstitutionUploadData => state.institutionDataDetails,
};
