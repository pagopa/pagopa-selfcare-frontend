import { OrgTypes } from '../../hooks/useOrganizationType';
import { API_KEY_PRODUCTS, getApiKeyProducts } from '../ApiKey';
describe('Test ApiKey model methods', () => {
  test('Test getApiKeysProducts as PSP', () => {
    const orgType: OrgTypes = { isPsp: true, isPspBroker: false, isEc: false, isEcBroker: false };
    expect(getApiKeyProducts(orgType, true)).toEqual([
      API_KEY_PRODUCTS.NODOAUTH,
      API_KEY_PRODUCTS.BO_EXT_PSP,
      API_KEY_PRODUCTS.QI_FDR_KPI,
      API_KEY_PRODUCTS.FDR_PSP,
    ]);
  });
  test('Test getApiKeysProducts as EC', () => {
    const orgType: OrgTypes = { isPsp: false, isPspBroker: false, isEc: true, isEcBroker: false };
    expect(getApiKeyProducts(orgType, true)).toEqual([
      API_KEY_PRODUCTS.NODOAUTH,
      API_KEY_PRODUCTS.BO_EXT_EC,
      API_KEY_PRODUCTS.GPD,
      API_KEY_PRODUCTS.GPD_PAY,
      API_KEY_PRODUCTS.GPD_REP,
      API_KEY_PRODUCTS.BIZ,
      API_KEY_PRODUCTS.ACA,
      API_KEY_PRODUCTS.PRINT_NOTICE,
      API_KEY_PRODUCTS.FDR_ORG,
    ]);
  });
  test('Test getApiKeysProducts as PT PSP', () => {
    const orgType: OrgTypes = { isPsp: false, isPspBroker: true, isEc: false, isEcBroker: false };
    expect(getApiKeyProducts(orgType, true)).toEqual([
      API_KEY_PRODUCTS.NODOAUTH,
      API_KEY_PRODUCTS.BO_EXT_PSP,
      API_KEY_PRODUCTS.QI_FDR_KPI,
      API_KEY_PRODUCTS.FDR_PSP,
    ]);
  });
  test('Test getApiKeysProducts as PT EC', () => {
    const orgType: OrgTypes = { isPsp: false, isPspBroker: false, isEc: false, isEcBroker: true };
    expect(getApiKeyProducts(orgType, true)).toEqual([
      API_KEY_PRODUCTS.NODOAUTH,
      API_KEY_PRODUCTS.BO_EXT_EC,
      API_KEY_PRODUCTS.GPD,
      API_KEY_PRODUCTS.GPD_PAY,
      API_KEY_PRODUCTS.GPD_REP,
      API_KEY_PRODUCTS.BIZ,
      API_KEY_PRODUCTS.ACA,
      API_KEY_PRODUCTS.PRINT_NOTICE,
      API_KEY_PRODUCTS.FDR_ORG
    ]);
  });
  test('Test getApiKeysProducts as PT EC/PSP', () => {
    const orgType: OrgTypes = { isPsp: false, isPspBroker: true, isEc: false, isEcBroker: true };
    expect(getApiKeyProducts(orgType, true)).toEqual([
      API_KEY_PRODUCTS.NODOAUTH,
      API_KEY_PRODUCTS.BO_EXT_PSP,
      API_KEY_PRODUCTS.BO_EXT_EC,
      API_KEY_PRODUCTS.GPD,
      API_KEY_PRODUCTS.GPD_PAY,
      API_KEY_PRODUCTS.GPD_REP,
      API_KEY_PRODUCTS.BIZ,
      API_KEY_PRODUCTS.ACA,
      API_KEY_PRODUCTS.PRINT_NOTICE,
      API_KEY_PRODUCTS.QI_FDR_KPI,
      API_KEY_PRODUCTS.FDR_PSP,
      API_KEY_PRODUCTS.FDR_ORG,
    ]);
  });
});
