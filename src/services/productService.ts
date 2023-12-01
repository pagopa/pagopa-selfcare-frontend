import { BackofficeApi } from '../api/BackofficeClient';
import { ProductModel, productResource2Product } from '../model/Product';
import {ENV} from "../utils/env";
import { mockedPartyProducts } from './__mocks__/productService';

export const fetchProducts = (partyId: string): Promise<Array<ProductModel>> => {
  /* istanbul ignore if */
  if (ENV.MOCK.BACKOFFICE) {
    return new Promise((resolve) => resolve(mockedPartyProducts));
  } else {


    return BackofficeApi.getProducts(partyId).then((productResources) =>productResources ? productResources.map(productResource2Product) : []
    );
  }
};
