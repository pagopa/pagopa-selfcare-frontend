import { Box, Drawer, IconButton } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from '@mui/icons-material/Close';

export const PaddedDrawer = ({
    openDrawer,
    setOpenDrawer,
    children,
  }: {
    openDrawer: boolean;
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
  }) => (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} anchor="right">
      <Box p={3} pt={1} sx={{ maxWidth: '320px', minWidth: "320px" }}>
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Drawer>
  );