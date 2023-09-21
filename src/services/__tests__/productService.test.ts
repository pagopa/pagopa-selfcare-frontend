import { mockedProductResources } from '../../api/__mocks__/PortalApiClient';
import { fetchProducts } from '../productService';
import { productResource2Product } from '../../model/Product';

//jest.mock('../../api/PortalApiClient');

//let fetchProductsSpy: any;

beforeEach(() => {
  //fetchProductsSpy = jest.spyOn(require('../productService'), 'fetchProducts');
  //jest.spyOn(PortalApi, 'getProductRoles');
});

test('Test fetchProducts', async () => {
  const products = await fetchProducts('1');

  expect(products).toMatchObject(mockedProductResources.map(productResource2Product));

  //expect(fetchProductsSpy).toBeCalledTimes(1);
});
