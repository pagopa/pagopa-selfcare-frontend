import { API_KEY_PRODUCTS, getApiKeyProducts } from '../ApiKey';
describe("Test ApiKey model methods", ()=> {
    test("Test getApiKeysProducts as PSP", () => {
        expect(getApiKeyProducts(true, true)).toEqual([API_KEY_PRODUCTS.NODOAUTH, API_KEY_PRODUCTS.BO_EXT_PSP, API_KEY_PRODUCTS.FDR_PSP])
    })
    test("Test getApiKeysProducts as EC", () => {
        expect(getApiKeyProducts(false, true)).toEqual([
            API_KEY_PRODUCTS.NODOAUTH,
            API_KEY_PRODUCTS.GPD, 
            API_KEY_PRODUCTS.GPD_PAY,
            API_KEY_PRODUCTS.GPD_REP,
            API_KEY_PRODUCTS.BIZ,
            API_KEY_PRODUCTS.BO_EXT_EC,
            API_KEY_PRODUCTS.ACA,
            API_KEY_PRODUCTS.FDR_ORG,
            API_KEY_PRODUCTS.PRINT_NOTICE
          ])
    })
})