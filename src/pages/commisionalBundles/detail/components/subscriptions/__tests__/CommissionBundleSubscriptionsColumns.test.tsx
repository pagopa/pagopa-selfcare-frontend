import { GridColDef, GridRenderCellParams, GridStateColDef } from '@mui/x-data-grid';
import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubscriptionStateType } from '../CommissionBundleSubscriptionsTable';
import { buildColumnDefs, getStatusChip } from '../CommissionBundleSubscriptionsColumns';
import { showCustomHeader } from '../../../../../../components/Table/TableUtils';

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
    stationCode: 'Lorem ipsum',
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

const mockTFunction = (key: string) => {
  switch (key) {
    case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.name':
      return 'Business Name';
    case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.taxCode':
      return 'Tax Code';
    case 'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.state':
      return 'State';
    default:
      return '';
  }
};

describe('<CommissionBundleSubscriptionsColumns />', () => {
  test('Test of all the functions inside the component', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'name',
        cellClassName: 'justifyContentBold',
        headerName: mockTFunction(
          'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.name'
        ),
        align: 'left',
        headerAlign: 'left',
        minWidth: 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: showCustomHeader,
        renderCell: expect.any(Function),
        sortable: true,
        flex: 4,
      },
      {
        field: 'taxCode',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction(
          'commissionBundlesPage.commissionBundleDetail.subscriptionsTable.taxCode'
        ),
        align: 'left',
        headerAlign: 'left',
        minWidth: 300,
        editable: false,
        disableColumnMenu: true,
        renderHeader: showCustomHeader,
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'state',
        cellClassName: 'justifyContentNormal',
        headerName: mockTFunction('commissionBundlesPage.commissionBundleDetail.subscriptionsTable.state'),
        align: 'left',
        headerAlign: 'left',
        minWidth: 200,
        editable: false,
        disableColumnMenu: true,
        renderHeader: showCustomHeader,
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'actions',
        cellClassName: 'justifyContentNormalRight',
        type: 'actions',
        headerName: '',
        align: 'center',
        hideSortIcons: true,
        disableColumnMenu: true,
        editable: false,
        getActions: expect.any(Function),
        sortable: false,
        flex: 1,
      },
    ] as Array<GridColDef>;

    const realColumns = buildColumnDefs(
      mockTFunction,
      SubscriptionStateType.Waiting,
      jest.fn()
    ) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });

  test('Test status chip cell with waiting request', () => {
    render(<>{getStatusChip(mockTFunction, SubscriptionStateType.Waiting)}</>);

    expect(screen.queryByTestId('waiting-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('accepted-state-chip')).not.toBeInTheDocument();
  });

  test('Test status chip cell with accepted request', () => {
    render(<>{getStatusChip(mockTFunction, SubscriptionStateType.Accepted)}</>);

    expect(screen.queryByTestId('waiting-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('accepted-state-chip')).toBeInTheDocument();
  });
});
