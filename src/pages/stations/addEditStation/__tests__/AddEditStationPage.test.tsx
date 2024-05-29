import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import React from 'react';
import AddEditStationPage from '../AddEditStationPage';
import * as StationService from '../../../../services/stationService';
import { mockedFullStation } from '../../../../services/__mocks__/stationService';
import { StationFormAction } from '../../../../model/Station';
import { useAppDispatch } from '../../../../redux/hooks';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { pspAdminSignedDirect } from '../../../../services/__mocks__/partyService';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

const spyOnGetStationDetail = jest.spyOn(StationService, 'getStationDetail');

const RenderComponentCreateMode = () => {
  const history = createMemoryHistory();
  const dispatcher = useAppDispatch();
  dispatcher(partiesActions.setPartySelected(pspAdminSignedDirect));

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <AddEditStationPage />
      </Router>
    </ThemeProvider>
  );
};

describe('<AddEditStationPage />', () => {
  test('render component AddEditStationPage in create mode', () => {
    render(
      <Provider store={store}>
        <RenderComponentCreateMode />
      </Provider>
    );

    expect(spyOnGetStationDetail).not.toBeCalled();
  });

  test('render component AddEditStationPage in edit mode', async () => {
    spyOnGetStationDetail.mockReturnValueOnce(Promise.resolve(mockedFullStation));
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[`/stations/${mockedFullStation.stationCode}/${StationFormAction.Edit}`]}
        >
          <Route path="/stations/:stationId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditStationPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(spyOnGetStationDetail).toBeCalled();
    });
  });

  test('render component AddEditStationPage in edit mode, error on get', async () => {
    spyOnGetStationDetail.mockRejectedValueOnce('error');
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[`/stations/${mockedFullStation.stationCode}/${StationFormAction.Edit}`]}
        >
          <Route path="/stations/:stationId/:actionId">
            <ThemeProvider theme={theme}>
              <AddEditStationPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(spyOnGetStationDetail).toBeCalled();
    });
  });
});
