import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../../redux/store';
import withParties from '../withParties';
import { verifyFetchPartiesMockExecution } from '../../services/__mocks__/partyService';

jest.mock('../../services/partyService');

const renderApp = (injectedStore?: any) => {
  const store = injectedStore ? injectedStore : createStore();
  const Component = () => <></>;
  const DecoratedComponent = withParties(Component);
  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );
  return store;
};

let fetchPartiesSpy: jest.SpyInstance;

beforeEach(() => {
  fetchPartiesSpy = jest.spyOn(require('../../services/partyService'), 'fetchParties');
});

test('Test', async () => {
  const store = renderApp();
  await waitFor(() => verifyFetchPartiesMockExecution(store.getState().parties.list));

  renderApp(store);

  await waitFor(() => verifyFetchPartiesMockExecution(store.getState().parties.list));

  expect(fetchPartiesSpy).toBeCalledTimes(1);
});
