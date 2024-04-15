import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import TableSearchBar from '../TableSearchBar';

const spyOnSetSearchInput = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const filterInput = "newSearchFilter";
describe('<TableSearchBar />', () => {
  test('render component TableSearchBar', () => {
    render(
      <Provider store={store}>
           <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <TableSearchBar
                setSearchInput={spyOnSetSearchInput}
              />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const inputSearch = screen.getByTestId("search-input") as HTMLInputElement;
    expect(inputSearch.value).toBe("");

    fireEvent.change(inputSearch, { target: { value: filterInput } });
    expect(inputSearch.value).toBe(filterInput);

    const searchButton = screen.getByTestId("button-search");
    fireEvent.click(searchButton);

    expect(spyOnSetSearchInput).toBeCalledWith(filterInput);
  });

  test('render component TableSearchBar with children', () => {
    render(
      <Provider store={store}>
           <MemoryRouter initialEntries={[`/delegations-list`]}>
          <Route path="/delegations-list">
            <ThemeProvider theme={theme}>
              <TableSearchBar
                setSearchInput={spyOnSetSearchInput}
              >
                <div data-testid="children-test"></div>
              </TableSearchBar>
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("children-test")).toBeInTheDocument();
  });
});

