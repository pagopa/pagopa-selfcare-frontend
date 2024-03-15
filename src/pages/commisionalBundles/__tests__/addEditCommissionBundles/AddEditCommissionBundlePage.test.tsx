import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditCommissionBundlePage from '../../addEditCommissionBundle/AddEditCommissionBundlePage';
import { FormAction } from '../../../../model/CommissionBundle';
import { useAppDispatch } from '../../../../redux/hooks';
import { bundleDetailsActions } from '../../../../redux/slices/bundleDetailsSlice';
import {
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../../services/__mocks__/bundleService';
import { BundleResource } from '../../../../api/generated/portal/BundleResource';

let spyOnUpdateBundle: jest.SpyInstance<any, unknown[]>;

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: function (buffer) {
      const nodeCrypto = require('crypto');
      return nodeCrypto.randomFillSync(buffer);
    }
  },
});

beforeEach(() => {
  spyOnUpdateBundle = jest.spyOn(require('../../../../services/bundleService'), 'updatePSPBundle');
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const RenderComponent = ({
  initialEntries,
  path,
  bundle,
}: {
  initialEntries: string;
  path: string;
  bundle: BundleResource;
}) => {
  const dispatcher = useAppDispatch();
  dispatcher(bundleDetailsActions.setBundleDetailsState(bundle));
  return (
    <MemoryRouter initialEntries={[initialEntries]}>
      <Route path={path}>
        <ThemeProvider theme={theme}>
          <AddEditCommissionBundlePage />
        </ThemeProvider>
      </Route>
    </MemoryRouter>
  );
};

describe('<AddEditCommissionBundlePage />', () => {
  test('render component AddEditCommissionBundlePage with view on create for GLOBAL bundles', async () => {
    const initialEntries = `/comm-bundles/add-bundle/`;
    render(
      <Provider store={store}>
        <RenderComponent
          initialEntries={initialEntries}
          path={initialEntries}
          bundle={mockedCommissionBundlePspDetailGlobal}
        />
      </Provider>
    );

    expect(screen.getByTestId('bundle-form-div')).toBeInTheDocument();
    expect(screen.queryByTestId('step-config')).toBeInTheDocument();
    expect(screen.queryByTestId('bundle-taxonomies-div')).toBeInTheDocument();
    expect(screen.queryByTestId('step-taxonomies')).toBeInTheDocument();
  });

  test('render component AddEditCommissionBundlePage with view on edit for GLOBAL bundles', async () => {
    const name = 'someNameId';
    const initialEntries = `/comm-bundles/${name}/${FormAction.Edit}`;
    const path = '/comm-bundles/:bundleId/:actionId';
    spyOnUpdateBundle.mockReturnValueOnce(new Promise<void>((resolve) => resolve()));
    render(
      <Provider store={store}>
        <RenderComponent
          initialEntries={initialEntries}
          path={path}
          bundle={mockedCommissionBundlePspDetailGlobal}
        />
      </Provider>
    );

    let bundleFormDiv = screen.getByTestId('bundle-form-div');
    let stepConfig = screen.queryByTestId('step-config');
    expect(bundleFormDiv).toBeInTheDocument();
    expect(stepConfig).toBeInTheDocument();

    let bundleTaxonomiesDiv;
    let stepTaxonomies;
    await waitFor(() => {
      bundleTaxonomiesDiv = screen.queryByTestId('bundle-taxonomies-div');
      expect(bundleTaxonomiesDiv).toBeInTheDocument();
      stepTaxonomies = screen.queryByTestId('step-taxonomies');
      expect(stepTaxonomies).toBeInTheDocument();
    });

    expect(bundleFormDiv).toBeVisible();
    expect(bundleTaxonomiesDiv).not.toBeVisible();

    const confirmButton = screen.getByTestId('open-modal-button-test');
    fireEvent.click(confirmButton);

    expect(bundleFormDiv).not.toBeVisible();
    expect(bundleTaxonomiesDiv).toBeVisible();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const confirmButtonModal = screen.getByTestId('confirm-button-test');
    fireEvent.click(confirmButtonModal);

    await waitFor(() => {
      expect(spyOnUpdateBundle).toBeCalled();
    });
  });

  test('render component AddEditCommissionBundlePage with view on edit for PRIVATE bundles', async () => {
    const name = 'someNameId';
    const initialEntries = `/comm-bundles/${name}/${FormAction.Edit}`;
    const path = '/comm-bundles/:bundleId/:actionId';
    render(
      <Provider store={store}>
        <RenderComponent
          initialEntries={initialEntries}
          path={path}
          bundle={mockedCommissionBundlePspDetailPrivate}
        />
      </Provider>
    );

    let bundleFormDiv = screen.getByTestId('bundle-form-div');
    let stepConfig = screen.queryByTestId('step-config');
    expect(bundleFormDiv).toBeInTheDocument();
    expect(stepConfig).toBeInTheDocument();

    let bundleTaxonomiesDiv;
    let stepTaxonomies;
    await waitFor(() => {
      bundleTaxonomiesDiv = screen.queryByTestId('bundle-taxonomies-div');
      expect(bundleTaxonomiesDiv).toBeInTheDocument();
      stepTaxonomies = screen.queryByTestId('step-taxonomies');
      expect(stepTaxonomies).toBeInTheDocument();
    });

    expect(bundleFormDiv).toBeVisible();
    expect(bundleTaxonomiesDiv).not.toBeVisible();

    const confirmButton = screen.getByTestId('open-modal-button-test');
    fireEvent.click(confirmButton);

    expect(bundleFormDiv).not.toBeVisible();
    expect(bundleTaxonomiesDiv).toBeVisible();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('cancel-button-test');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).not.toBeInTheDocument();
    });

    const backButton = screen.getByTestId('back-step-button-test');
    fireEvent.click(backButton);

    expect(bundleFormDiv).toBeVisible();
    expect(bundleTaxonomiesDiv).not.toBeVisible();
  });

  test('render component AddEditCommissionBundlePage with view on edit for PUBLIC bundles', async () => {
    const name = 'someNameId';
    const initialEntries = `/comm-bundles/${name}/${FormAction.Edit}`;
    const path = '/comm-bundles/:bundleId/:actionId';
    render(
      <Provider store={store}>
        <RenderComponent
          initialEntries={initialEntries}
          path={path}
          bundle={mockedCommissionBundlePspDetailPublic}
        />
      </Provider>
    );

    let bundleFormDiv = screen.getByTestId('bundle-form-div');
    let stepConfig = screen.queryByTestId('step-config');
    expect(bundleFormDiv).toBeInTheDocument();
    expect(stepConfig).toBeInTheDocument();

    let bundleTaxonomiesDiv;
    let stepTaxonomies;
    await waitFor(() => {
      bundleTaxonomiesDiv = screen.queryByTestId('bundle-taxonomies-div');
      expect(bundleTaxonomiesDiv).toBeInTheDocument();
      stepTaxonomies = screen.queryByTestId('step-taxonomies');
      expect(stepTaxonomies).toBeInTheDocument();
    });

    expect(bundleFormDiv).toBeVisible();
    expect(bundleTaxonomiesDiv).not.toBeVisible();

    const confirmButton = screen.getByTestId('open-modal-button-test');
    fireEvent.click(confirmButton);

    expect(bundleFormDiv).not.toBeVisible();
    expect(bundleTaxonomiesDiv).toBeVisible();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('cancel-button-test');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fade-test')).not.toBeInTheDocument();
    });

    const backButton = screen.getByTestId('back-step-button-test');
    fireEvent.click(backButton);

    expect(bundleFormDiv).toBeVisible();
    expect(bundleTaxonomiesDiv).not.toBeVisible();
  });
});
