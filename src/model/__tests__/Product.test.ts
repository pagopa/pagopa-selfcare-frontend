import { ProductsResource } from '../../api/generated/portal/ProductsResource';
import { productResource2Product } from '../Product';

test('Test institutionInfo2Party', () => {
  const productResource: ProductsResource = {
    description: 'Piattaforma pagoPa description',
    id: '3',
    title: 'Piattaforma pagoPa',
    urlBO: 'http://pagopa/bo',
    urlPublic: 'http://pagopa/public',
  };

  const product = productResource2Product(productResource);
  expect(product).toStrictEqual({
    description: 'Piattaforma pagoPa description',
    id: '3',
    title: 'Piattaforma pagoPa',
    urlBO: 'http://pagopa/bo',
    urlPublic: 'http://pagopa/public',
    selfcareRole: 'ADMIN',
    roles: [],
    authorized: true,
    status: 'ACTIVE',
    imageUrl: '',
    subProducts: [],
  });
});
