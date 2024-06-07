import {GridColDef} from '@mui/x-data-grid';
import {cleanup} from '@testing-library/react';
import {buildColumnDefs} from '../IbanTableColumns';
import {showCustomHeader} from '../../../../components/Table/TableUtils';
import React from 'react';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<IbanTableColumns />', () => {
    test('Test of all the functions inside IbanTableColumns', () => {
        const ArrayBuildColumnDefs = [
            {
                field: 'iban',
                cellClassName: 'justifyContentBold',
                headerName: 'Iban',
                align: 'left',
                headerAlign: 'left',
                editable: false,
                disableColumnMenu: true,
                renderHeader: showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 4,
            },
            {
                field: 'description',
                cellClassName: 'justifyContentNormal',
                headerName: 'Description',
                align: 'left',
                headerAlign: 'left',
                editable: false,
                disableColumnMenu: true,
                renderHeader: showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 3,
            },
            {
                field: 'activeDate',
                cellClassName: 'justifyContentNormal',
                headerName: 'Activation Date',
                align: 'left',
                headerAlign: 'left',
                editable: false,
                disableColumnMenu: true,
                renderHeader: showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 3,
            },
            {
                field: 'dueDate',
                cellClassName: 'justifyContentNormal',
                headerName: 'Due Date',
                align: 'left',
                headerAlign: 'left',
                editable: false,
                disableColumnMenu: true,
                renderHeader: showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 3,
            },
            {
                field: 'actions',
                cellClassName: 'justifyContentNormalRight',
                headerName: '',
                align: 'right',
                hideSortIcons: true,
                disableColumnMenu: true,
                editable: false,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 1,
            },
        ] as Array<GridColDef>;

        const mockTFunction = (key: string) => {
            switch (key) {
                case 'ibanPage.list.column.ibanCode':
                    return 'Iban';
                case 'ibanPage.list.column.description':
                    return 'Description';
                case 'ibanPage.list.column.activeDate':
                    return 'Activation Date';
                case 'ibanPage.list.column.dueDate':
                    return 'Due Date';
                default:
                    return '';
            }
        };

        const realColumns = buildColumnDefs(mockTFunction, () => jest.fn()) as Array<any>;
        expect(realColumns).toEqual(ArrayBuildColumnDefs);
    });
});
