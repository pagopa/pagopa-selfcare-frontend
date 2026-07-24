import {cleanup, render, waitFor, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import {store} from '../../../../../../redux/store';
import BundleTaxonomiesDrawer from '../BundleTaxonomiesDrawer';
import {Provider} from 'react-redux';
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
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
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
                    addedTaxonomies={[mockedTaxonomy.taxonomies[1].specific_built_in_data]}
                />
            </Provider>
        );

        await goToLastStep();

        const acceptButton = screen.getByTestId("taxonomies-add-button-test");
        expect(acceptButton).toBeDisabled();

        const checkboxItems = screen.queryAllByTestId("checkbox-item");
        expect(checkboxItems[0]).not.toHaveClass("Mui-disabled");
        expect(checkboxItems[1]).toHaveClass("Mui-disabled");

        //Test toggle all
        const toggleAll = screen.getByTestId("toggle-all-bundle-taxonomies-test");
        fireEvent.click(toggleAll);
        await waitFor(() => {
            expect(acceptButton).not.toBeDisabled();
        });
        fireEvent.click(toggleAll);
        await waitFor(() => {
            expect(acceptButton).toBeDisabled();
        });

        //Test single checkbox
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
        fireEvent.change(filterTextfield, {target: {value: "filterText"}});

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

    test('test getTaxonomyGroups catch error', async () => {
        spyOnGetTaxonomiesGroup.mockRejectedValueOnce("");
        render(
            <Provider store={store}>
                <BundleTaxonomiesDrawer
                    openDrawer={true}
                    setOpenDrawer={() => jest.fn()}
                    addAction={spyOnAddAction}
                    addedTaxonomies={[mockedTaxonomy.taxonomies[1].specific_built_in_data]}
                />
            </Provider>
        );

        expect(screen.queryByTestId("taxonomy-group-item")).not.toBeInTheDocument();
    });

    test('test getTaxonomies catch error', async () => {
        spyOnGetTaxonomiesGroup.mockReturnValue(
            new Promise((resolve) => resolve(mockedTaxonomyGroups))
        );
        spyOnGetTaxonomiesListByGroup.mockRejectedValueOnce("");
        render(
            <Provider store={store}>
                <BundleTaxonomiesDrawer
                    openDrawer={true}
                    setOpenDrawer={() => jest.fn()}
                    addAction={spyOnAddAction}
                    addedTaxonomies={[mockedTaxonomy.taxonomies[1].specific_built_in_data]}
                />
            </Provider>
        );

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
            expect(screen.queryByTestId("title-step2")).not.toBeInTheDocument();
            expect(spyOnGetTaxonomiesListByGroup).toBeCalled();
        });

        expect(screen.queryAllByTestId("checkbox-item").length).toBeFalsy();
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

