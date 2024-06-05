import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {useFormik} from 'formik';
import {Provider} from 'react-redux';
import {BundleRequest} from '../../../../../api/generated/portal/BundleRequest';
import {store} from '../../../../../redux/store';
import {mockedBundleRequest, mockedPSPTaxonomyList} from '../../../../../services/__mocks__/bundleService';
import AddEditCommissionBundleTaxonomies from '../AddEditCommissionBundleTaxonomies';
import {PSPBundleTaxonomy} from '../../../../../api/generated/portal/PSPBundleTaxonomy';

Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: function (buffer) {
            const nodeCrypto = require('crypto');
            return nodeCrypto.randomFillSync(buffer);
        },
    },
});

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const Component = ({taxonomyList}: { taxonomyList: Array<PSPBundleTaxonomy> }) => {
    const formik = useFormik<Partial<BundleRequest>>({
        initialValues: mockedBundleRequest,
        onSubmit: async () => jest.fn(),
    });
    return (
        <AddEditCommissionBundleTaxonomies bundleTaxonomies={taxonomyList} formik={formik}/>
    );
};

const validFile = new File([[["specific_built_in_data", "macro_area_name"], ["id", "area"], ["id2", "area2"]].map(e => e.join(",")).join("\n")], 'chucknorris.csv', {
    type: 'text/csv',
});
const partiallyInvalidFile = new File([[["specific_built_in_data", "macro_area_name"], ["id", "area"], ["", "area"]].map(e => e.join(",")).join("\n")], 'chucknorris.csv', {
    type: 'text/csv',
});
const invalidFile = new File([[["specific_built_in_data", "macro_area_name"], ["", ""]].map(e => e.join(",")).join("\n")], 'chucknorris.csv', {
    type: 'text/csv',
});

describe('<AddEditCommissionBundleTaxonomies />', () => {
  test('render component AddEditCommissionBundleTaxonomies and delete all taxonomies by group', async () => {
    render(
      <Provider store={store}>
        <Component taxonomyList={mockedPSPTaxonomyList}/>
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

  // test('render component AddEditCommissionBundleTaxonomies test upload valid csv', async () => {
  //   render(
  //     <Provider store={store}>
  //       <Component taxonomyList={[]}/>
  //     </Provider>
  //   );

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(0);

  //   const fileInput = screen.getByTestId('fileInput');
  //   expect(fileInput).toBeInTheDocument();
  //   fireEvent.change(fileInput.children!.item(0) as Element, {
  //     target: {
  //       files: {
  //         0: validFile,
  //         length: 1,
  //         item: () => validFile,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     const alert = screen.queryByTestId('alert-success');
  //     expect(alert).toBeInTheDocument();
  //   });

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(2);
  // });

  // test('render component AddEditCommissionBundleTaxonomies test upload partially invalid csv', async () => {
  //   render(
  //     <Provider store={store}>
  //       <Component taxonomyList={[]}/>
  //     </Provider>
  //   );

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(0);

  //   const fileInput = screen.getByTestId('fileInput');
  //   expect(fileInput).toBeInTheDocument();
  //   fireEvent.change(fileInput.children!.item(0) as Element, {
  //     target: {
  //       files: {
  //         0: partiallyInvalidFile,
  //         length: 1,
  //         item: () => partiallyInvalidFile,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     const alert = screen.queryByTestId('alert-warning');
  //     expect(alert).toBeInTheDocument();
  //   });

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(1);
  // });

  // test('render component AddEditCommissionBundleTaxonomies test upload invalid csv', async () => {
  //   render(
  //     <Provider store={store}>
  //       <Component taxonomyList={[]}/>
  //     </Provider>
  //   );

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(0);

  //   const fileInput = screen.getByTestId('fileInput');
  //   expect(fileInput).toBeInTheDocument();
  //   fireEvent.change(fileInput.children!.item(0) as Element, {
  //     target: {
  //       files: {
  //         0: invalidFile,
  //         length: 1,
  //         item: () => invalidFile,
  //       },
  //     },
  //   });

  //   await waitFor(() => {
  //     const alert = screen.queryByTestId('alert-error');
  //     expect(alert).toBeInTheDocument();
  //   });

  //   expect(screen.queryAllByTestId('delete-all-taxonomies-by-group').length).toBe(0);
  // });
});
