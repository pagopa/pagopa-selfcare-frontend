import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";

const initialState: ContextState = {};

/* eslint-disable functional/immutable-data */
export const contextSlice = createSlice({
    name: 'context',
    initialState,
    reducers: {
        signUp: (state, action: PayloadAction<ContextState['details']>) => {
            state.details = action.payload;
        },
        editInfo: (state, action: PayloadAction<ContextState['details']>) => {
            state.details = action.payload;
        },
        // createApiKey: (state, action: PayloadAction<ContextState['apiKeys']>) => {
        //     state.apiKeys = action.payload;
        // },
    },
});

export const contextActions = contextSlice.actions;
export const contextReducer = contextSlice.reducer;

export const detailsSelectors = {
    selectContextState: (state: RootState): ContextState | undefined => state.context,
    selectDetails: (state: RootState): ContextState['details'] | undefined => state.context.details,
};
