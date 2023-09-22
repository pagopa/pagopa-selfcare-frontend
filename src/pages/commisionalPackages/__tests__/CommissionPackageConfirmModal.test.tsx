import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { createMemoryHistory } from 'history';
import CommissionPackageConfirmModal from '../addEditCommissionPackage/components/CommissionPackageConfirmModal';
import { store } from '../../../redux/store';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('CommissionPackageConfirmModal', (injectedHistory?: ReturnType<
  typeof createMemoryHistory
>) => {
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  const handleConfirmSubmit = jest.fn();
  const handleCloseConfirmModal = jest.fn();

  it('Test render CommissionPackageConfirmModal', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <CommissionPackageConfirmModal
              title={''}
              message={''}
              openConfirmModal={true}
              onConfirmLabel={''}
              onCloseLabel={''}
              handleCloseModal={handleCloseConfirmModal}
              handleConfrim={handleConfirmSubmit}
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
