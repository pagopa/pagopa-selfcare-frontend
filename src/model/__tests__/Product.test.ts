import { ProductsResource, StatusEnum } from '../../api/generated/portal/ProductsResource';
import { productResource2Product } from '../Product';

test('Test institutionInfo2Party', () => {
  const date = new Date();

  const productResource: ProductsResource = {
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: StatusEnum.ACTIVE,
    urlBO: 'http://pagopa/bo',
    activatedAt: date,
    urlPublic: 'http://pagopa/public',
    userRole: 'LIMITED',
    children: [{ id: 'subProductId', title: 'Premium', status: StatusEnum.ACTIVE }],
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  };

  const product = productResource2Product(productResource);
  expect(product).toStrictEqual({
    logo: 'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/prod-pagopa/logo.png',
    id: '3',
    title: 'Pagamenti pagoPA',
    description: 'Pagamenti pagoPA description',
    authorized: true,
    status: 'ACTIVE',
    urlBO: 'http://pagopa/bo',
    activationDateTime: date,
    urlPublic: 'http://pagopa/public',
    roles: [
      {
        partyRole: undefined,
        roleKey: 'LIMITED',
      },
    ],
    selfcareRole: undefined,
    subProducts: [{ id: 'subProductId', title: 'Premium', status: 'ACTIVE' }],
    imageUrl:
      'https://selcdcheckoutsa.z6.web.core.windows.net/resources/products/default/depict-image.jpeg',
  });
});
