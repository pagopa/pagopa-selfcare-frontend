import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { Provider } from 'react-redux';
import ChannelAssociatePSPPage from '../ChannelAssociatePSPPage';
import {
  mockedChannelAvailablePSP,
  mockedChannelDetail,
} from '../../../../services/__mocks__/channelService';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<ChannelAssociatePSPPage />', () => {
  const channelId = 'XPAY_03_ONUS';
  test('render component ChannelAssociatePSPPage', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/channels/${channelId}/associate-psp`]}>
          <Route path="/channels/:channelId/associate-psp">
            <ThemeProvider theme={theme}>
              <ChannelAssociatePSPPage />
            </ThemeProvider>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    const pspSelectionSearch = screen.getByText(
      'Digita il nome del nuovo PSP da associare al canale'
    );
    expect(pspSelectionSearch).toBeInTheDocument();

    const newPsp = screen.getByTestId('psp-selection-search');
    fireEvent.change(newPsp, { target: { value: 'PSP 2' } });

    const searchSubmit = screen.getByTestId('search-field-test');
    fireEvent.click(searchSubmit);

    const confirm = screen.getByTestId('confirm-btn-test');
    fireEvent.click(confirm);

    // const alertSuccessMessage = await screen.findByText(
    //   'channelAssociatePSPPage.associationForm.successMessage'
    // );
    // expect(alertSuccessMessage).toBeInTheDocument();

    const back = screen.getByTestId('back-btn-test');
    fireEvent.click(back);
  });
});
