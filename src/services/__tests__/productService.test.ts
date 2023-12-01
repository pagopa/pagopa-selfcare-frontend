import { mockedProductResources } from '../../api/__mocks__/BackofficeClient';
import { fetchProducts } from '../productService';
import { productResource2Product } from '../../model/Product';

//jest.mock('../../api/BackofficeClient');

//let fetchProductsSpy: any;

beforeEach(() => {
  //fetchProductsSpy = jest.spyOn(require('../productService'), 'fetchProducts');
  //jest.spyOn(BackofficeApi, 'getProductRoles');
});

test('Test fetchProducts', async () => {
  const products = await fetchProducts('1');

  expect(products).toMatchObject(mockedProductResources.map(productResource2Product));

  //expect(fetchProductsSpy).toBeCalledTimes(1);
});
