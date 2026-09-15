import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {InstitutionUploadData} from '../../api/generated/portal/InstitutionUploadData';

export const paymentNoticeTemplate: InstitutionUploadData = {
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

interface PaymentsInitialState {
    paymentNoticeTemplate: InstitutionUploadData;
}

export const initialState: PaymentsInitialState = {
    paymentNoticeTemplate
};

/* eslint-disable functional/immutable-data */
export const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setPaymentsNoticeTemplate: (state, action: PayloadAction<InstitutionUploadData>) => ({
            ...state,
            paymentNoticeTemplate: action.payload
        }),
    },
});

export const paymentsActions = paymentsSlice.actions;
export const paymentsReducer = paymentsSlice.reducer;

export const paymentNoticeTemplateSelectors = {
    selectPaymentNoticeTemplate: (state: RootState): InstitutionUploadData => state.payments.paymentNoticeTemplate,
};
