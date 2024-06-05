import { GridColDef } from '@mui/x-data-grid';
import { cleanup} from '@testing-library/react';
import { showCustomHeader } from '../../../../../../components/Table/TableUtils';
import {  RequestStateType } from '../../../../../../model/CommissionBundle';
import { buildColumnDefs } from '../CommissionBundleDetailSubscriptionTableColumns';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
  switch (key) {
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.businessName':
      return 'Business Name';
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.taxCode':
      return 'Tax Code';
    case 'commissionBundlesPage.commissionBundleDetail.requestsTable.state':
      return 'State';
    default:
      return '';
  }
};

describe('<CommissionBundleDetailSubscriptionTableColumns />', () => {
  test('Test of all the functions inside the component', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'name',
        cellClassName: 'justifyContentBold',
        headerName: mockTFunction(
          'commissionBundlesPage.commissionBundleDetail.requestsTable.businessName'
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
          'commissionBundlesPage.commissionBundleDetail.requestsTable.taxCode'
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
        headerName: mockTFunction('commissionBundlesPage.commissionBundleDetail.requestsTable.state'),
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
      RequestStateType.Waiting,
      jest.fn(),
      ""
    ) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });
});
