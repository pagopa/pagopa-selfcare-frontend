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
export const GPD = 'GPD - Integrazione Asincrona';
export const GPD_REP = 'GPD - Gestione Flussi di Rendicontazione';
export const BIZ = 'BIZ - Recupero Ricevuta';
export const FDR_ORG = 'FdR - Flussi di Rendicontazione [ORG]';
export const FDR_PSP = 'FdR - Flussi di Rendicontazione [PSP]';

export const API_KEY_PSP_PRODUCTS = (): Array<ConfiguredProductKeys> => {
    let list = [{id: 'NODOAUTH', key: NODOAUTH}];

    if (ENV.FEATURES.FDR) {
        list.push({id: 'FDR_PSP', key: FDR_PSP});
    }
    return list;
};


export const API_KEY_PRODUCTS = (): Array<ConfiguredProductKeys> => {
    let list = [
        {id: 'NODOAUTH', key: NODOAUTH},
        {id: 'GPD_REP', key: GPD_REP},
        {id: 'GPD', key: GPD},
        {id: 'BIZ', key: BIZ},
    ];

    if (ENV.FEATURES.FDR) {
        list.push({id: 'FDR_ORG', key: FDR_ORG});
    }
    return list;
};
