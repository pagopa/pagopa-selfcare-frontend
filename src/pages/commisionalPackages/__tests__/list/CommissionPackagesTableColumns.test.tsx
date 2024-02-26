import {GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridStateColDef,} from '@mui/x-data-grid';
import {cleanup} from '@testing-library/react';
import {buildColumnDefs, renderCell, showAmountRange, showCustomHeader,} from '../../list/CommissionPackagesTableColumns';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<CommissionPackagesTableColumns />', () => {
    test('Test of all the functions inside the component', () => {
        const rowNode = [
            {
                id: '',
                parent: '',
                depth: 0,
                groupingKey: '',
                groupingField: '',
            },
        ];

        const colDefMocked: GridStateColDef<any, any, any> = {
            computedWidth: 0,
            field: 'name',
            type: '',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'name',
        };

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

        const ArrayBuildColumnDefs = [
            {
                field: 'name',
                cellClassName: 'justifyContentBold',
                headerName: 'Package Name',
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
                field: 'amountRange',
                cellClassName: 'justifyContentNormal',
                headerName: 'Amount Range',
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

        const mockTFunction = (key: string) => {
            switch (key) {
                case 'commissionPackagesPage.list.headerFields.packageName':
                    return 'Package Name';
                case 'commissionPackagesPage.list.headerFields.startDate':
                    return 'Activation Date';
                case 'commissionPackagesPage.list.headerFields.endDate':
                    return 'Due Date';
                case 'commissionPackagesPage.list.headerFields.touchpoint':
                    return 'Touch Point';
                case 'commissionPackagesPage.list.headerFields.paymentType':
                    return 'Payment Type';
                case 'commissionPackagesPage.list.headerFields.amountRange':
                    return 'Amount Range';
                default:
                    return '';
            }
        };

        const customHeader: GridColumnHeaderParams = {
            field: 'name',
            colDef: colDefMocked,
        };

        renderCell(params, params.value);
        showAmountRange(params);
        expect(buildColumnDefs(mockTFunction)).toEqual(ArrayBuildColumnDefs);
        showCustomHeader(customHeader);
    });
});
