import { Modal, Backdrop, Fade, Box, Typography, Button } from '@mui/material';
import { MouseEventHandler } from 'react';

type Props = {
  title: string;
  message: any;
  openModal: boolean;
  onConfirmLabel: string;
  onCloseLabel: string;
  handleCloseModal: MouseEventHandler;
  handleConfirm: MouseEventHandler;
  renderContent?: () => any;
};

const GenericModal = ({
  title,
  message,
  openModal,
  onConfirmLabel,
  onCloseLabel,
  handleCloseModal,
  handleConfirm,
}: Props) => (
  <Modal
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    open={openModal}
    onClose={handleCloseModal}
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={openModal} data-testid="fade-test">
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
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'auto',
          }}
        >
          <Button
            variant="outlined"
            sx={{ gridColumn: 'span 6', justifySelf: 'end', mr: 1 }}
            onClick={handleCloseModal}
            data-testid="cancel-button-test"
          >
            {onCloseLabel}
          </Button>
          <Button
            variant="contained"
            sx={{ gridColumn: 'span 2', justifySelf: 'end' }}
            onClick={handleConfirm}
            data-testid="confirm-button-test"
          >
            {onConfirmLabel}
          </Button>
        </Box>
      </Box>
    </Fade>
  </Modal>
);

export default GenericModal;
