import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useSelectedPartyProducts } from '../hooks/useSelectedPartyProducts';
import { ProductModel } from '../model/Product';
import withSelectedParty, { WithSelectedPartyProps } from './withSelectedParty';

export type WithSelectedPartyProductsProps = {
  products: Array<ProductModel>;
} & WithSelectedPartyProps;

/**
 * A decorator making use of {@link ./withLogin} to obtain the current Party and then fetching the party's products.
 * Finally it will serve the prop "products" to the wrapped component
 */
export default function withSelectedPartyProducts<T extends WithSelectedPartyProductsProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<Omit<T, 'products' | 'reload'>, 'party' | 'reload'>> {
  return withSelectedParty(
    withRetrievedValue('products', useSelectedPartyProducts, WrappedComponent)
  );
}
