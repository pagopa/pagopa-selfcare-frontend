import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../redux/store';
import { Provider } from 'react-redux';
import React from 'react';
import TableSearchBar from '../TableSearchBar';

const spyOnSetSearchTrigger = jest.fn();

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const filterInput = 'newSearchFilter';
describe('<TableSearchBar />', () => {
  test('render component TableSearchBar', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TableSearchBar handleSearchTrigger={spyOnSetSearchTrigger} />
        </ThemeProvider>
      </Provider>
    );

    const inputSearch = screen.getByTestId('search-input') as HTMLInputElement;
    expect(inputSearch.value).toBe('');

    fireEvent.change(inputSearch, { target: { value: filterInput } });
    expect(inputSearch.value).toBe(filterInput);

    const searchButton = screen.getByTestId('button-search');
    fireEvent.click(searchButton);

    expect(spyOnSetSearchTrigger).toBeCalledWith(filterInput);
  });

  test('render component TableSearchBar with children', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TableSearchBar handleSearchTrigger={spyOnSetSearchTrigger}>
            <div data-testid="children-test"></div>
          </TableSearchBar>
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('children-test')).toBeInTheDocument();
  });

  test('render component TableSearchBar with customEndButton', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TableSearchBar
            handleSearchTrigger={spyOnSetSearchTrigger}
            customEndButton={<div data-testid="custom-end-test"></div>}
          ></TableSearchBar>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('custom-end-test')).toBeInTheDocument();

    expect(screen.queryByTestId('reset-filter-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-search')).not.toBeInTheDocument();
  });

  test('render component TableSearchBar reset filters', () => {
    const resetFilters = jest.fn();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TableSearchBar handleSearchTrigger={spyOnSetSearchTrigger} resetFilters={resetFilters} />
        </ThemeProvider>
      </Provider>
    );

    const inputSearch = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(inputSearch, { target: { value: filterInput } });

    const buttonResetFilter = screen.getByTestId('reset-filter-button');

    fireEvent.click(buttonResetFilter);

    expect(inputSearch.value).toBe('');

    expect(resetFilters).toBeCalled();
  });

  test('render component TableSearchBar tab filters', async () => {
    const changeTab = jest.fn();
    const tabs = [
      {
        label: 'Tab 1',
        disabled: true,
        'data-testid': 'one',
      },
      {
        label: 'Tab 2',
      },
      {
        label: 'Tab 3',
        disabled: false,
      },
    ];
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TableSearchBar
            handleSearchTrigger={spyOnSetSearchTrigger}
            setActiveTab={changeTab}
            activeTab={1}
            listTabFilter={tabs}
          />
        </ThemeProvider>
      </Provider>
    );

    for (let i = 0; i < tabs.length; i++) {
      expect(screen.queryByTestId('tab-' + (i === 0 ? 'one' : i))).toBeInTheDocument();
    }

    fireEvent.click(screen.getByTestId('tab-one'));
  });
});
