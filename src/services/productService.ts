import {BackofficeApi} from '../api/BackofficeClient';
import {ProductModel, productResource2Product} from '../model/Product';
import {mockedPartyProducts} from './__mocks__/productService';

export const fetchProducts = (partyId: string): Promise<Array<ProductModel>> => {
    /* istanbul ignore if */
    if (process.env.REACT_APP_API_MOCK_BACKOFFICE === 'true') {
        return Promise.resolve(mockedPartyProducts);
    } else {
        return BackofficeApi.institutions.getProducts(partyId).then((productResources) =>
            productResources?.product_list
                ? productResources.product_list.map(productResource2Product)
                : []
        );
    }
};
