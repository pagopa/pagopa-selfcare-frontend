import {getTaxonomies, getTaxonomyGroups} from '../taxonomyService';
import {mockedTaxonomyGroups, mockedTaxonomy} from '../__mocks__/taxonomyService';

describe('getTaxonomyGroups test', () => {
    test('Test getTaxonomyGroups', async () => {
        const taxonomyGroups = await getTaxonomyGroups();
        expect(taxonomyGroups).toMatchObject(mockedTaxonomyGroups);
    });
});

describe('getTaxonomies test', () => {
    test('Test getTaxonomies', async () => {
        const taxonomies = await getTaxonomies("", "", "", false);
        expect(taxonomies).toMatchObject(mockedTaxonomy);
    });
});
