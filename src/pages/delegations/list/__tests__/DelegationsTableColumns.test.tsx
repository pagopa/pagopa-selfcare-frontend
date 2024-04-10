import { GridColDef } from '@mui/x-data-grid';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { mockedCIDelegations } from '../../../../services/__mocks__/brokerService';
import { GridLinkActionDelegationDetails, buildColumnDefs } from '../DelegationsTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
  switch (key) {
    case 'delegationsPage.column.companyName':
      return 'Company Name';
    case 'delegationsPage.column.taxCode':
      return 'Tax code';
    case 'delegationsPage.column.cbill':
      return 'CBILL';
    case 'delegationsPage.column.stations':
      return 'Stations';
    default:
      return '';
  }
};

describe('<DelegationsTableColumns /> for PSPs', () => {
  const history = createMemoryHistory();
  test('Test of all the functions inside the component', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <GridLinkActionDelegationDetails delegation={mockedCIDelegations[0]} t={jest.fn()} />
        </Router>
      </Provider>
    );

    const ArrayBuildColumnDefs = [
      {
        field: 'companyName',
        cellClassName: 'justifyContentBold',
        headerName: mockTFunction('delegationsPage.column.companyName'),
        align: 'left',
        headerAlign: 'left',
        minWidth: 400,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'taxCode',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationsPage.column.taxCode'),
        align: 'left',
        headerAlign: 'left',
        maxWidth: 250,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'cbill',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationsPage.column.cbill'),
        align: 'left',
        headerAlign: 'left',
        width: 150,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'stations',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('delegationsPage.column.stations'),
        align: 'left',
        headerAlign: 'left',
        width: 100,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'actions',
        cellClassName: 'justifyContentNormalRight',
        headerName: '',
        align: 'center',
        disableColumnMenu: true,
        editable: false,
        flex: 1,
        getActions: expect.any(Function),
        hideSortIcons: true,
        sortable: false,
        type: 'actions',
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(mockTFunction) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });

  test('Test click on go to delegation detail', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <GridLinkActionDelegationDetails delegation={mockedCIDelegations[0]} t={jest.fn()} />
        </Router>
      </Provider>
    );

    const goToDelegationDetailButton = screen.getByTestId(
      'column-go-to-delegation-detail'
    ) as HTMLInputElement;
    await waitFor(() => {
      expect(goToDelegationDetailButton).toBeInTheDocument();
    });
    fireEvent.click(goToDelegationDetailButton);
  });

  test('Test with CI not registered on Nodo', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <GridLinkActionDelegationDetails delegation={mockedCIDelegations[2]} t={jest.fn()} />
        </Router>
      </Provider>
    );

    const goToDelegationDetailButton = screen.queryByTestId(
      'column-go-to-delegation-detail'
    );
    await waitFor(() => {
      expect(goToDelegationDetailButton).not.toBeInTheDocument();
    });
  });
});
