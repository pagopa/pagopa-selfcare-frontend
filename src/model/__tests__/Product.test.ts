import {Product} from '../../api/generated/portal/Product';
import {productResource2Product} from '../Product';

test('Test institutionInfo2Party', () => {
    const productResource: Product = {
        description: 'Piattaforma pagoPA description',
        id: '3',
        title: 'Piattaforma pagoPA',
        url_bo: 'http://pagopa/bo',
        url_public: 'http://pagopa/public',
    };

    const product = productResource2Product(productResource);
    expect(product).toStrictEqual({
        description: 'Piattaforma pagoPA description',
        id: '3',
        title: 'Piattaforma pagoPA',
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
