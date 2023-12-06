import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import { Actor } from "../../api/generated/portal/Actor";
import {getActor} from "../../services/nodeService";


export interface ContextState {
    details?: Actor;
    // apiKeys?: Array<any>;
    // channels?: Array<any>;
    // stations?: Array<any>;
}


const initialState: ContextState = {};

/* eslint-disable functional/immutable-data */
export const contextSlice = createSlice({
    name: 'context',
    initialState,
    reducers: {
        signUp: (state, action: PayloadAction<ContextState['details']>) => {
            state.details = action.payload;
        },
        logIn: (state, action: PayloadAction<ContextState['details']>) => {
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

export const contextSelectors = {
    selectContextState: (state: RootState): ContextState | undefined => state.context,
    selectDetails: (state: RootState): ContextState['details'] | undefined => state.context.details,
};
