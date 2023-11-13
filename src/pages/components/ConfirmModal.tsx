import { Button, Stack, Typography } from '@mui/material';
import { MouseEventHandler } from 'react';
import GenericModal from '../../components/Form/GenericModal';
import { isOperator } from './commonFunctions';

type Props = {
  title: string;
  message: any;
  openConfirmModal: boolean;
  onConfirmLabel: string;
  onCloseLabel: string;
  handleCloseConfirmModal: MouseEventHandler;
  handleConfrimSubmit: MouseEventHandler;
};

const ConfirmModal = ({
  title,
  message,
  openConfirmModal,
  onConfirmLabel,
  onCloseLabel,
  handleCloseConfirmModal,
  handleConfrimSubmit,
}: Props) => {
  const operator = isOperator();
  const renderContent = () => (
    <>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        {message}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent={'flex-end'} sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleCloseConfirmModal}
          data-testid="cancel-button-modal-test"
        >
          {onCloseLabel}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfrimSubmit}
          data-testid="confirm-button-modal-test"
        >
          {onConfirmLabel}
        </Button>
      </Stack>
    </>
  );

  return (
    <GenericModal
      title={title}
      message={message}
      openModal={openConfirmModal}
      onConfirmLabel={onConfirmLabel}
      onCloseLabel={onCloseLabel}
      handleCloseModal={handleCloseConfirmModal}
      handleConfirm={handleConfrimSubmit}
      renderContent={renderContent}
    />
  );
};

export default ConfirmModal;
