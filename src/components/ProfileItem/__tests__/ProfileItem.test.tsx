import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import '../../../locale';
import ProfileItem from '../ProfileItem';
import { createStore } from '../../../redux/store';
import { identityTokenStorageOps } from '../../../utils/identity-token-storage';
import { PROFILE_ITEM_FEATURE_FLAG } from '../../../utils/profile-utils';
import { Party } from '../../../model/Party';
import * as tokenExchangeService from '../../../services/tokenExchangeService';

const mockUpdateSigninData = jest.fn().mockResolvedValue(undefined);
jest.mock('../../../hooks/useSigninData', () => ({
  useSigninData: () => mockUpdateSigninData,
}));

const buildToken = (payload: Record<string, unknown>): string =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;

const party: Party = {
  partyId: 'party-1',
  externalId: 'ext-1',
  originId: 'origin-1',
  origin: 'SELC',
  description: 'Test EC',
  digitalAddress: 'test@ec.it',
  status: 'ACTIVE',
  roles: [{ partyRole: 'MANAGER', roleKey: 'admin', roleLabel: '' }],
  fiscalCode: 'TESTFC',
  registeredOffice: 'Via Test 1',
  institutionType: 'EC',
};

const singleRoleToken = buildToken({
  uid: 'uid-1',
  name: 'Mario',
  family_name: 'Rossi',
  email: 'mario.rossi@test.it',
  fiscal_number: 'fiscal-code-1',
  org_id: 'party-1',
  org_role: 'admin',
  org_party_role: 'MANAGER',
  roles: [{ partyRole: 'MANAGER', role: 'admin' }],
});

const twoRoleToken = buildToken({
  uid: 'uid-1',
  name: 'Mario',
  family_name: 'Rossi',
  email: 'mario.rossi@test.it',
  fiscal_number: 'fiscal-code-1',
  org_id: 'party-1',
  org_role: 'admin',
  org_party_role: 'MANAGER',
  roles: [
    { partyRole: 'MANAGER', role: 'admin' },
    { partyRole: 'MANAGER', role: 'admin-psp' },
  ],
});

const newSessionToken = buildToken({
  uid: 'uid-1',
  name: 'Mario',
  family_name: 'Rossi',
  email: 'mario.rossi@test.it',
  fiscal_number: 'fiscal-code-1',
  org_id: 'party-1',
  org_role: 'admin-psp',
  org_party_role: 'MANAGER',
  roles: [
    { partyRole: 'MANAGER', role: 'admin' },
    { partyRole: 'MANAGER', role: 'admin-psp' },
  ],
});

const switchButtonName = 'Cambia profilo: Ente Creditore';

const renderComponent = ({
  includeParty = true,
  featureEnabled = true,
}: { includeParty?: boolean; featureEnabled?: boolean } = {}) => {
  const store = createStore();
  if (includeParty) {
    store.dispatch({ type: 'parties/setPartySelected', payload: party });
  }
  store.dispatch({
    type: 'feature-flags/setFeatureFlags',
    payload: { flags: { [PROFILE_ITEM_FEATURE_FLAG]: featureEnabled } },
  });

  const { container } = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ProfileItem />
      </ThemeProvider>
    </Provider>
  );

  return { store, container };
};

const openDialog = async () => {
  fireEvent.click(screen.getByRole('button', { name: switchButtonName }));
  await screen.findByText('Vuoi cambiare profilo?');
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {
    // no-op
  });
});

afterEach(() => {
  window.localStorage.clear();
  mockUpdateSigninData.mockClear();
});

describe('<ProfileItem />', () => {
  test('renders nothing when the feature flag is disabled', () => {
    storageTokenOps.write(twoRoleToken);
    const { container } = renderComponent({ featureEnabled: false });

    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when no party is selected', () => {
    storageTokenOps.write(twoRoleToken);
    const { container } = renderComponent({ includeParty: false });

    expect(container).toBeEmptyDOMElement();
  });

  test('does not render a switch button when the session token only has one role', () => {
    storageTokenOps.write(singleRoleToken);
    renderComponent();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('opens the dialog with every role option when the session token has multiple roles', async () => {
    storageTokenOps.write(twoRoleToken);
    renderComponent();

    await openDialog();

    expect(screen.getByText('Ente Creditore')).toBeInTheDocument();
    expect(screen.getByText('Prestatore Servizi di Pagamento')).toBeInTheDocument();
  });

  test('confirming without changing the active role just closes the dialog', async () => {
    storageTokenOps.write(twoRoleToken);
    const fetchSpy = jest.spyOn(tokenExchangeService, 'fetchPagoPAToken');
    renderComponent();

    await openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    await waitFor(() =>
      expect(screen.queryByText('Vuoi cambiare profilo?')).not.toBeInTheDocument()
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('shows an error and does not call the token exchange when the identity token is missing', async () => {
    storageTokenOps.write(twoRoleToken);
    const fetchSpy = jest.spyOn(tokenExchangeService, 'fetchPagoPAToken');
    renderComponent();

    await openDialog();
    fireEvent.click(screen.getByRole('radio', { name: 'Prestatore Servizi di Pagamento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    await screen.findByText('Non è stato possibile recuperare il token di accesso.');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('switches profile on a successful token exchange', async () => {
    storageTokenOps.write(twoRoleToken);
    identityTokenStorageOps.write('source-identity-token');
    const fetchSpy = jest.spyOn(tokenExchangeService, 'fetchPagoPAToken').mockResolvedValueOnce({
      status: 200,
      text: () => Promise.resolve(newSessionToken),
    } as Response);
    const { store } = renderComponent();

    await openDialog();
    fireEvent.click(screen.getByRole('radio', { name: 'Prestatore Servizi di Pagamento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    await waitFor(() =>
      expect(screen.queryByText('Vuoi cambiare profilo?')).not.toBeInTheDocument()
    );

    expect(fetchSpy).toHaveBeenCalledWith('source-identity-token', 'admin-psp');
    expect(storageTokenOps.read()).toBe(newSessionToken);
    expect(storageUserOps.read()).toEqual({
      uid: 'uid-1',
      taxCode: 'fiscal-code-1',
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario.rossi@test.it',
    });
    expect(mockUpdateSigninData).toHaveBeenCalledTimes(1);
    expect(mockUpdateSigninData.mock.calls[0][0].roles[0]).toEqual({
      partyRole: 'MANAGER',
      roleKey: 'admin-psp',
      roleLabel: 'roles.pspAdmin',
    });
    expect(store.getState().parties.selected?.roles[0].roleKey).toBe('admin-psp');
  });

  test('shows an error and keeps the dialog open when the exchange returns a non-200 status', async () => {
    storageTokenOps.write(twoRoleToken);
    identityTokenStorageOps.write('source-identity-token');
    jest.spyOn(tokenExchangeService, 'fetchPagoPAToken').mockResolvedValueOnce({
      status: 400,
    } as Response);
    renderComponent();

    await openDialog();
    fireEvent.click(screen.getByRole('radio', { name: 'Prestatore Servizi di Pagamento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    await screen.findByText('Non è stato possibile cambiare profilo. Riprova.');
    expect(screen.getByText('Vuoi cambiare profilo?')).toBeInTheDocument();
    expect(mockUpdateSigninData).not.toHaveBeenCalled();
  });

  test('shows an error when the token exchange call rejects', async () => {
    storageTokenOps.write(twoRoleToken);
    identityTokenStorageOps.write('source-identity-token');
    jest.spyOn(tokenExchangeService, 'fetchPagoPAToken').mockRejectedValueOnce(new Error('network error'));
    renderComponent();

    await openDialog();
    fireEvent.click(screen.getByRole('radio', { name: 'Prestatore Servizi di Pagamento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    await screen.findByText('Non è stato possibile cambiare profilo. Riprova.');
  });
});
