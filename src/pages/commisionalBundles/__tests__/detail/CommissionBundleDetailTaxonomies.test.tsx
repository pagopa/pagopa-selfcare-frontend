import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import CommissionBundleDetailTaxonomies from '../../detail/CommissionBundleDetailTaxonomies';
import { mockedCommissionBundlePspDetailGlobal } from '../../../../services/__mocks__/bundleService';
import { store } from '../../../../redux/store';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionBundleDetailTaxonomies />', () => {
  test('render component CommissionBundleDetailTaxonomies with taxonomies', async () => {
    render(
      <Provider store={store}>
        <CommissionBundleDetailTaxonomies bundleDetail={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('alert-test')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('taxonomy-column').length).toBe(3);
    });

    const drawerButton = screen.getByTestId('show-more-bundle-taxonomies-test');
    fireEvent.click(drawerButton);

    expect(screen.queryByTestId("padded-drawer")).toBeInTheDocument();
    expect(screen.queryAllByTestId('taxonomy-drawer-column').length).toBe(mockedCommissionBundlePspDetailGlobal?.transferCategoryList?.length);

    const closeDrawerButton = screen.getByTestId("close-drawer-button");
    fireEvent.click(closeDrawerButton)

    await waitFor(() => {
      expect(screen.queryByTestId("padded-drawer")).not.toBeInTheDocument();
    })
  });

  test('render component CommissionBundleDetailTaxonomies without taxonomies', async () => {
    const bundleDetailWithoutTaxonomies = mockedCommissionBundlePspDetailGlobal;
    bundleDetailWithoutTaxonomies.transferCategoryList = [];
    render(
      <Provider store={store}>
        <CommissionBundleDetailTaxonomies bundleDetail={bundleDetailWithoutTaxonomies} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('show-more-bundle-taxonomies-test')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('taxonomy-column').length).toBe(0);
      expect(screen.queryByTestId('alert-test')).toBeInTheDocument();
    });
  });
});
