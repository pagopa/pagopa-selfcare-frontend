import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowId,
  GridStateColDef,
} from '@mui/x-data-grid';
import { cleanup, render, screen } from '@testing-library/react';
import {
  GridLinkActionDelegationDetails,
  buildColumnDefs,
  renderCell,
  showName,
  showCustomHeader,
} from '../../list/DelegationsTableColumns';
import { createMemoryHistory } from 'history';
import React from 'react';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import add from 'date-fns/add';
import { mockedCIDelegations } from '../../../../services/__mocks__/brokerService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const colDefMocked: GridStateColDef<any, any, any> = {
  computedWidth: 0,
  field: 'name',
  type: '',
  hasBeenResized: undefined,
  groupPath: undefined,
  headerName: 'name',
};
const rowNode = [
  {
    id: '',
    parent: '',
    depth: 0,
    groupingKey: '',
    groupingField: '',
  },
];

const params: GridRenderCellParams<any, any, any> = {
  value: 'some value',
  row: {
    ...mockedCIDelegations[0],
  },
  api: undefined,
  id: '',
  field: '',
  rowNode: rowNode[0],
  // @ts-ignore
  colDef: colDefMocked[0],
  cellMode: 'edit',
  hasFocus: false,
  tabIndex: 0,
  getValue: () => jest.fn(),
};

const AllCells = () => {
  const customHeader: GridColumnHeaderParams = {
    field: 'name',
    colDef: colDefMocked,
  };

  return (
    <>
      {showName({
        row: { name: 'name' },
        api: undefined,
        id: '',
        field: '',
        rowNode: undefined as any,
        colDef: undefined as any,
        cellMode: 'edit',
        hasFocus: false,
        tabIndex: 0,
        getValue: function (id: GridRowId, field: string) {
          throw new Error('Function not implemented.');
        },
      })}
      <GridLinkActionDelegationDetails delegation={mockedCIDelegations[0]} />
      {showCustomHeader(customHeader)}
      {renderCell(params, params.value)}
    </>
  );
};

const mockTFunction = (key: string) => {
  switch (key) {
    case 'delegationsPage.column.companyName':
      return 'Company Name';
    case 'delegationsPage.column.taxCode':
      return 'Tax code';
    case 'delegationsPage.column.cbill':
      return 'CBILL';
    case 'delegationsPage.column.stations':
      return "Stations";
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
          <AllCells />
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
});
