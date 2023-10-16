import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import { BrowserRouter } from 'react-router-dom';

import { createStore } from '../../../redux/store';
import { ecAdminSigned, ecOperatorUnsigned } from '../../../services/__mocks__/partyService';
import ECRegistrationData from '../components/ECRegistrationData';
import { brokerAndEcDetailsResource_ECAndBroker } from '../../../services/__mocks__/nodeService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const renderApp = (
  ecType: string,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ECRegistrationData ecType={ecType} />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
  return { store, history };
};

test('Test rendering ecAdminSigned', async () => {
  const { store } = renderApp('direct');
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecAdminSigned,
    })
  );
  expect(screen.queryAllByText('Ente Creditore S.r.l.')[0]).toBeVisible();
});

test('Test rendering ecOperatorUnsigned', async () => {
  const { store } = renderApp('indirect');
  await waitFor(() =>
    store.dispatch({
      type: 'parties/setPartySelected',
      payload: ecOperatorUnsigned,
    })
  );

  await waitFor(() =>
    store.dispatch({
      type: 'parties/setSigninData',
      payload: {
        creditorInstitutionDetailsResource:
          brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource,
      },
    })
  );
  expect(screen.getByText('Non disponibile')).toBeVisible();

  const modifyBtn = screen.getByTestId('modify-data-test');
  fireEvent.click(modifyBtn);
});
