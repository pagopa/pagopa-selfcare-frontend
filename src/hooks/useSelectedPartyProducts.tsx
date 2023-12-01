import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { ProductModel } from '../model/Product';
import { useAppSelector } from '../redux/hooks';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { fetchProducts } from '../services/productService';

/** A custom hook to fetch current party's products and caching them into redux */
export const useSelectedPartyProducts = (): (() => Promise<Array<ProductModel>>) => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  if (!selectedParty) {
    throw new Error('No party selected!');
  }

  return useReduxCachedValue(
    'PARTIES',
    () => fetchProducts(selectedParty?.partyId),
    partiesSelectors.selectPartySelectedProducts,
    partiesActions.setPartySelectedProducts
  );
};
