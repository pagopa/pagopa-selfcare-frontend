import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import '../../../locale';
import ProfileItemDialog from '../ProfileItemDialog';
import { ProfileOption } from '../../../utils/profile-utils';

const options: Array<ProfileOption> = [
  {
    partyRole: 'MANAGER',
    roleKey: 'admin',
    label: 'Ente Creditore',
    roleLabelKey: 'roles.ecAdmin',
    initials: 'EC',
    selected: true,
  },
  {
    partyRole: 'OPERATOR',
    roleKey: 'operator',
    label: 'Operatore',
    roleLabelKey: 'roles.ecOperator',
    initials: 'EC',
    selected: false,
  },
];

const renderDialog = (props: Partial<React.ComponentProps<typeof ProfileItemDialog>> = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <ProfileItemDialog
        open
        options={options}
        selectedRole="admin"
        onSelectedRoleChange={() => ''}
        onClose={() => ''}
        onConfirm={() => ''}
        {...props}
      />
    </ThemeProvider>
  );

describe('<ProfileItemDialog />', () => {
  test('renders nothing when closed', () => {
    renderDialog({ open: false });
    expect(screen.queryByText('Vuoi cambiare profilo?')).not.toBeInTheDocument();
  });

  test('renders title, subtitle and every option', () => {
    renderDialog();

    expect(screen.getByText('Vuoi cambiare profilo?')).toBeInTheDocument();
    expect(screen.getByText('Scegli come vuoi operare sul portale.')).toBeInTheDocument();
    expect(screen.getByText('Ente Creditore')).toBeInTheDocument();
    expect(screen.getByText('Operatore')).toBeInTheDocument();
  });

  test('shows the active caption only for the selected option', () => {
    renderDialog();

    const activeCaptions = screen.getAllByText('In uso ora');
    expect(activeCaptions).toHaveLength(1);
  });

  test('selecting an option calls onSelectedRoleChange with its roleKey', () => {
    const onSelectedRoleChange = jest.fn();
    renderDialog({ onSelectedRoleChange });

    fireEvent.click(screen.getByRole('radio', { name: 'Operatore' }));

    expect(onSelectedRoleChange).toHaveBeenCalledWith('operator');
  });

  test('disables the confirm button when no role is selected', () => {
    renderDialog({ selectedRole: '' });

    expect(screen.getByRole('button', { name: 'Conferma' })).toBeDisabled();
  });

  test('disables confirm button, radios and close button while loading', () => {
    renderDialog({ loading: true });

    expect(screen.getByRole('button', { name: 'Conferma' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Ente Creditore' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Operatore' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Chiudi' })).toBeDisabled();
  });

  test('clicking confirm calls onConfirm', () => {
    const onConfirm = jest.fn();
    renderDialog({ onConfirm });

    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('shows an error alert when an error message is provided', () => {
    renderDialog({ error: 'Qualcosa è andato storto' });

    expect(screen.getByText('Qualcosa è andato storto')).toBeInTheDocument();
  });

  test('clicking the close button calls onClose when not loading', () => {
    const onClose = jest.fn();
    renderDialog({ onClose });

    fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
