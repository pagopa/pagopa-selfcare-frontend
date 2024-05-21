import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {MemoryRouter, Route} from 'react-router-dom';
import {createStore} from '../../../../redux/store';
import {Provider} from 'react-redux';
import {createMemoryHistory} from 'history';
import StationDetailPage from '../StationDetailPage';
import {ecAdminSignedDirect} from '../../../../services/__mocks__/partyService';
import * as useUserRole from '../../../../hooks/useUserRole';
import * as useOrganizationType from '../../../../hooks/useOrganizationType';
import {ROLE} from "../../../../model/RolePermission";

jest.mock('../../../components/commonFunctions');
jest.mock('../../../../hooks/useUserRole');
jest.mock('../../../../hooks/useOrganizationType');

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

const renderApp = (
  stationId: string,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/stations/${stationId}`]}>
        <Route path="/stations/:stationId">
          <ThemeProvider theme={theme}>
            <StationDetailPage />
          </ThemeProvider>
        </Route>
      </MemoryRouter>
    </Provider>
  );
  return { store, history };
};

describe('<StationDetailPage />', () => {
  const stationId = '81001870922_06';

  test('render component StationDetailPage', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.EC_ADMIN,
      userIsPspAdmin: false,
      userIsEcAdmin: true,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: false,
      userIsAdmin: false,
    });
    jest.spyOn(useOrganizationType, 'useOrganizationType').mockReturnValue({
      orgInfo: {
        isSigned: true,
        types: {
          isEc: true,
          isPsp: false,
          isEcBroker: true,
          isPspBroker: false,
        }
      },
      orgIsBrokerSigned: true,
      orgIsEcBrokerSigned: false,
      orgIsEcDirect: true,
      orgIsEcSigned: true,
      orgIsPspBrokerSigned: false,
      orgIsPspDirect: false,
      orgIsPspSigned: false

    });
    const { store } = renderApp(stationId);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );

    expect(screen.getByText('stationDetailPage.associates')).toBeInTheDocument();
  });

  test('Test Render station detail with role operator', async () => {
    jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
      userRole: ROLE.PAGOPA_OPERATOR,
      userIsPspAdmin: false,
      userIsEcAdmin: false,
      userIsPspDirectAdmin: false,
      userIsPagopaOperator: true,
      userIsAdmin: true,
    });
    const { store } = renderApp(stationId);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );
    expect(
      screen.getByText('stationDetailPageValidation.infoToComplete.timeoutC')
    ).toBeInTheDocument();
  });
});
