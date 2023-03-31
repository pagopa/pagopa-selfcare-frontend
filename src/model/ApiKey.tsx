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
export const GPD = 'Integrazione Asincrona';
export const BIZ = 'Recupero Ricevuta';

export const API_KEY_PSP_PRODUCTS: Array<ConfiguredProductKeys> = [
  { id: 'NODOAUTH', key: NODOAUTH },
];

export const API_KEY_PRODUCTS: Array<ConfiguredProductKeys> = [
  { id: 'NODOAUTH', key: NODOAUTH },
  { id: 'GPD', key: GPD },
  { id: 'BIZ', key: BIZ },
];
