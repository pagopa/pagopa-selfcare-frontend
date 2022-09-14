import { ProductKeys } from '../../model/Token';

export const mockedKeys: ProductKeys = {
  primaryKey: '000000234000001123400000007778',
  secondaryKey: '0000005690000011234000000077155',
};

export const getInstitutionApiKeys = (_institutionId: string): Promise<ProductKeys> =>
  new Promise((resolve) => resolve(mockedKeys));
