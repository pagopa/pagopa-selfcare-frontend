import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from '../../../../redux/store';
import NodeSignInECForm from '../NodeSignInECForm';
import { BrokerAndEcDetailsResource } from '../../../../api/generated/portal/BrokerAndEcDetailsResource';
import {
  brokerAndEcDetailsResource_ECAndBroker,
  brokerAndEcDetailsResource_ECOnly,
  ecDetails,
} from '../../../../services/__mocks__/nodeService';
import {
  ecAdminSignedDirect,
  ecAdminSignedUndirect,
  ecAdminUnsigned,
} from '../../../../services/__mocks__/partyService';

const renderApp = (
  signInData: BrokerAndEcDetailsResource,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <NodeSignInECForm goBack={jest.fn()} signInData={signInData} handleChangeIntermediaryAvailable={jest.fn()} intermediaryAvailableValue={false} setIntermediaryAvailableValue={jest.fn()} />
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

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('NodeSignInECForm', () => {
  const dispatchAdminUsignedAndSignInDataEmpty = async (store) => {
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminUnsigned,
      })
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setSigninData',
        payload: {},
      })
    );
  };

  const dispatchAdminSignedIndirectAndEcDetailsOnly = async (store) => {
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedUndirect,
      })
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setSigninData',
        payload: brokerAndEcDetailsResource_ECOnly,
      })
    );
  };

  const dispatchAdminSignedInDirectAndFullEcDetails = async (store) => {
    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: ecAdminSignedDirect,
      })
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setSigninData',
        payload: brokerAndEcDetailsResource_ECAndBroker,
      })
    );
  };

  test('Test rendering NodeSignInECForm with intermediary true and Sumbit a direct ec', async () => {
    const { store } = renderApp({});

    dispatchAdminUsignedAndSignInDataEmpty(store);

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
    const ecDetailsDispatched = {};

    const { store } = renderApp(ecDetailsDispatched);

    dispatchAdminUsignedAndSignInDataEmpty(store);

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
    renderApp({});
    const backBtn = await screen.findByTestId('back-button-test');
    fireEvent.click(backBtn);
  });

  test('Test rendering NodeSignInECForm with intermediary true and create ecBroker', async () => {
    const { store } = renderApp(brokerAndEcDetailsResource_ECOnly);

    await waitFor(() => dispatchAdminSignedIndirectAndEcDetailsOnly(store));

    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;

    fireEvent.click(intermediaryTrue);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(SpyOnCreateEcBroker).toHaveBeenCalled();
    });
  });

  test('Test rendering NodeSignInECForm in case of updating the form with an ec direct', async () => {
    const { store } = renderApp(brokerAndEcDetailsResource_ECAndBroker);

    dispatchAdminSignedInDirectAndFullEcDetails(store);

    const address = screen.getByTestId('address-test') as HTMLInputElement;
    const city = screen.getByTestId('city-test') as HTMLInputElement;
    const province = screen.getByTestId('province-test') as HTMLSelectElement;
    const CAP = screen.getByTestId('CAP-test') as HTMLInputElement;
    const fiscalDomicile = screen.getByTestId('fiscal-domicile-test') as HTMLInputElement;

    expect(address.value).toBe(
      brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource?.address.location
    );
    expect(city.value).toBe(
      brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource?.address.city
    );
    expect(province.value).toBe(
      brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource?.address.countryCode
    );
    expect(CAP.value).toBe(
      brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource?.address.zipCode
    );
    expect(fiscalDomicile.value).toBe(
      brokerAndEcDetailsResource_ECAndBroker.creditorInstitutionDetailsResource?.address.taxDomicile
    );

    fireEvent.change(address, { target: { value: 'Via Roma 11' } });
    expect(address.value).toBe('Via Roma 11');

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(spyOnUpdateCreditorInstitution).toHaveBeenCalled();
    });
  });

  test('Test rendering NodeSignInECForm in case of updating the form with an ec indirect', async () => {
    const { store } = renderApp(brokerAndEcDetailsResource_ECOnly);

    await waitFor(() => dispatchAdminSignedIndirectAndEcDetailsOnly(store));

    const address = screen.getByTestId('address-test') as HTMLInputElement;
    const city = screen.getByTestId('city-test') as HTMLInputElement;
    const province = screen.getByTestId('province-test') as HTMLSelectElement;
    const CAP = screen.getByTestId('CAP-test') as HTMLInputElement;
    const fiscalDomicile = screen.getByTestId('fiscal-domicile-test') as HTMLInputElement;
    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;
    const intermediaryFalse = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=false]') as HTMLInputElement;

    expect(address.value).toBe(
      brokerAndEcDetailsResource_ECOnly.creditorInstitutionDetailsResource?.address.location
    );
    expect(city.value).toBe(
      brokerAndEcDetailsResource_ECOnly.creditorInstitutionDetailsResource?.address.city
    );
    expect(province.value).toBe(
      brokerAndEcDetailsResource_ECOnly.creditorInstitutionDetailsResource?.address.countryCode
    );
    expect(CAP.value).toBe(
      brokerAndEcDetailsResource_ECOnly.creditorInstitutionDetailsResource?.address.zipCode
    );
    expect(fiscalDomicile.value).toBe(
      brokerAndEcDetailsResource_ECOnly.creditorInstitutionDetailsResource?.address.taxDomicile
    );

    expect(intermediaryFalse.checked).toBe(true);

    fireEvent.change(address, { target: { value: 'Via Roma 11' } });
    expect(address.value).toBe('Via Roma 11');

    expect(intermediaryTrue.checked).toBe(false);
    fireEvent.click(intermediaryTrue);
    expect(intermediaryTrue.checked).toBe(true);

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);

    await waitFor(() => expect(SpyOnCreateEcBroker).toHaveBeenCalled());
    await waitFor(() => expect(spyOnUpdateCreditorInstitution).toHaveBeenCalled());
  });

  test('Test NodeSignInECForm function falsy conditions', async () => {
    const { store } = renderApp({});

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setPartySelected',
        payload: {
          ...ecAdminUnsigned,
          description: undefined,
          fiscalCode: undefined,
        },
      })
    );

    await waitFor(() =>
      store.dispatch({
        type: 'parties/setSigninData',
        payload: undefined,
      })
    );

    setupForm();

    const province = screen.getByTestId('province-test') as HTMLSelectElement;
    const CAP = screen.getByTestId('CAP-test') as HTMLInputElement;
    const confirmBtn = await screen.findByTestId('continue-button-test');

    fireEvent.change(province, { target: { value: 'M' } });
    expect(province.value).toBe('M');

    fireEvent.change(province, { target: { value: '12' } });
    expect(province.value).toBe('M');

    fireEvent.change(CAP, { target: { value: '1111' } });
    expect(CAP.value).toBe('1111');

    fireEvent.change(CAP, { target: { value: 'AAAAA' } });
    expect(CAP.value).toBe('1111');

    fireEvent.click(confirmBtn);

    setupForm();

    fireEvent.click(confirmBtn);
  });

  test('Test error response of createECAndBroker', async () => {
    const { store } = renderApp({});

    dispatchAdminUsignedAndSignInDataEmpty(store);

    setupForm();

    const intermediaryTrue = screen
      .getByTestId('intermediary-available-test')
      .querySelector('[value=true]') as HTMLInputElement;

    fireEvent.click(intermediaryTrue);

    spyOnCreateECAndBroker.mockRejectedValue(() => {
      throw new Error('Error in createECAndBroker');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });

  test('Test error response of createECIndirect', async () => {
    const { store } = renderApp({});

    dispatchAdminUsignedAndSignInDataEmpty(store);

    setupForm();

    spyOnCreateEcIndirect.mockRejectedValue(() => {
      throw new Error('Error in createECIndirect');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });

  test('Test error response of updateCreditorInstitution with intermediary true', async () => {
    const { store } = renderApp(brokerAndEcDetailsResource_ECAndBroker);

    dispatchAdminSignedInDirectAndFullEcDetails(store);

    const address = screen.getByTestId('address-test') as HTMLInputElement;

    fireEvent.change(address, { target: { value: 'Via Roma 11' } });
    expect(address.value).toBe('Via Roma 11');

    spyOnUpdateCreditorInstitution.mockRejectedValue(() => {
      throw new Error('Error in updateCreditorInstitution');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });

  test('Test error response of updateCreditorInstitution with intermediary false', async () => {
    const { store } = renderApp(brokerAndEcDetailsResource_ECOnly);

    await waitFor(() => dispatchAdminSignedIndirectAndEcDetailsOnly(store));

    const address = screen.getByTestId('address-test') as HTMLInputElement;

    fireEvent.change(address, { target: { value: 'Via Roma 11' } });
    expect(address.value).toBe('Via Roma 11');

    spyOnUpdateCreditorInstitution.mockRejectedValue(() => {
      throw new Error('Error in updateCreditorInstitution');
    });

    const confirmBtn = await screen.findByTestId('continue-button-test');
    fireEvent.click(confirmBtn);
  });
});
