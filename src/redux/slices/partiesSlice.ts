import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Party } from '../../model/Party';
import { ProductModel } from '../../model/Product';
import { SigninData } from '../../model/Node';

interface PartiesState {
  list?: Array<Party>;
  selected?: Party;
  selectedProducts?: Array<ProductModel>;
  signinData?: SigninData | undefined;
}

const initialState: PartiesState = {};

/* eslint-disable functional/immutable-data */
export const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesList: (state, action: PayloadAction<Array<Party>>) => {
      state.list = action.payload;
    },
    setPartySelected: (state, action: PayloadAction<Party | undefined>) => {
      state.selected = action.payload;
    },
    setPartySelectedProducts: (state, action: PayloadAction<Array<ProductModel> | undefined>) => {
      state.selectedProducts = action.payload;
    },
    setSigninData: (state, action: PayloadAction<SigninData | undefined>) => {
      state.signinData = action.payload;
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): Array<Party> | undefined => state.parties.list,
  selectPartySelected: (state: RootState): Party | undefined => state.parties.selected,
  selectPartySelectedProducts: (state: RootState): Array<ProductModel> | undefined =>
    state.parties.selectedProducts,
  selectSigninData: (state: RootState): SigninData | undefined => state.parties.signinData,
};
