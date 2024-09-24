import React, { MouseEventHandler } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GenericModal from '../../components/Form/GenericModal';

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
  const renderContent = () => (
    <>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        {message}
      </Typography>
      <Box display="flex" justifyContent={'flex-end'}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
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
      </Box>
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
