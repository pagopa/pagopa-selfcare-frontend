import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import CommissionBundleSubscriptionsTable from '../CommissionBundleSubscriptionsTable';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../../../redux/store';
import { mockedCommissionBundlePspDetailGlobal } from '../../../../../../services/__mocks__/bundleService';

const idBundle = 'idBundle';
describe('<CommissionBundleSubscriptionsTable />', () => {
  test('render component CommissionBundleSubscriptionsTable', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-bundles/${idBundle}/`]}>
          <Route path="/comm-bundles/:bundleId/">
            <CommissionBundleSubscriptionsTable bundleDetail={mockedCommissionBundlePspDetailGlobal} />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    // TODO TEST WITH API INTEGRATION
  });
});
