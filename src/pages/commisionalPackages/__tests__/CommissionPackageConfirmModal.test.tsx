import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '@pagopa/mui-italia';
import CommissionPackageConfirmModal from '../addEditCommissionPackage/components/CommissionPackageConfirmModal';
import { store } from '../../../redux/store';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('CommissionPackageConfirmModal', () => {
  const copmonent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/comm-packages/add-package/`]}>
          <Route path="/comm-packages/add-package/">
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
          </Route>
        </MemoryRouter>
      </Provider>
    );
  const handleConfirmSubmit = jest.fn();
  const handleCloseConfirmModal = jest.fn();

  it('Test render CommissionPackageConfirmModal', () => {
    copmonent();

    fireEvent.click(screen.getByTestId('confirm-modal-button-test'));

    expect(handleConfirmSubmit).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('cancel-modal-button-test'));

    expect(handleCloseConfirmModal).toHaveBeenCalled();
  });
});
