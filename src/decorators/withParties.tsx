import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useParties } from '../hooks/useParties';
import { Party } from '../model/Party';

export type WithPartiesProps = {
  parties: Array<Party>;
};

/** A decorator to fetch and provide as input to the wrapped component the list of available Parties */
export default function withParties<T extends WithPartiesProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'parties' | 'reload'>> {
  return withRetrievedValue('parties', useParties, WrappedComponent);
}
