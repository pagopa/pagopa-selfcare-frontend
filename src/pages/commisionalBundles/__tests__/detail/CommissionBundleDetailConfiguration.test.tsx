import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CommissionBundleDetailConfiguration from '../../detail/CommissionBundleDetailConfiguration';
import {
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../../services/__mocks__/bundleService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionBundleDetailConfiguration />', async () => {
  test('render component CommissionBundleDetailConfiguration bundle type GLOBAl', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailGlobal} />
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('show-more-bundle-configuration-test').length).toBe(0);
      expect(screen.queryAllByTestId('detail-column').length).toBe(12);
    });
  });

  test('render component CommissionBundleDetailConfiguration bundle type PRIVATE', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailPrivate} />
    );

    await waitFor(async () => {
      const buttonDrawer = await screen.findByTestId('show-more-bundle-configuration-test');
      expect(buttonDrawer).toBeDefined();
      expect(screen.queryAllByTestId('detail-column').length).toBe(3);

      //Open Drawer
      fireEvent.click(buttonDrawer);
      expect(screen.queryAllByTestId('detail-column').length).toBe(15);
    });
  });

  test('render component CommissionBundleDetailConfiguration bundle type PUBLIC', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailPublic} />
    );

    await waitFor(async () => {
      const buttonDrawer = await screen.findByTestId('show-more-bundle-configuration-test');
      expect(buttonDrawer).toBeDefined();
      expect(screen.queryAllByTestId('detail-column').length).toBe(3);

      //Open Drawer
      fireEvent.click(buttonDrawer);
      expect(screen.queryAllByTestId('detail-column').length).toBe(15);
    });
  });
});
