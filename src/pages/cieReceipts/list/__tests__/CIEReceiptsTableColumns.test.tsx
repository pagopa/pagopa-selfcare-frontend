import {GridColDef} from '@mui/x-data-grid';
import {cleanup} from '@testing-library/react';
import {buildColumnDefs} from '../CIEReceiptsTableColumns';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
    switch (key) {
        case 'cieReceiptsPage.column.iuv':
            return 'IUV';
        case 'cieReceiptsPage.column.taxCode':
            return 'Tax code';
        case 'cieReceiptsPage.column.paymentDate':
            return 'Payment Date';
        default:
            return '';
    }
};

describe('<CIEReceiptsTableColumns />', () => {
    test('Test of all the functions inside the component', () => {
        const ArrayBuildColumnDefs = [
            {
                field: 'iuv',
                cellClassName: 'justifyContentBold',
                headerName: mockTFunction('cieReceiptsPage.column.iuv'),
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
                headerName: mockTFunction('cieReceiptsPage.column.taxCode'),
                align: 'left',
                headerAlign: 'left',
                minWidth: 300,
                editable: false,
                disableColumnMenu: true,
                renderHeader: expect.any(Function),
                renderCell: expect.any(Function),
                sortable: true,
                flex: 4,
            },
            {
                field: 'paymentDateTime',
                cellClassName: 'justifyContentNormal',
                headerName: mockTFunction('cieReceiptsPage.column.paymentDate'),
                align: 'left',
                headerAlign: 'left',
                editable: false,
                disableColumnMenu: true,
                renderHeader: expect.any(Function),
                renderCell: expect.any(Function),
                sortable: true,
                flex: 4,
            },
            {
                field: 'actions',
                cellClassName: 'justifyContentNormalRight',
                type: 'actions',
                headerName: '',
                align: 'center',
                minWidth: 170,
                hideSortIcons: true,
                disableColumnMenu: true,
                editable: false,
                getActions: expect.any(Function),
                sortable: false,
                flex: 1,
            },
        ] as Array<GridColDef>;

        const realColumns = buildColumnDefs(mockTFunction, jest.fn()) as Array<any>;
        expect(realColumns).toEqual(ArrayBuildColumnDefs);
    });
});
