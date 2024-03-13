import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import BundleTaxonomiesTable from '../../addEditCommissionBundle/components/BundleTaxonomiesTable';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<BundleTaxonomiesTable />', () => {
  const history = createMemoryHistory();

  test('render component BundleTaxonomiesTable', () => {

    const taxonomyTableData = {
     "macroArea": [
        {
            ci_type: 'test',
            ci_type_code: 'test',
            end_date: '',
            legal_reason_collection: '',
            macro_area_ci_progressive: '',
            macro_area_description: '',
            service_type_code: '01',
            service_type_description: 'test',
            start_date: '',
            taxonomy_version: '',
            specific_built_in_data: 'el',
            macro_area_name: 'macroArea',
            service_type: 'service-type',
        }
     ]
    };

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <BundleTaxonomiesTable
                tableData={taxonomyTableData}
                deleteTaxonomyAction={()=>{}}
                deleteAreaAction={()=>{}}
            />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});

