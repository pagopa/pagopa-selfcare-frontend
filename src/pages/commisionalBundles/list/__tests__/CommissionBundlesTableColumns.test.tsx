import { GridColDef, GridRenderCellParams, GridStateColDef } from '@mui/x-data-grid';
import { cleanup, render, screen } from '@testing-library/react';
import {
  GridLinkActionBundleDetails,
  SelectStatusFilter,
  buildColumnDefs,
  getStateChip,
} from '../CommissionBundlesTableColumns';
import { createMemoryHistory } from 'history';
import React from 'react';
import {
  mockedCommissionBundleCiDetailGlobal,
  mockedCommissionBundleCiDetailPrivate,
  mockedCommissionBundleCiDetailPublic,
  mockedCommissionBundlePspDetailGlobal,
  mockedCommissionBundlePspDetailPrivate,
} from '../../../../services/__mocks__/bundleService';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import add from 'date-fns/add';
import { showCustomHeader } from '../../../../components/Table/TableUtils';
import { BundleResource, SubscriptionStateType } from '../../../../model/CommissionBundle';
import { CiBundleStatusEnum } from '../../../../api/generated/portal/CIBundleResource';

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

const AllCells = ({ isPsp, isEc }: { isPsp: boolean; isEc: boolean }) => {
  const { t } = useTranslation('translation');

  return <GridLinkActionBundleDetails bundle={mockedCommissionBundlePspDetailGlobal} />;
};

const BundleStateChip = ({
  bundle,
  isPsp,
  isEc,
}: {
  bundle: BundleResource;
  isPsp: boolean;
  isEc: boolean;
}) => {
  const { t } = useTranslation('translation');

  return <>{getStateChip({ ...params, row: bundle }, t, isPsp, isEc)}</>;
};

const mockTFunction = (key: string) => {
  switch (key) {
    case 'commissionBundlesPage.list.headerFields.bundleName':
      return 'Bundle Name';
    case 'commissionBundlesPage.list.headerFields.startDate':
      return 'Activation Date';
    case 'commissionBundlesPage.list.headerFields.endDate':
      return 'Due Date';
    case 'commissionBundlesPage.list.headerFields.touchpoint':
      return 'Touch Point';
    case 'commissionBundlesPage.list.headerFields.paymentType':
      return 'Payment Type';
    case 'commissionBundlesPage.list.headerFields.amountRange':
      return 'Amount Range';
    default:
      return '';
  }
};

describe('<CommissionBundlesTableColumns /> for PSPs', () => {
  const history = createMemoryHistory();
  test('Test of all the functions inside the component', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <AllCells isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    const ArrayBuildColumnDefs = [
      {
        field: 'name',
        cellClassName: 'justifyContentBold',
        headerName: 'Bundle Name',
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
        field: 'validityDateFrom',
        cellClassName: 'justifyContentNormal',
        headerName: 'Activation Date',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 150,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'validityDateTo',
        cellClassName: 'justifyContentNormal',
        headerName: 'Due Date',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 150,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'touchpoint',
        cellClassName: 'justifyContentNormal',
        headerName: 'Touch Point',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 220,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'paymentType',
        cellClassName: 'justifyContentNormal',
        headerName: 'Payment Type',
        align: 'left',
        headerAlign: 'left',
        width: 145,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'state',
        cellClassName: 'justifyContentNormal',
        headerName: '',
        align: 'left',
        headerAlign: 'left',
        width: 200,
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

    const realColumns = buildColumnDefs(mockTFunction, true, false) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });

  test('Test state chip cell with active bundle', () => {
    let bundle = { ...mockedCommissionBundlePspDetailGlobal };
    bundle.validityDateFrom = new Date('01/01/2020');
    bundle.validityDateTo = add(new Date(), { days: 8 });
    render(
      <Provider store={store}>
        <Router history={history}>
          <BundleStateChip bundle={bundle} isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('success-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
  });

  test('Test state chip cell with in activation bundle', () => {
    let bundle = { ...mockedCommissionBundlePspDetailGlobal };
    bundle.validityDateFrom = add(new Date(), { days: 3 });
    bundle.validityDateTo = add(new Date(), { days: 15 });
    render(
      <Provider store={store}>
        <Router history={history}>
          <BundleStateChip bundle={bundle} isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).toBeInTheDocument();
  });

  test('Test state chip cell with expiring bundle', () => {
    let bundle = { ...mockedCommissionBundlePspDetailGlobal };
    bundle.validityDateFrom = new Date('01/01/2020');
    bundle.validityDateTo = add(new Date(), { days: 7 });
    render(
      <Provider store={store}>
        <Router history={history}>
          <BundleStateChip bundle={bundle} isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
  });

  test('Test state chip cell with expired bundle', () => {
    let bundle = { ...mockedCommissionBundlePspDetailGlobal };
    bundle.validityDateFrom = new Date('01/01/2020');
    bundle.validityDateTo = new Date();
    render(
      <Provider store={store}>
        <Router history={history}>
          <BundleStateChip bundle={bundle} isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state-chip')).toBeInTheDocument();
    expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
  });

  test('Test state chip cell bundle with no dates', () => {
    let bundle = { ...mockedCommissionBundlePspDetailGlobal };
    bundle.validityDateFrom = undefined;
    bundle.validityDateTo = undefined;
    render(
      <Provider store={store}>
        <Router history={history}>
          <BundleStateChip bundle={bundle} isPsp={true} isEc={false} />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
  });
});

describe('<CommissionBundlesTableColumns /> for ECs', () => {
  const history = createMemoryHistory();
  test('Test of all the functions inside the component', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <AllCells isPsp={false} isEc={true} />
        </Router>
      </Provider>
    );

    const ArrayBuildColumnDefs = [
      {
        field: 'name',
        cellClassName: 'justifyContentBold',
        headerName: 'Bundle Name',
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
        field: 'touchpoint',
        cellClassName: 'justifyContentNormal',
        headerName: 'Touch Point',
        align: 'left',
        headerAlign: 'left',
        maxWidth: 220,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'paymentType',
        cellClassName: 'justifyContentNormal',
        headerName: 'Payment Type',
        align: 'left',
        headerAlign: 'left',
        width: 145,
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'state',
        cellClassName: 'justifyContentNormal',
        headerName: '',
        align: 'left',
        headerAlign: 'left',
        width: 200,
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

    const realColumns = buildColumnDefs(mockTFunction, false, true) as Array<any>;
    expect(realColumns).toEqual(ArrayBuildColumnDefs);
  });

  describe('GLOBAL bundles', () => {
    test('Test state chip cell with active bundle for GLOBAL', () => {
      let bundle = { ...mockedCommissionBundleCiDetailGlobal };
      bundle.validityDateFrom = new Date('01/01/2020');
      bundle.validityDateTo = add(new Date(), { days: 8 });

      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });

    test('Test state chip cell with to be activated bundle for GLOBAL', () => {
      let bundle = { ...mockedCommissionBundleCiDetailGlobal };
      bundle.validityDateFrom = add(new Date(), { days: 8 });
      bundle.validityDateTo = add(new Date(), { days: 8 });

      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('warning-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).toBeInTheDocument();
    });
  });

  describe('PUBLIC bundles', () => {
    test('Bundle AVAILABLE', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPublic };
      bundle.ciBundleStatus = CiBundleStatusEnum.AVAILABLE;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).toBeInTheDocument();
    });
    test('Bundle ON_REMOVAL', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPublic };
      bundle.ciBundleStatus = CiBundleStatusEnum.ON_REMOVAL;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });
    test('Bundle REQUESTED', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPublic };
      bundle.ciBundleStatus = CiBundleStatusEnum.REQUESTED;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });
    test('Bundle ENABLED', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPublic };
      bundle.ciBundleStatus = CiBundleStatusEnum.ENABLED;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });
  });

  describe('PRIVATE bundles', () => {
    test('Bundle AVAILABLE', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPrivate };
      bundle.ciBundleStatus = CiBundleStatusEnum.AVAILABLE;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).toBeInTheDocument();
    });
    test('Bundle ON_REMOVAL', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPrivate };
      bundle.ciBundleStatus = CiBundleStatusEnum.ON_REMOVAL;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });
    test('Bundle ENABLED', () => {
      let bundle = { ...mockedCommissionBundleCiDetailPrivate };
      bundle.ciBundleStatus = CiBundleStatusEnum.ENABLED;
      render(
        <Provider store={store}>
          <Router history={history}>
            <BundleStateChip bundle={bundle} isPsp={false} isEc={true} />
          </Router>
        </Provider>
      );

      expect(screen.queryByTestId('success-state-chip')).toBeInTheDocument();
      expect(screen.queryByTestId('error-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('primary-state-chip')).not.toBeInTheDocument();
      expect(screen.queryByTestId('default-state-chip')).not.toBeInTheDocument();
    });
    test("Bundle state filter", () => {
        render(
            <Provider store={store}>
              <Router history={history}>
                <SelectStatusFilter bundleStatus={SubscriptionStateType.Accepted} setBundleStatus={jest.fn()} />
              </Router>
            </Provider>
          );
    })
  });
});
