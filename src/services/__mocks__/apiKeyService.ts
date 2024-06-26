import {InstitutionApiKeysResource} from '../../api/generated/portal/InstitutionApiKeysResource';

export const createMockedKeys: InstitutionApiKeysResource = {
    institution_api_key_list: [
        {
            primaryKey: '5ae0ec6a8a5e49cb906b034963c6d2da',
            secondaryKey: '77d5d4ec6ccb4c21915ec78dfed12f96',
            displayName: 'Connessione con nodo',
            id: 'nodauth-e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
        },
        {
            primaryKey: 'f8b0d8b19e7d42d9bf4e40697a9e2819',
            secondaryKey: '6ec6877879a64640bd15ff5b78e2b37f',
            displayName: ' Integrazione Asincrona',
            id: 'gdp-e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
        },
        {
            primaryKey: '32ca791981df4ec0b10de14cced7a59a',
            secondaryKey: '273e47988e1a489b8aa164eb875f1417',
            displayName: 'Recupero Ricevuta',
            id: 'bes-e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
        },
    ],
};

export const mockedKeys: InstitutionApiKeysResource = {
    institution_api_key_list: [
        {
            primaryKey: '5ae0ec6a8a5e49cb906b034963c6d2da',
            secondaryKey: '77d5d4ec6ccb4c21915ec78dfed12f96',
            displayName: 'Connessione con nodo',
            id: 'nodauth-e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
        },
        {
            primaryKey: 'f8b0d8b19e7d42d9bf4e40697a9e2819',
            secondaryKey: '6ec6877879a64640bd15ff5b78e2b37f',
            displayName: ' Integrazione Asincrona',
            id: 'gdp-e162ca3b-fe5a-4bfd-a0b7-1ca1586d079e',
        },
    ],
};

export const mockedPrimaryKey = '000000234000001123400000007744r';
export const mockedSecondaryKey = '0000005690000011234000000077155r';

export const getInstitutionApiKeys = (
    _institutionId: string
): Promise<InstitutionApiKeysResource> => Promise.resolve(mockedKeys);

export const createInstitutionApiKeys = (
    _institutionId: string,
    _subscriptionCode: string
): Promise<InstitutionApiKeysResource> => Promise.resolve(createMockedKeys);

export const regeneratePrimaryKey = (
    _institutionId: string,
    _subscriptionId: string
): Promise<string> => Promise.resolve(mockedPrimaryKey);

export const regenerateSecondaryKey = (
    _institutionId: string,
    _subscriptionId: string
): Promise<string> => Promise.resolve(mockedSecondaryKey);
