import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import CommissionBundleDetailConfiguration from '../CommissionBundleDetailConfiguration';
import {
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
  mockedCommissionBundlePspDetailPublic,
} from '../../../../../services/__mocks__/bundleService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<CommissionBundleDetailConfiguration />', () => {
  test('render component CommissionBundleDetailConfiguration bundle type GLOBAl', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailGlobal} />
    );

    let buttonDrawer;
    await waitFor(async () => {
      buttonDrawer = screen.queryByTestId('show-more-bundle-configuration-test');
      expect(buttonDrawer).toBeDefined();
      expect(screen.queryAllByTestId('detail-column').length).toBe(3);
    });

    //Open Drawer
    fireEvent.click(buttonDrawer);
    expect(screen.queryByTestId('padded-drawer')).toBeInTheDocument();
    expect(screen.queryAllByTestId('detail-column').length).toBe(18);

    const closeDrawerButton = screen.getByTestId('close-drawer-button');
    fireEvent.click(closeDrawerButton);

    await waitFor(() => {
      expect(screen.queryByTestId('padded-drawer')).not.toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailConfiguration bundle type PRIVATE', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailPrivate} />
    );

    let buttonDrawer;
    await waitFor(async () => {
      buttonDrawer = screen.queryByTestId('show-more-bundle-configuration-test');
      expect(buttonDrawer).toBeDefined();
      expect(screen.queryAllByTestId('detail-column').length).toBe(3);
    });

    //Open Drawer
    fireEvent.click(buttonDrawer);
    expect(screen.queryByTestId('padded-drawer')).toBeInTheDocument();
    expect(screen.queryAllByTestId('detail-column').length).toBe(18);

    const closeDrawerButton = screen.getByTestId('close-drawer-button');
    fireEvent.click(closeDrawerButton);

    await waitFor(() => {
      expect(screen.queryByTestId('padded-drawer')).not.toBeInTheDocument();
    });
  });

  test('render component CommissionBundleDetailConfiguration bundle type PUBLIC', async () => {
    render(
      <CommissionBundleDetailConfiguration bundleDetail={mockedCommissionBundlePspDetailPublic} />
    );

    let buttonDrawer;
    await waitFor(async () => {
      buttonDrawer = screen.queryByTestId('show-more-bundle-configuration-test');
      expect(buttonDrawer).toBeDefined();
      expect(screen.queryAllByTestId('detail-column').length).toBe(3);
    });

    //Open Drawer
    fireEvent.click(buttonDrawer);
    expect(screen.queryByTestId('padded-drawer')).toBeInTheDocument();
    expect(screen.queryAllByTestId('detail-column').length).toBe(18);
  });
});
