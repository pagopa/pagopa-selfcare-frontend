import {ENV} from "../utils/env";

export type ProductKeys = {
    id: string;
    displayName: string;
    primaryKey: string;
    secondaryKey: string;
};

export type AvailableProductKeys = {
    id: string;
    title: string;
    disabled: boolean;
};

export type ConfiguredProductKeys = {
    id: string;
    key: string;
};

export const NODOAUTH = 'Connessione con nodo';
export const GPD = 'GPD - Posizioni Debitorie';
export const GPD_REP = 'GPD - Gestione flussi di rendicontazione';
export const GPD_PAY = 'GPD - Recupero ricevute';
export const BIZ = 'BIZ - Recupero ricevute Ente Creditore';
export const FDR_ORG = 'FdR - Flussi di Rendicontazione (ORG)';
export const FDR_PSP = 'FdR - Flussi di Rendicontazione (PSP)';

export const API_KEY_PSP_PRODUCTS = (): Array<ConfiguredProductKeys> => {
    const list = [{id: 'NODOAUTH', key: NODOAUTH}];

    if (ENV.FEATURES.FDR) {
        return [...list, {id: 'FDR_PSP', key: FDR_PSP}];
    }
    return list;
};


export const API_KEY_PRODUCTS = (): Array<ConfiguredProductKeys> => {
    const list = [
        {id: 'NODOAUTH', key: NODOAUTH},
        {id: 'GPD', key: GPD},
        {id: 'GPD_PAY', key: GPD_PAY},
        {id: 'GPD_REP', key: GPD_REP},
        {id: 'BIZ', key: BIZ},
    ];

    if (ENV.FEATURES.FDR) {
        return [...list, {id: 'FDR_ORG', key: FDR_ORG}];
    }
    return list;
};
