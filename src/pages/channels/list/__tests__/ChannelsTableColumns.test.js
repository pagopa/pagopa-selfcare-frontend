"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var ChannelsTableColumns_1 = require("../ChannelsTableColumns");
var TableUtils_1 = require("../../../../components/Table/TableUtils");
var react_2 = require("react");
beforeEach(function () {
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
afterEach(react_1.cleanup);
describe('<ChannelsTableColumns />', function () {
    test('Test of all the functions inside ChannelsTableColumns', function () {
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
            field: 'channel_code',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'Channel Name',
        };
        var colDefMockedStatus = {
            computedWidth: 0,
            field: 'endabled',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'status',
        };
        var colDefMockedBroker = {
            computedWidth: 0,
            field: 'broker_description',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'Creation Date',
        };
        var params = {
            value: 'some value',
            row: {
                channel_code: '123456',
                status: 'ACTVE',
            },
            api: undefined,
            id: '1',
            field: 'channel_code',
            rowNode: rowNode[0],
            colDef: colDefMocked,
            cellMode: 'edit',
            hasFocus: false,
            tabIndex: 0,
            getValue: function () { return jest.fn(); },
        };
        var paramsBroker = {
            value: 'broker_description',
            row: { broker_description: 'broker_description' },
            field: 'broker_description',
            api: null,
            getValue: function () { return ''; },
            colDef: colDefMockedBroker,
            id: '',
            rowNode: rowNode[0],
            cellMode: 'view',
            hasFocus: true,
            tabIndex: 0,
        };
        var paramsStatus = {
            value: 'status',
            row: { enabled: 'ACTIVE' },
            field: 'enabled',
            api: null,
            getValue: function () { return ''; },
            colDef: colDefMockedStatus,
            id: '',
            rowNode: rowNode[0],
            cellMode: 'view',
            hasFocus: true,
            tabIndex: 0,
        };
        var ArrayBuildColumnDefs = [
            {
                field: 'channel_code',
                cellClassName: 'justifyContentBold',
                headerName: 'Channel Name',
                align: 'left',
                headerAlign: 'left',
                width: 404,
                editable: false,
                disableColumnMenu: true,
                renderHeader: TableUtils_1.showCustomHeader,
                renderCell: expect.any(Function),
                sortable: true,
                flex: 4,
            },
            {
                field: 'createdAt',
                cellClassName: 'justifyContentNormal',
                headerName: 'Created At',
                align: 'left',
                headerAlign: 'left',
                width: 404,
                editable: false,
                disableColumnMenu: true,
                renderHeader: TableUtils_1.showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 4,
            },
            {
                field: 'modifiedAt',
                cellClassName: 'justifyContentNormal',
                headerName: 'Modified At',
                align: 'left',
                headerAlign: 'left',
                width: 404,
                editable: false,
                disableColumnMenu: true,
                renderHeader: TableUtils_1.showCustomHeader,
                renderCell: expect.any(Function),
                sortable: false,
                flex: 4,
            },
            {
                field: 'enabled',
                cellClassName: 'justifyContentNormal',
                headerName: 'Status',
                align: 'left',
                headerAlign: 'left',
                width: 404,
                editable: false,
                disableColumnMenu: true,
                renderHeader: TableUtils_1.showCustomHeader,
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
        ];
        var mockTFunction = function (key) {
            switch (key) {
                case 'channelsPage.channelsTableColumns.headerFields.name':
                    return 'Channel Name';
                case 'channelsPage.channelsTableColumns.headerFields.creationDate':
                    return 'Created At';
                case 'channelsPage.channelsTableColumns.headerFields.lastEditDate':
                    return 'Modified At';
                case 'channelsPage.channelsTableColumns.headerFields.status':
                    return 'Status';
                default:
                    return '';
            }
        };
        var realColumns = (0, ChannelsTableColumns_1.buildColumnDefs)(mockTFunction, function () { return jest.fn(); });
        expect(realColumns).toEqual(ArrayBuildColumnDefs);
        (0, react_1.render)(<>{(0, ChannelsTableColumns_1.showStatus)(params)}</>);
    });
});
