"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var StationsTableColumns_1 = require("../StationsTableColumns");
var react_2 = require("react");
beforeEach(function () {
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
afterEach(react_1.cleanup);
describe('<StationsTableColumns />', function () {
    test('Test of all the functions inside StationsTableColumns', function () {
        var rowNode = [
            {
                id: '',
                parent: '',
                depth: 0,
                groupingKey: '',
                groupingField: '',
            },
        ];
        var colDefMocked = {
            computedWidth: 0,
            field: 'stationCode',
            type: '',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'stationCode',
        };
        var params = {
            value: 'some value',
            row: {
                stationCode: '123456',
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
            getValue: function () { return jest.fn(); },
        };
        var ArrayBuildColumnDefs = [
            {
                field: 'stationCode',
                cellClassName: 'justifyContentBold',
                headerName: 'Station Name',
                align: 'left',
                headerAlign: 'left',
                minWidth: 485,
                editable: false,
                disableColumnMenu: true,
                renderHeader: expect.any(Function),
                renderCell: expect.any(Function),
                sortable: true,
                flex: 4,
            },
            {
                field: 'createdAt',
                cellClassName: 'justifyContentNormal',
                headerName: 'Creation Date',
                align: 'left',
                headerAlign: 'left',
                maxWidth: 200,
                editable: false,
                disableColumnMenu: true,
                renderHeader: expect.any(Function),
                renderCell: expect.any(Function),
                sortable: false,
                flex: 4,
            },
            {
                field: 'modifiedAt',
                cellClassName: 'justifyContentNormal',
                headerName: 'Last Edit Date',
                align: 'left',
                headerAlign: 'left',
                maxWidth: 200,
                editable: false,
                disableColumnMenu: true,
                renderHeader: expect.any(Function),
                renderCell: expect.any(Function),
                sortable: false,
                flex: 4,
            },
            {
                field: 'activationDate',
                cellClassName: 'justifyContentNormal',
                headerName: 'Activation Date',
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
                field: 'wrapperStatus',
                cellClassName: 'justifyContentNormal',
                headerName: 'Status',
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
        ];
        var mockTFunction = function (key) {
            switch (key) {
                case 'stationsPage.stationsTableColumns.headerFields.name':
                    return 'Station Name';
                case 'stationsPage.stationsTableColumns.headerFields.creationDate':
                    return 'Creation Date';
                case 'stationsPage.stationsTableColumns.headerFields.lastEditDate':
                    return 'Last Edit Date';
                case 'stationsPage.stationsTableColumns.headerFields.activationDate':
                    return 'Activation Date';
                case 'stationsPage.stationsTableColumns.headerFields.status':
                    return 'Status';
                default:
                    return '';
            }
        };
        expect((0, StationsTableColumns_1.buildColumnDefs)(mockTFunction)).toEqual(ArrayBuildColumnDefs);
        (0, react_1.render)(<>{(0, StationsTableColumns_1.showStatus)(params)}</>);
    });
});
