import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';
import { ThemeProvider } from '@mui/system';
import { store } from '../../../redux/store';
import { theme } from '@pagopa/mui-italia';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('ConfirmModal', () => {
  const history = createMemoryHistory();
  const handleCloseConfirmModal = jest.fn();
  const handleConfirmSubmit = jest.fn();

  const componentRendered = () =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <ThemeProvider theme={theme}>
            <ConfirmModal
              title="Test Title"
              message="Test Message"
              openConfirmModal={true}
              onConfirmLabel="Confirm"
              onCloseLabel="Cancel"
              handleCloseConfirmModal={handleCloseConfirmModal}
              handleConfrimSubmit={handleConfirmSubmit}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

  it('renders correctly with the provided props', () => {
    componentRendered();

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    const confirmBtn = screen.getByTestId('cancel-button-modal-test');
    const cancelBtn = screen.getByTestId('cancel-button-modal-test');

    fireEvent.click(confirmBtn);
    fireEvent.click(cancelBtn);
  });
});
