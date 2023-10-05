import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, store } from '../../../../redux/store';
import NodeSignInECForm from '../NodeSignInECForm';
import { PortalApi } from '../../../../api/PortalApiClient';
import { CreditorInstitutionDetailsResource } from '../../../../api/generated/portal/CreditorInstitutionDetailsResource';
import { ecDetails } from '../../../../services/__mocks__/nodeService';
import { ecOperatorUnsigned } from '../../../../services/__mocks__/partyService';

const renderApp = (
  injectedHistory?: ReturnType<typeof createMemoryHistory>,
  ecNodeData?: CreditorInstitutionDetailsResource
) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <NodeSignInECForm goBack={jest.fn()} ecNodeData={ecNodeData} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
  return { store, history };
};

const setupForm = () => {
  const address = screen.getByTestId('address-test') as HTMLInputElement;
  const city = screen.getByTestId('city-test') as HTMLInputElement;
  const province = screen.getByTestId('province-test') as HTMLSelectElement;
  const CAP = screen.getByTestId('CAP-test') as HTMLInputElement;
  const fiscalDomicile = screen.getByTestId('fiscal-domicile-test') as HTMLInputElement;

  fireEvent.change(address, { target: { value: 'Via Calindri 21' } });
  expect(address.value).toBe('Via Calindri 21');

  fireEvent.change(city, { target: { value: 'Milano' } });
  expect(city.value).toBe('Milano');

  fireEvent.change(province, { target: { value: 'MI' } });
  expect(province.value).toBe('MI');

  fireEvent.change(CAP, { target: { value: '11111' } });
  expect(CAP.value).toBe('11111');

  fireEvent.change(fiscalDomicile, { target: { value: 'Via Calindri 21' } });
  expect(fiscalDomicile.value).toBe('Via Calindri 21');
};

let spyOnCreateECAndBroker;
let spyOnCreateEcIndirect;
let spyOnUpdateCreditorInstitution;
let spyOnGetCreditorInstitutionDetails;

beforeEach(() => {
  spyOnCreateECAndBroker = jest.spyOn(
    require('../../../../services/nodeService'),
    'createECAndBroker'
  );
  spyOnCreateEcIndirect = jest.spyOn(
    require('../../../../services/nodeService'),
    'createECIndirect'
  );
  spyOnUpdateCreditorInstitution = jest.spyOn(
    require('../../../../services/nodeService'),
    'updateCreditorInstitution'
  );
  spyOnGetCreditorInstitutionDetails = jest.spyOn(
    require('../../../../services/nodeService'),
    'getCreditorInstitutionDetails'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInECForm', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  test('Test rendering NodeSignInECForm with intermediary true and Sumbit', async () => {
    renderApp();

    setupForm();

    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;

    fireEvent.click(intermediaryTrue);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyOnCreateECAndBroker).toHaveBeenCalled();
    });
  });

  test('Test rendering NodeSignInECForm with intermediary false and Sumbit', async () => {
    renderApp();

    setupForm();

    const intermediaryFalse = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=false]') as HTMLInputElement;

    fireEvent.click(intermediaryFalse);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyOnCreateEcIndirect).toHaveBeenCalled();
    });
  });

  test('Test rendering NodeSignInECForm and Sumbit', async () => {
    renderApp();

    setupForm();

    const backBtn = await screen.findByTestId('back-button-test');
    fireEvent.click(backBtn);
  });

  test('Test rendering NodeSignInECForm with intermediary false and Sumbit', async () => {
    renderApp(history, ecDetails[0]);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecOperatorUnsigned,
      })
    );

    setupForm();

    const intermediaryFalse = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=false]') as HTMLInputElement;

    fireEvent.click(intermediaryFalse);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyOnUpdateCreditorInstitution).toHaveBeenCalled();
      expect(spyOnGetCreditorInstitutionDetails).toHaveBeenCalled();
    });
  });

  test('Test error response of updateCreditorInstitution', async () => {
    renderApp();

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecOperatorUnsigned,
      })
    );

    setupForm();

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    PortalApi.getCreditorInstitutionDetails =
      async (): Promise<CreditorInstitutionDetailsResource> =>
        Promise.reject('mocked errore response for tests');

    PortalApi.updateCreditorInstitution = async (): Promise<CreditorInstitutionDetailsResource> =>
      Promise.reject('mocked error response for tests');
  });

  test('Test error response of createECAndBroker', async () => {
    renderApp();

    setupForm();

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    PortalApi.createECAndBroker = async (): Promise<CreditorInstitutionDetailsResource> =>
      Promise.reject('mocked error response for tests');
  });

  test('Test error response of createECIndirect', async () => {
    renderApp();

    setupForm();

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    PortalApi.createECIndirect = async (): Promise<CreditorInstitutionDetailsResource> =>
      Promise.reject('mocked error response for tests');
  });
});
