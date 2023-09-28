import { Modal, Backdrop, Fade, Box, Typography, Button } from '@mui/material';
import { MouseEventHandler } from 'react';

type Props = {
  title: string;
  message: any;
  openConfirmModal: boolean;
  onConfirmLabel: string;
  onCloseLabel: string;
  handleCloseModal: MouseEventHandler;
  handleConfrim: MouseEventHandler;
};

const CommissionPackageConfirmModal = ({
  title,
  message,
  openConfirmModal,
  onConfirmLabel,
  onCloseLabel,
  handleCloseModal,
  handleConfrim,
}: Props) => (
  <Modal
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-description"
    open={openConfirmModal}
    onClose={handleCloseModal}
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
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
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'auto',
          }}
        >
          <Button
            variant="outlined"
            sx={{ gridColumn: 'span 6', justifySelf: 'end', mr: 1 }}
            onClick={handleCloseModal}
            data-testid="cancel-modal-button-test"
          >
            {onCloseLabel}
          </Button>
          <Button
            variant="contained"
            sx={{ gridColumn: 'span 2', justifySelf: 'end' }}
            onClick={handleConfrim}
            data-testid="confirm-modal-button-test"
          >
            {onConfirmLabel}
          </Button>
        </Box>
      </Box>
    </Fade>
  </Modal>
);

export default CommissionPackageConfirmModal;
