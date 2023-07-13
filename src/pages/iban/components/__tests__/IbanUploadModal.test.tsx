import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import IbanUploadModal from '../IbanUploadModal';
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

describe('IbanUploadModal', (injectedHistory?: ReturnType<typeof createMemoryHistory>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const handleConfirmSubmit = jest.fn();
  const handleCloseConfirmModal = jest.fn();

  it('Test render IbanUploadModal', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <IbanUploadModal
              title={''}
              message={''}
              openConfirmModal={true}
              onConfirmLabel={''}
              onCloseLabel={''}
              handleCloseConfirmModal={handleCloseConfirmModal}
              handleConfrimSubmit={handleConfirmSubmit}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByTestId('cancel-button-test')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button-test')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-button-test'));

    expect(handleConfirmSubmit).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('cancel-button-test'));

    expect(handleCloseConfirmModal).toHaveBeenCalled();
  });
});
