import { GridColDef } from '@mui/x-data-grid';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { buildColumnDefs, getAuxDigit, gridLinkActionEdit } from '../StationECTableColumns';
import { mockedCreditorInstitutionsResource } from '../../../../services/__mocks__/creditorInstitutionService';
import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { store } from '../../../../redux/store';
import { Router } from 'react-router-dom';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const mockTFunction = (key: string) => {
  switch (key) {
    case 'stationECList.stationsTableColumns.headerFields.name':
      return 'Nome EC';
    case 'stationECList.stationsTableColumns.headerFields.fiscalCode':
      return 'Codice Fiscale';
    case 'stationECList.stationsTableColumns.headerFields.auxdigit':
      return 'Auxdigit';
    case 'stationECList.stationsTableColumns.headerFields.segregationCode':
      return 'Segregation code';
    case 'stationECList.stationsTableColumns.headerFields.appCode':
      return 'Application code';
    case 'stationECList.stationsTableColumns.headerFields.broadcast':
      return 'Broadcast';
    case 'stationECList.stationsTableColumns.headerFields.aca':
      return 'ACA';
    case 'stationECList.stationsTableColumns.headerFields.standIn':
      return 'Stand In';
    default:
      return '';
  }
};

describe('<StationECTableColumns />', () => {
  test('Test of all the functions inside StationsTableColumns', () => {
    const ArrayBuildColumnDefs = [
      {
        field: 'businessName',
        cellClassName: 'justifyContentBold',
        headerName: 'Nome EC',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 4,
      },
      {
        field: 'fiscalCode',
        cellClassName: 'justifyContentBold',
        headerName: 'Codice Fiscale',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 3,
      },
      {
        field: 'auxDigit',
        cellClassName: 'justifyContentNormal',
        headerName: 'Auxdigit',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'segregationCode',
        cellClassName: 'justifyContentNormal',
        headerName: 'Segregation code',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'applicationCode',
        cellClassName: 'justifyContentNormal',
        headerName: 'Application code',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'aca',
        cellClassName: 'justifyContentNormal',
        headerName: 'ACA',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'stand_in',
        cellClassName: 'justifyContentNormal',
        headerName: 'Stand In',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'broadcast',
        cellClassName: 'justifyContentNormal',
        headerName: 'Broadcast',
        align: 'left',
        headerAlign: 'left',
        editable: false,
        disableColumnMenu: true,
        renderHeader: expect.any(Function),
        renderCell: expect.any(Function),
        sortable: false,
        flex: 2,
      },
      {
        field: 'actions',
        type: 'actions',
        cellClassName: 'justifyContentNormalRight',
        headerName: '',
        align: 'center',
        disableColumnMenu: true,
        editable: false,
        flex: 1,
        getActions: expect.any(Function),
        hideSortIcons: true,
        sortable: false,
      },
    ] as Array<GridColDef>;

    expect(buildColumnDefs(mockTFunction, () => jest.fn(), 'stationId', () => jest.fn(),)).toEqual(
      ArrayBuildColumnDefs
    );
  });

  test('Test gridLinkActionEdit', async () => {
    const onRowClick = jest.fn();
    const onLinkClick = jest.fn();
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <ComponentGridLinkAction onRowClick={onRowClick} onLinkClick={onLinkClick}/>
        </Router>
      </Provider>
    );

    const editAction = screen.getByTestId('editAction');
    const dissociateAction = screen.getByTestId('dissociate-action');

    fireEvent.click(editAction);

    await waitFor(() => {
      expect(onLinkClick).toBeCalled();
    });

    fireEvent.click(dissociateAction);

    await waitFor(() => {
      expect(onRowClick).toBeCalled();
    });
  });

  test('Test getAuxDigit', async () => {
    expect(
      getAuxDigit({ segregationCode: 'seg', applicationCode: undefined, auxDigit: 'auxDigit' })
    ).toBe('3');
    expect(
      getAuxDigit({ segregationCode: undefined, applicationCode: 'appCode', auxDigit: 'auxDigit' })
    ).toBe('0');
    expect(
      getAuxDigit({ segregationCode: 'seg', applicationCode: 'appCode', auxDigit: 'auxDigit' })
    ).toBe('0/3');
    expect(
      getAuxDigit({ segregationCode: undefined, applicationCode: undefined, auxDigit: 'auxDigit' })
    ).toBe('auxDigit');
    expect(
      getAuxDigit({ segregationCode: undefined, applicationCode: undefined, auxDigit: undefined })
    ).toBe('-');
  });
});

const ComponentGridLinkAction = ({ onRowClick, onLinkClick }: { onRowClick: any , onLinkClick: any}) => (
  <>
    {gridLinkActionEdit({
      ci: mockedCreditorInstitutionsResource.creditor_institutions[0],
      stationId: 'stationId',
      t: mockTFunction,
      onRowClick,
      onLinkClick
    })}
  </>
);

