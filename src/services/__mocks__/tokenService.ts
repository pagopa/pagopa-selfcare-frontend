import { ProductKeys } from '../../model/Token';

export const mockedKeys: ProductKeys = {
  primaryKey: '000000234000001123400000007744',
  secondaryKey: '0000005690000011234000000077155',
};
export const createMockedKeys: ProductKeys = {
  primaryKey: '000000234000001123400000007788',
  secondaryKey: '0000005690000011234000000077177',
};
export const mockedPrimaryKey = '000000234000001123400000007744r';
export const mockedSecondaryKey = '0000005690000011234000000077155r';

export const getInstitutionApiKeys = (_institutionId: string): Promise<ProductKeys> =>
  new Promise((resolve) => resolve(mockedKeys));

export const createInstitutionApiKeys = (_institutionId: string): Promise<ProductKeys> =>
  new Promise((resolve) => resolve(createMockedKeys));

export const regeneratePrimaryKey = (_institutionId: string): Promise<string> =>
  new Promise((resolve) => resolve(mockedPrimaryKey));

export const regenerateSecondaryKey = (_institutionId: string): Promise<string> =>
  new Promise((resolve) => resolve(mockedSecondaryKey));
