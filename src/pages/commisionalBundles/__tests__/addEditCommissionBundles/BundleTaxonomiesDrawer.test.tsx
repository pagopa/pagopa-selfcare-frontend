import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import BundleTaxonomiesDrawer from '../../addEditCommissionBundle/components/drawer/BundleTaxonomiesDrawer';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import * as TaxonomiesService from "../../../../services/taxonomyService";
import { mockedTaxonomy, mockedTaxonomyGroups } from '../../../../services/__mocks__/taxonomyService';

beforeEach(() => {

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<BundleTaxonomiesDrawer />', () => {
  const history = createMemoryHistory();

  test('render component BundleTaxonomiesDrawer', () => {

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <BundleTaxonomiesDrawer openDrawer={true} />
          </Router>
        </ThemeProvider>
      </Provider>
    );

  });
});