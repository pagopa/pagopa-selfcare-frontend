import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import SuccessAlertLayout from '../SuccessAlertLayout';
import { store } from '../../../redux/store';

describe('<SuccessAlertLayout/>', () => {
  test('Render component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[``]}>
          <Route path="">
            <SuccessAlertLayout>
              <></>
            </SuccessAlertLayout>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
