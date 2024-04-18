import { cleanup, render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { store } from '../../../../../../redux/store';
import BundleTaxonomiesDrawer from '../BundleTaxonomiesDrawer';
import { Provider } from 'react-redux';
import {
  mockedTaxonomy,
  mockedTaxonomyGroups,
} from '../../../../../../services/__mocks__/taxonomyService';

const spyOnGetTaxonomiesGroup = jest.spyOn(
  require('../../../../../../services/taxonomyService.ts'),
  'getTaxonomyGroups'
);
const spyOnGetTaxonomiesListByGroup = jest.spyOn(
  require('../../../../../../services/taxonomyService.ts'),
  'getTaxonomies'
);
const spyOnAddAction = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<BundleTaxonomiesDrawer />', () => {
  test('render component BundleTaxonomiesDrawer', async () => {
    spyOnGetTaxonomiesGroup.mockReturnValue(
      new Promise((resolve) => resolve(mockedTaxonomyGroups))
    );
    spyOnGetTaxonomiesListByGroup.mockReturnValue(
      new Promise((resolve) => resolve(mockedTaxonomy))
    );
    render(
      <Provider store={store}>
        <BundleTaxonomiesDrawer
          openDrawer={true}
          setOpenDrawer={() => jest.fn()}
          addAction={spyOnAddAction}
        />
      </Provider>
    );

    await goToLastStep();

    const acceptButton = screen.getByTestId("taxonomies-add-button-test");
    expect(acceptButton).toBeDisabled();
    const checkboxTaxonomy = screen.queryAllByTestId("checkbox-taxonomy");

    fireEvent.click(checkboxTaxonomy[0]);

    await waitFor(() => {
      expect(acceptButton).not.toBeDisabled();
    });

    fireEvent.click(acceptButton);
    expect(spyOnAddAction).toBeCalled();

    //TEST goBack
    await goToLastStep();

    let goBackButton = screen.getByTestId("back-drawer-button");
    fireEvent.click(goBackButton);

    await waitFor(() => {
      expect(screen.queryByTestId("title-step0")).not.toBeInTheDocument();
      expect(screen.queryByTestId("title-step1")).toBeInTheDocument();
      expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();
    });

    fireEvent.click(goBackButton);

    await waitFor(() => {
      expect(screen.queryByTestId("title-step0")).toBeInTheDocument();
      expect(screen.queryByTestId("title-step1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();
    });

    expect(goBackButton).not.toBeInTheDocument();

    //TEST Filter
    const filterTextfield = screen.getByTestId("catalogue-filter") as HTMLInputElement;
    fireEvent.change(filterTextfield, { target: { value: "filterText" } });

    await waitFor(() => {
      expect(screen.queryByTestId("title-step0")).not.toBeInTheDocument();
      expect(screen.queryByTestId("title-step1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("title-step2")).toBeInTheDocument();
    });
    
    goBackButton = screen.getByTestId("back-drawer-button");
    expect(goBackButton).toBeInTheDocument();

    fireEvent.click(goBackButton);

    await waitFor(() => {
      expect(screen.queryByTestId("title-step0")).toBeInTheDocument();
      expect(screen.queryByTestId("title-step1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();
    });
  });
});

async function goToLastStep() {
  let taxonomyGroupButtons;
  await waitFor(() => {
    expect(spyOnGetTaxonomiesGroup).toBeCalled();
    taxonomyGroupButtons = screen.queryAllByTestId('taxonomy-group-button');
    expect(taxonomyGroupButtons.length).toBeTruthy();
  });

  expect(screen.queryByTestId("title-step0")).toBeInTheDocument();
  expect(screen.queryByTestId("title-step1")).not.toBeInTheDocument();
  expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();

  fireEvent.click(taxonomyGroupButtons[0]);

  await waitFor(() => {
    expect(screen.queryByTestId("title-step0")).not.toBeInTheDocument();
    expect(screen.queryByTestId("title-step1")).toBeInTheDocument();
    expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();
  });

  await waitFor(() => {
    taxonomyGroupButtons = screen.queryAllByTestId('taxonomy-group-button');
    expect(taxonomyGroupButtons.length).toBeTruthy();
  });

  fireEvent.click(taxonomyGroupButtons[0]);

  await waitFor(() => {
    expect(screen.queryByTestId("title-step0")).not.toBeInTheDocument();
    expect(screen.queryByTestId("title-step1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("title-step2")).toBeInTheDocument();
    expect(spyOnGetTaxonomiesListByGroup).toBeCalled();
  });
}

