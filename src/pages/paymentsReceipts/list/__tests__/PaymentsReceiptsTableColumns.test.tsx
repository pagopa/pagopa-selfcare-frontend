import {
    GridColDef,
    GridColumnHeaderParams,
    GridRenderCellParams,
    GridStateColDef,
  } from '@mui/x-data-grid';
  import { cleanup, render } from '@testing-library/react';
  import {
    buildColumnDefs
  } from '../PaymentsReceiptsTableColumns';
  import { createMemoryHistory } from 'history';
  import React from 'react';
  import { store } from '../../../../redux/store';
  import { Provider } from 'react-redux';
  import { Router } from 'react-router-dom';
  
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(cleanup);
  
  const mockTFunction = (key: string) => {
    switch (key) {
      case 'paymentsReceiptsPage.column.iuv':
        return 'IUV';
      case 'paymentsReceiptsPage.column.taxCode':
        return 'Tax code';
      default:
        return '';
    }
  };
  
  describe('<PaymentsReceiptsTableColumns />', () => {
    const history = createMemoryHistory();
    test('Test of all the functions inside the component', () => {  
      const ArrayBuildColumnDefs = [
        {
            field: 'iuv',
            cellClassName: 'justifyContentBold',
            headerName: mockTFunction('paymentsReceiptsPage.column.iuv'),
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
            headerName: mockTFunction('paymentsReceiptsPage.column.taxCode'),
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
  
      const realColumns = buildColumnDefs(mockTFunction, jest.fn()) as Array<any>;
      expect(realColumns).toEqual(ArrayBuildColumnDefs);
    });
  });
  