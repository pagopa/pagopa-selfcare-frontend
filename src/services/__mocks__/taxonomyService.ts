import {Taxonomies} from '../../api/generated/portal/Taxonomies';
import {TaxonomyGroups} from '../../api/generated/portal/TaxonomyGroups';


export const mockedTaxonomy: Taxonomies = {
    taxonomies: [
        {
            ci_type: 'test1',
            ci_type_code: 'test1',
            end_date: '',
            legal_reason_collection: '',
            macro_area_ci_progressive: '',
            macro_area_description: '',
            macro_area_name: '',
            service_type: 'test1',
            service_type_code: '01',
            service_type_description: 'test1',
            specific_built_in_data: 'specific_built_in_data1',
            start_date: '',
            taxonomy_version: '',
        },
        {
            ci_type: 'test2',
            ci_type_code: 'test2',
            end_date: '',
            legal_reason_collection: '',
            macro_area_ci_progressive: '',
            macro_area_description: '',
            macro_area_name: '',
            service_type: 'test2',
            service_type_code: '01',
            service_type_description: 'test',
            specific_built_in_data: 'specific_built_in_data2',
            start_date: '',
            taxonomy_version: '',
        },
    ],
};

export const mockedTaxonomyGroups: TaxonomyGroups = {
    taxonomyGroups: [
        {
            "ecTypeCode": "testEcCode",
            "ecType": "testEc",
            "areas": [{
                "macroAreaEcProgressive": "areaProgressive",
                "macroAreaName": "macroArea",
                "macroAreaDescription": "macroAreaDescription"
            }]
        },
        {
            "ecTypeCode": "testEcCode2",
            "ecType": "testEc2",
            "areas": [{
                "macroAreaEcProgressive": "areaProgressive2",
                "macroAreaName": "macroArea2",
                "macroAreaDescription": "macroAreaDescription2"
            }]
        },
        {
            "ecTypeCode": "testEcCode3",
            "ecType": "testEc3",
            "areas": [{
                "macroAreaEcProgressive": "areaProgressive3",
                "macroAreaName": "macroArea3",
                "macroAreaDescription": "macroAreaDescription3"
            }]
        }
    ],
};

export const getTaxonomies = (): Promise<Taxonomies> =>
    new Promise((resolve) => resolve(mockedTaxonomy));

export const getTaxonomyGroups = (): Promise<TaxonomyGroups> =>
    new Promise((resolve) => resolve(mockedTaxonomyGroups));
