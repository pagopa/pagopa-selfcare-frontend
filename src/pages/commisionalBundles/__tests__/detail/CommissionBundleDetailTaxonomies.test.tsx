import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import CommissionBundleDetailTaxonomies from '../../detail/CommissionBundleDetailTaxonomies';
import { mockedCommissionBundlePspDetailGlobal } from '../../../../services/__mocks__/bundleService';
import { store } from '../../../../redux/store';
import { Taxonomy } from '../../../../api/generated/portal/Taxonomy';
import * as TaxonomyService from '../../../../services/taxonomyService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mock = jest.spyOn(TaxonomyService, 'getTaxonomies');

describe('<CommissionBundleDetailTaxonomies />', () => {
  test('render component CommissionBundleDetailTaxonomies with taxonomies match', async () => {
    const taxonomyList: Array<Taxonomy> =
      mockedCommissionBundlePspDetailGlobal?.transferCategoryList?.map((el) => ({
        ci_type: 'test',
        ci_type_code: 'test',
        end_date: '',
        legal_reason_collection: '',
        macro_area_ci_progressive: '',
        macro_area_description: '',
        service_type_code: '01',
        service_type_description: 'test',
        start_date: '',
        taxonomy_version: '',
        specific_built_in_data: el,
        macro_area_name: 'macroArea',
        service_type: 'service-type',
      })) ?? [];

    mock.mockReturnValueOnce(new Promise((resolve) => resolve({ taxonomies: taxonomyList })));

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
    expect(screen.queryAllByTestId('taxonomy-drawer-column').length).toBe(taxonomyList.length);

    const closeDrawerButton = screen.getByTestId("close-drawer-button");
    fireEvent.click(closeDrawerButton)

    await waitFor(() => {
      expect(screen.queryByTestId("padded-drawer")).not.toBeInTheDocument();
    })

    mock.mockReset();
  });

  test('render component CommissionBundleDetailTaxonomies without taxonomies match', async () => {
    mock.mockReturnValueOnce(new Promise((resolve) => resolve({ taxonomies: [] })));
    render(
      <Provider store={store}>
        <CommissionBundleDetailTaxonomies bundleDetail={mockedCommissionBundlePspDetailGlobal} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('show-more-bundle-taxonomies-test')).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('taxonomy-column').length).toBe(0);
      expect(screen.queryByTestId('alert-test')).toBeInTheDocument();
    });

    mock.mockReset();
  });
});
