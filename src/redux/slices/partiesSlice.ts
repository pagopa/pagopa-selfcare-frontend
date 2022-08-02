import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';

interface PartiesState {
  list?: Array<Party>;
  selected?: Party;
  selectedProducts?: Array<Product>;
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
    setPartySelectedProducts: (state, action: PayloadAction<Array<Product> | undefined>) => {
      state.selectedProducts = action.payload;
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): Array<Party> | undefined => state.parties.list,
  selectPartySelected: (state: RootState): Party | undefined => state.parties.selected,
  selectPartySelectedProducts: (state: RootState): Array<Product> | undefined =>
    state.parties.selectedProducts,
};
