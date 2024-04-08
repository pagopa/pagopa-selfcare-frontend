"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@testing-library/react");
var StationECTableColumns_1 = require("../StationECTableColumns");
beforeEach(function () {
    jest.spyOn(console, 'error').mockImplementation(function () { });
    jest.spyOn(console, 'warn').mockImplementation(function () { });
});
afterEach(react_1.cleanup);
describe('<StationECTableColumns />', function () {
    test('Test of all the functions inside StationECTableColumns', function () {
        var mockTFunction = function (key) {
            switch (key) {
                case 'stationECList.stationsTableColumns.headerFields.name':
                    return 'Station Name';
                case 'stationECList.stationsTableColumns.headerFields.referent':
                    return 'Creation Date';
                case 'stationECList.stationsTableColumns.headerFields.contact':
                    return 'Cration Date 2';
                case 'stationECList.stationsTableColumns.headerFields.status':
                    return 'Status';
                default:
                    return '';
            }
        };
        (0, StationECTableColumns_1.buildColumnDefs)(mockTFunction, function () { return jest.fn(); });
    });
});
