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

export const API_KEY_PRODUCTS: Array<ConfiguredProductKeys> = [
  { id: 'NODOAUTH', key: 'Connessione con nodo' },
  /* { id: 'GPD', key: 'Posizioni debitorie' },
  { id: 'BIZ', key: 'Evento di pagamento' }, */
];
