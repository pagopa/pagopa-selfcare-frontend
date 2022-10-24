import { ProductsResource, StatusEnum } from '../../api/generated/portal/ProductsResource';
import { productResource2Product } from '../Product';

test('Test institutionInfo2Party', () => {
  const date = new Date();

  const productResource: ProductsResource = {
    description: 'Pagamenti pagoPA description',
    id: '3',
    title: 'Pagamenti pagoPA',
    urlBO: 'http://pagopa/bo',
    urlPublic: 'http://pagopa/public',
  };

  const product = productResource2Product(productResource);
  expect(product).toStrictEqual({
    description: 'Pagamenti pagoPA description',
    id: '3',
    title: 'Pagamenti pagoPA',
    urlBO: 'http://pagopa/bo',
    urlPublic: 'http://pagopa/public',
    selfcareRole: undefined,
    roles: [],
    authorized: true,
    status: 'ACTIVE',
    imageUrl: '',
    subProducts: [],
  });
});
