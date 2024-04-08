"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var ChannelPSPTableColumns_1 = require("../ChannelPSPTableColumns");
beforeEach(function () {
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
afterEach(react_1.cleanup);
describe('<ChannelPSPTableColumns />', function () {
    test('Test of all the functions inside ChannelPSPTableColumns', function () {
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
        var colDefMockedBroker2 = {
            computedWidth: 0,
            field: 'broker_description2',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'Creation Date',
        };
        var customHeaderChannel = {
            field: 'channel_code',
            colDef: colDefMocked,
        };
        var customHeaderBroker = {
            field: 'broker_description',
            colDef: colDefMockedBroker,
        };
        var customHeaderBroker2 = {
            field: 'broker_description2',
            colDef: colDefMockedBroker2,
        };
        var customHeaderStatus = {
            field: 'enabled',
            colDef: colDefMockedStatus,
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
        var paramsBroker2 = {
            value: 'broker_description2',
            row: { broker_description2: 'broker_description2' },
            field: 'broker_description2',
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
        var mockTFunction = function (key) {
            switch (key) {
                case 'channelPSPList.channelsTableColumns.headerFields.name':
                    return 'Channel Name';
                case 'channelPSPList.channelsTableColumns.headerFields.referent':
                    return 'Creation Date';
                case 'channelPSPList.channelsTableColumns.headerFields.contact':
                    return 'Cration Date 2';
                case 'channelPSPList.channelsTableColumns.headerFields.status':
                    return 'Status';
                default:
                    return '';
            }
        };
        (0, ChannelPSPTableColumns_1.buildColumnDefs)(mockTFunction, function () { return jest.fn(); });
    });
});
