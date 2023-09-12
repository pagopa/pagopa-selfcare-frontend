import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IbanDeleteModal from '../IbanDeleteModal';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { store } from '../../../../redux/store';
import { createMemoryHistory } from 'history';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('IbanDeleteModal', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const handleConfrimDelete = jest.fn();
  const handleCloseConfirmModal = jest.fn();

  it('Test render IbanDeleteModal', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <IbanDeleteModal
              title={''}
              message={''}
              openConfirmModal={true}
              onConfirmLabel={''}
              onCloseLabel={''}
              handleCloseConfirmModal={handleCloseConfirmModal}
              handleConfrimDelete={handleConfrimDelete}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('cancel-button-test')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button-test')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-button-test'));

    expect(handleConfrimDelete).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('cancel-button-test'));

    expect(handleCloseConfirmModal).toHaveBeenCalled();
  });
});
