import { BackofficeApi } from '../../api/BackofficeClient';
import { mockedPartyProducts } from '../__mocks__/productService';
import { fetchProducts } from '../productService';

describe('ProductService test client', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV, REACT_APP_API_MOCK_BACKOFFICE: 'false' };
    });
  
    afterAll(() => {
      process.env = OLD_ENV;
    });
  
    test('Test fetchProducts', async () => {
      const spyOn = jest
        .spyOn(BackofficeApi, 'getProducts')
        .mockReturnValue(new Promise((resolve) => resolve(mockedPartyProducts)));
      expect(fetchProducts('partyId')).resolves.not.toThrow();
      expect(spyOn).toBeCalledTimes(1);
    });
  
    test('Test fetchProducts with empty response', async () => {
      const spyOn = jest
        .spyOn(BackofficeApi, 'getProducts')
        .mockReturnValue(new Promise((resolve) => resolve({})));
      expect(fetchProducts('partyId')).resolves.not.toThrow();
      expect(spyOn).toBeCalledTimes(1);
    });
  });
  
  describe('ProductService test mocked', () => {
    test('Test fetchProducts', async () => {
      const response = await fetchProducts('partyId');
      expect(response).toMatchObject(mockedPartyProducts);
    });
  });
  