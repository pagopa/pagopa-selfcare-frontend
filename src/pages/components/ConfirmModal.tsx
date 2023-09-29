import React from 'react';
import { Backdrop, Box, Button, Fade, Typography } from '@mui/material';
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'auto',
        }}
      >
        <Button
          variant="outlined"
          sx={
            operator
              ? { gridColumn: 'span 5', justifySelf: 'end', mr: 4 }
              : { gridColumn: 'span 5', justifySelf: 'end', mr: 2 }
          }
          onClick={handleCloseConfirmModal}
          data-testid="cancel-button-modal-test"
        >
          {onCloseLabel}
        </Button>
        <Button
          variant="contained"
          sx={{ gridColumn: 'span 1', justifySelf: 'end' }}
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
