import { mockedProductResources } from '../../api/__mocks__/PortalApiClient';
import { PortalApi } from '../../api/PortalApiClient';
import { fetchProducts } from '../productService';
import { productResource2Product } from '../../model/Product';

jest.mock('../../api/PortalApiClient');

beforeEach(() => {
  jest.spyOn(PortalApi, 'getProducts');
  //jest.spyOn(PortalApi, 'getProductRoles');
});

test('Test fetchProducts', async () => {
  const products = await fetchProducts('1');

  expect(products).toMatchObject(mockedProductResources.map(productResource2Product));

  expect(PortalApi.getProducts).toBeCalledTimes(1);
});
