import {GridColDef, GridRenderCellParams, GridStateColDef} from '@mui/x-data-grid';
import {cleanup, render} from '@testing-library/react';
import {buildColumnDefs, showStatus} from '../ChannelsTableColumns';
import {showCustomHeader} from '../../../../components/Table/TableUtils';
import React from 'react';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<ChannelsTableColumns />', () => {
    test('Test of all the functions inside ChannelsTableColumns', () => {
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
            field: 'channel_code',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'Channel Name',
        };

        const colDefMockedStatus: GridStateColDef<any, any, any> = {
            computedWidth: 0,
            field: 'endabled',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'status',
        };

        const colDefMockedBroker: GridStateColDef<any, any, any> = {
            computedWidth: 0,
            field: 'broker_description',
            type: 'string',
            hasBeenResized: undefined,
            groupPath: undefined,
            headerName: 'Creation Date',
        };

        const params: GridRenderCellParams<any, any, any> = {
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
            getValue: () => jest.fn(),
        };

        const paramsBroker: any = {
            value: 'broker_description',
            row: {broker_description: 'broker_description'},
            field: 'broker_description',
            api: null,
            getValue: () => '',
            colDef: colDefMockedBroker,
            id: '',
            rowNode: rowNode[0],
            cellMode: 'view',
            hasFocus: true,
            tabIndex: 0,
        };

        const paramsStatus: any = {
            value: 'status',
            row: {enabled: 'ACTIVE'},
            field: 'enabled',
            api: null,
            getValue: () => '',
            colDef: colDefMockedStatus,
            id: '',
            rowNode: rowNode[0],
            cellMode: 'view',
            hasFocus: true,
            tabIndex: 0,
        };

        const ArrayBuildColumnDefs = [
            {
                field: 'channel_code',
                cellClassName: 'justifyContentBold',
                headerName: 'Channel Name',
                align: 'left',
                headerAlign: 'left',
                width: 404,
                editable: false,
                disableColumnMenu: true,
                renderHeader: showCustomHeader,
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
                renderHeader: showCustomHeader,
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
                renderHeader: showCustomHeader,
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

        const mockTFunction = (key: string) => {
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

        const realColumns = buildColumnDefs(mockTFunction, () => jest.fn()) as Array<any>;
        expect(realColumns).toEqual(ArrayBuildColumnDefs);

    render(<Provider store={store}>{showStatus(params)}</Provider>);
  });
});
