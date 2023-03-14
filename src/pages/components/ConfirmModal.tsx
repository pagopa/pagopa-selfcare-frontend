import { Modal, Backdrop, Fade, Box, Typography, Button } from '@mui/material';
import { MouseEventHandler } from 'react';

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
}: Props) => (
  <Modal
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-description"
    open={openConfirmModal}
    onClose={handleCloseConfirmModal}
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
    data-testid="exit-modal-test"
  >
    <Fade in={openConfirmModal} data-testid="fade-test">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          borderRadius: '4px',
          boxShadow: 24,
          p: 4,
        }}
      >
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
            sx={{ gridColumn: 'span 5', justifySelf: 'end', mr: 2 }}
            onClick={handleCloseConfirmModal}
            data-testid="cancel-button-test"
          >
            {onCloseLabel}
          </Button>
          <Button
            variant="contained"
            sx={{ gridColumn: 'span 1', justifySelf: 'end' }}
            onClick={handleConfrimSubmit}
            data-testid="confirm-button-test"
          >
            {onConfirmLabel}
          </Button>
        </Box>
      </Box>
    </Fade>
  </Modal>
);

export default ConfirmModal;
