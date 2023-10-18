import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import NodeSignInECForm from '../NodeSignInECForm';
import { BrokerAndEcDetailsResource } from '../../../../api/generated/portal/BrokerAndEcDetailsResource';
import {
  brokerAndEcDetailsResource_ECAndBroker,
  brokerAndEcDetailsResource_ECOnly,
  ecDetails,
} from '../../../../services/__mocks__/nodeService';
import {
  ecAdminSignedUndirect,
  ecAdminUnsigned,
} from '../../../../services/__mocks__/partyService';

const renderApp = (
  signInData: BrokerAndEcDetailsResource,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <NodeSignInECForm goBack={jest.fn()} signInData={signInData} />
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
let SpyOnCreateEcBroker;
let spyOnGetBrokerAndEcDetails;

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
  SpyOnCreateEcBroker = jest.spyOn(require('../../../../services/nodeService'), 'createEcBroker');
  spyOnGetBrokerAndEcDetails = jest.spyOn(
    require('../../../../services/nodeService'),
    'getBrokerAndEcDetails'
  );
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInECForm', () => {
  test('Test rendering NodeSignInECForm with intermediary true and Sumbit a direct ec', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECAndBroker };
    renderApp(ecDetailsDispatched);

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

  test('Test rendering NodeSignInECForm with intermediary false and Sumbit an inderiect ec', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECOnly };

    renderApp(ecDetailsDispatched);

    store.dispatch({
      type: 'parties/setSignInData',
      payload: { ...brokerAndEcDetailsResource_ECOnly },
    });

    setupForm();

    const intermediaryFalse = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=false]') as HTMLInputElement;

    fireEvent.click(intermediaryFalse);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(spyOnCreateEcIndirect).toHaveBeenCalled());
  });

  test('Test rendering NodeSignInECForm and BackBtn click', async () => {
    const ecDetailsDispatched = await waitFor(() =>
      store.dispatch({
        type: 'parties/setSigninData',
        payload: ecAdminSignedUndirect,
      })
    );
    renderApp(ecDetailsDispatched);

    setupForm();

    const backBtn = await screen.findByTestId('back-button-test');
    fireEvent.click(backBtn);
  });

  test('Test rendering NodeSignInECForm with intermediary true and create ecBroker', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECOnly };

    renderApp(ecDetailsDispatched);

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecDetails,
      })
    );

    setupForm();

    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;

    fireEvent.click(intermediaryTrue);

    spyOnUpdateCreditorInstitution.mockResolvedValue({ success: true });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(SpyOnCreateEcBroker).toHaveBeenCalled();
    });
  });

  test('Test error response of createECAndBroker', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECAndBroker };
    renderApp(ecDetailsDispatched);

    setupForm();

    const intermediaryFalse = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=false]') as HTMLInputElement;

    fireEvent.click(intermediaryFalse);

    spyOnCreateECAndBroker.mockRejectedValue(() => {
      throw new Error('Error in createECAndBroker');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });

  test('Test error response of createECIndirect', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECOnly };
    renderApp(ecDetailsDispatched);

    setupForm();

    spyOnCreateEcIndirect.mockRejectedValue(() => {
      throw new Error('Error in createECIndirect');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });

  test('Test error response of updateCreditorInstitution', async () => {
    const ecDetailsDispatched = { ...brokerAndEcDetailsResource_ECOnly };
    renderApp(ecDetailsDispatched);

    setupForm();

    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;

    SpyOnCreateEcBroker.mockRejectedValue(() => {
      throw new Error('Error in createEcBroker');
    });

    spyOnUpdateCreditorInstitution.mockRejectedValue(() => {
      throw new Error('Error in updateCreditorInstitution');
    });

    fireEvent.click(intermediaryTrue);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });
});
