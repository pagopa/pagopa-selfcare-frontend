import { Modal, Backdrop, Fade, Box, Typography, Button, Grid } from '@mui/material';
import { MouseEventHandler } from 'react';

type Props = {
  openModal: boolean;

  title?: string;
  message?: any;
  onConfirmLabel?: string;
  onCloseLabel?: string;
  handleCloseModal?: MouseEventHandler;
  handleConfirm?: MouseEventHandler;
  renderContent?: () => any;
  children?: React.ReactNode;
};

const GenericModal = ({
  title,
  message,
  openModal,
  onConfirmLabel,
  onCloseLabel,
  handleCloseModal,
  handleConfirm,
  renderContent,
  children,
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
        {renderContent ? (
          renderContent()
        ) : (
          <>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              {message}
            </Typography>
            {children && <Box my={4}>{children}</Box>}
            <Grid container spacing={1} justifyContent={'flex-end'}>
              {onCloseLabel ? (
                <Grid item xs={2.7}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    data-testid="cancel-button-test"
                  >
                    {onCloseLabel}
                  </Button>
                </Grid>
              ) : (
                <></>
              )}
              {onConfirmLabel ? (
                <Grid item xs={2.7}>
                  <Button
                    variant="contained"
                    onClick={handleConfirm}
                    data-testid="confirm-button-test"
                  >
                    {onConfirmLabel}
                  </Button>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </>
        )}
      </Box>
    </Fade>
  </Modal>
);

export default GenericModal;
