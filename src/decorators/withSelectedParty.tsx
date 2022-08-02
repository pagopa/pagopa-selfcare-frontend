import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useSelectedParty } from '../hooks/useSelectedParty';
import { Party } from '../model/Party';

export type WithSelectedPartyProps = {
  party: Party;
};

/** A decorator to read from session JWT the partyId, fetching its information, and serving it through the party prop to the decorated Component */
export default function withSelectedParty<T extends WithSelectedPartyProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'party' | 'reload'>> {
  return withRetrievedValue('party', useSelectedParty, WrappedComponent);
}
