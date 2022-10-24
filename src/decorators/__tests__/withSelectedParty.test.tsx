import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, RootState } from '../../redux/store';
import withSelectedParty from '../withSelectedParty';
import { verifyFetchPartyDetailsMockExecution } from '../../services/__mocks__/partyService';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { testToken } from '../../utils/constants';

jest.mock('../../services/partyService');

const expectedPartyId: string = '46ef5b6b-7ee4-4dab-b8bc-fb5e30111239';

let fetchPartyDetailsSpy: jest.SpyInstance;

beforeEach(() => {
  fetchPartyDetailsSpy = jest.spyOn(require('../../services/partyService'), 'fetchPartyDetails');

  storageTokenOps.write(testToken); // party with partyId="46ef5b6b-7ee4-4dab-b8bc-fb5e30111239"
});

const renderApp = async (
  waitSelectedParty: boolean,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const store = injectedStore ? injectedStore : createStore();

  const Component = () => <></>;
  const DecoratedComponent = withSelectedParty(Component);

  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );

  if (waitSelectedParty) {
    await waitFor(() => expect(store.getState().parties.selected).not.toBeUndefined());
  }

  return { store, history };
};

test('Test default behavior when no parties', async () => {
  const { store } = await renderApp(true);
  checkSelectedParty(store.getState());

  // test when selected party already in store
  await renderApp(true, store);
  checkMockInvocation(1);
});

test('Test party not active', async () => {
  const store = createStore();

  // party with partyId="onboarded"
  storageTokenOps.write(
    'eyJraWQiOiJqd3QtZXhjaGFuZ2VfZDQ6ZWY6NjQ6NzY6YWY6MjI6MWY6NDg6MTA6MDM6ZTQ6NjE6NmU6Y2M6Nzk6MmYiLCJhbGciOiJSUzI1NiJ9.eyJlbWFpbCI6ImRtYXJ0aW5vQGxpdmUuY29tIiwiZmFtaWx5X25hbWUiOiJMb25nbyIsImZpc2NhbF9udW1iZXIiOiJMTkdNTEU4NVAxOUM4MjZKIiwibmFtZSI6IkVtaWxpYSIsImZyb21fYWEiOmZhbHNlLCJ1aWQiOiJiOWI4OWVmOS00ZGNiLTRlMjctODE5Mi1kOTcyZWZlZjYxNGUiLCJsZXZlbCI6IkwyIiwiaWF0IjoxNjU1OTgyMjE0LCJleHAiOjE2NTU5ODIyMjksImF1ZCI6InBvcnRhbGUtcGEuY29sbC5wbi5wYWdvcGEuaXQiLCJpc3MiOiJodHRwczovL3VhdC5zZWxmY2FyZS5wYWdvcGEuaXQiLCJqdGkiOiI5NWM3M2M0OS0xNTE3LTRlODAtYWNhNy1iZjE4NDZkOTJhNTMiLCJvcmdhbml6YXRpb24iOnsiaWQiOiJvbmJvYXJkZWQiLCJyb2xlcyI6W3sicGFydHlSb2xlIjoiTUFOQUdFUiIsInJvbGUiOiJyZWZlcmVudGUtbGVnYWxlIn1dLCJmaXNjYWxfY29kZSI6IjgwMDA4NTEwNzU0In0sImRlc2lyZWRfZXhwIjoxNjU2MDE0NjA0fQ==.VjoWV-iWxqGh2VwB82fTJT04VnY5cIEePMUCQBHVAt7GziuCg12XV8EKQa0cqVa25ggF6peReHicO_WEuhrXsFdLohYT5OCe1gA_65SGJp1bxvPL-0yOvrnEje7XE57nU3YzE6ssq9KDi4wdVr4_RC1JwliiAPq411j1-osyt9vtqQU_b-cfJxQ-v99dlq-TiRPCWX37h8Y-2q4zOF0RTw6McCP8_6j-iaq0tFOi5aq-NjssEvr_eYLLtQwBsBOX3OFysmmhq5dUPDov24WaPZcpbbzCEBPiqW6J69qSxyQUmztNjRfFYD5lsWKvThbmYWh0DSUbWuk8uahITriytw'
  );

  await renderApp(false, store);

  await waitFor(() => expect(store.getState().appState.errors.length).toBe(1));
  expect(store.getState().parties.selected).toBeUndefined();
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected;
  verifyFetchPartyDetailsMockExecution(party!);
};

const checkMockInvocation = (expectedCallsNumber: number) => {
  expect(fetchPartyDetailsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyDetailsSpy).toBeCalledWith(expectedPartyId, undefined);
};
