import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import TabPanels from '../components/TabPanels';
import { screen } from '@testing-library/react';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<TabPanels />', () => {
  test('render component TabPanels', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages`]}>
          <Route path="/comm-packages">
            <ThemeProvider theme={theme}>
              <TabPanels />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );
  });
});
