import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import AddEditCommissionBundleTaxonomies from '../../addEditCommissionBundle/components/AddEditCommissionBundleTaxonomies';
import { useFormik } from 'formik';
import { BundleRequest } from '../../../../api/generated/portal/BundleRequest';
import { Provider } from 'react-redux';
import {
  mockedBundleRequest,
  mockedTaxonomyList,
} from '../../../../services/__mocks__/bundleService';
import { store } from '../../../../redux/store';

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: function (buffer) {
      const nodeCrypto = require('crypto');
      return nodeCrypto.randomFillSync(buffer);
    },
  },
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const Component = () => {
  const formik = useFormik<Partial<BundleRequest>>({
    initialValues: mockedBundleRequest,
    onSubmit: async () => jest.fn(),
  });
  return (
    <AddEditCommissionBundleTaxonomies bundleTaxonomies={mockedTaxonomyList} formik={formik} />
  );
};

describe('<AddEditCommissionBundleTaxonomies />', () => {
  test('render component AddEditCommissionBundleTaxonomies and delete all taxonomies by group', async () => {
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    const arrayDeleteTaxonomiesByGroupButtons = screen.queryAllByTestId(
      'delete-all-taxonomies-by-group'
    );
    expect(arrayDeleteTaxonomiesByGroupButtons.length).toBeTruthy();
    fireEvent.click(arrayDeleteTaxonomiesByGroupButtons[0]);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });
    const confirmButton = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(
        arrayDeleteTaxonomiesByGroupButtons.length - 1
      );
    });
  });
});
