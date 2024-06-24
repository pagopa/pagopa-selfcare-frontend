import {getTaxonomies, getTaxonomyGroups} from '../taxonomyService';
<<<<<<< HEAD
import {mockedTaxonomyGroups, mockedTaxonomy} from '../__mocks__/taxonomyService';
=======
import {mockedTaxonomy, mockedTaxonomyGroups} from '../__mocks__/taxonomyService';
>>>>>>> 3f32cfc3 (Formatting (#542))

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
