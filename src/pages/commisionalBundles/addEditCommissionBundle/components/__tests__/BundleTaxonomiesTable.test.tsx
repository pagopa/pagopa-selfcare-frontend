import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {store} from '../../../../../redux/store';
import BundleTaxonomiesTable from '../BundleTaxonomiesTable';
import {Provider} from 'react-redux';
import {mockedPSPTaxonomyList} from '../../../../../services/__mocks__/bundleService';
import {PSPBundleTaxonomy} from '../../../../../api/generated/portal/PSPBundleTaxonomy';

const spyOnActionDeleteTaxonomy = jest.fn();
const spyOnActionDeleteArea = jest.fn();

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const reduceTaxonomies = (taxonomies: Array<PSPBundleTaxonomy>) =>
    taxonomies.reduce((result: any, taxonomy: any) => {
        const macro_area_name = taxonomy.macro_area_name;
        const newResult: any = {
            ...result,
            ...{[macro_area_name]: result[macro_area_name] ? result[macro_area_name] : []},
        };
        newResult[macro_area_name].push(taxonomy);
        return newResult;
    }, {});

describe('<BundleTaxonomiesTable />', () => {
    test('render component BundleTaxonomiesTable', () => {
        const taxonomyTableData = reduceTaxonomies(mockedPSPTaxonomyList);

        render(
            <Provider store={store}>
                <BundleTaxonomiesTable
                    tableData={taxonomyTableData}
                    deleteTaxonomyAction={() => spyOnActionDeleteTaxonomy()}
                    deleteAreaAction={() => spyOnActionDeleteArea()}
                />
            </Provider>
        );

        expect(screen.queryAllByTestId('box-macroarea').length).toBe(
            Object.values(taxonomyTableData).length
        );
        expect(screen.queryAllByTestId('grid-taxonomy').length).toBe(mockedPSPTaxonomyList.length);

        const buttonDeleteTaxonomy = screen.getAllByTestId('delete-taxonomy-button')[0];
        fireEvent.click(buttonDeleteTaxonomy);
        expect(spyOnActionDeleteTaxonomy).toBeCalled();

        const buttonDeleteArea = screen.getAllByTestId('delete-all-taxonomies-by-group')[0];
        fireEvent.click(buttonDeleteArea);
        expect(spyOnActionDeleteArea).toBeCalled();
    });
});
