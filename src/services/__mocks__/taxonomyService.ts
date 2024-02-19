import { Taxonomies } from '../../api/generated/portal/Taxonomies';

export const mockedTaxonomy: Taxonomies = {
    taxonomies: [
      {
        ci_type: 'test',
        ci_type_code: 'test',
        end_date: '',
        legal_reason_collection: '',
        macro_area_ci_progressive: '',
        macro_area_description: '',
        macro_area_name: '',
        service_type: 'test',
        service_type_code: '01',
        service_type_description: 'test',
        specific_built_in_data: '',
        start_date: '',
        taxonomy_version: '',
      },
    ],
  };

export const getTaxonomies = (): Promise<Taxonomies> =>
  new Promise((resolve) => resolve(mockedTaxonomy));