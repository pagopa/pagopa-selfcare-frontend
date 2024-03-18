import { Box, Drawer, Stack, IconButton } from "@mui/material";
import react, { Dispatch, SetStateAction } from "react";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBack from '@mui/icons-material/ArrowBack';

export const PaddedDrawer = ({
    openDrawer,
    setOpenDrawer,
    children,
    hasBackButton,
    backButtonAction,
    onClose = () => setOpenDrawer(false)
  }: {
    openDrawer: boolean;
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
    hasBackButton?: boolean;
    backButtonAction?: React.Dispatch<React.MouseEvent<HTMLButtonElement, MouseEvent>>;
    onClose?: () => void;
  }) => (
    <Drawer open={openDrawer} onClose={() => onClose() } anchor="right" data-testid="padded-drawer">
      <Box p={3} pt={1} sx={{ maxWidth: '420px', minWidth: "420px" }}>
        <Stack direction="row" justifyContent="space-between">
            <Box display="flex" justifyContent="flex-start" mb={1}>
              {hasBackButton &&
              (<IconButton onClick={backButtonAction} data-testid="back-drawer-button">
                <ArrowBack />
              </IconButton>)}
            </Box>
            <Box display="flex" justifyContent="flex-end" mb={1}>
              <IconButton onClick={() => onClose()} data-testid="close-drawer-button">
                <CloseIcon />
              </IconButton>
            </Box>
        </Stack>
        {children}
      </Box>
    </Drawer>
  );