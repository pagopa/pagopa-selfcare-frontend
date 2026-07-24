import {Box, Drawer, Stack, IconButton, Grid} from '@mui/material';
import react, {Dispatch, SetStateAction} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBack from '@mui/icons-material/ArrowBack';

export const PaddedDrawer = ({
                                 openDrawer,
                                 setOpenDrawer,
                                 children,
                                 hasBackButton,
                                 backButtonAction,
                                 onClose = () => setOpenDrawer(false),
                                 drawerButtons,
                                 paddingX
                             }: {
    openDrawer: boolean;
    setOpenDrawer: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
    hasBackButton?: boolean;
    backButtonAction?: React.Dispatch<React.MouseEvent<HTMLButtonElement, MouseEvent>>;
    onClose?: () => void;
    drawerButtons?: React.ReactNode;
    paddingX?: number;
}) => (
    <Drawer open={openDrawer} onClose={() => onClose()} anchor="right" data-testid="padded-drawer"
            style={{zIndex: 499}}>
        <Box p={3} py={1} px={paddingX} sx={{maxWidth: '420px', minWidth: '420px', minHeight: '65vh', height: "100%"}}>
            <Stack direction="row" justifyContent="space-between">
                <Box display="flex" justifyContent="flex-start" mb={1}>
                    {hasBackButton && (
                        <IconButton onClick={backButtonAction} data-testid="back-drawer-button">
                            <ArrowBack/>
                        </IconButton>
                    )}
                </Box>
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <IconButton onClick={() => onClose()} data-testid="close-drawer-button">
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </Stack>
            <Grid container height="92%" alignContent={"space-between"}>
                <Grid item xs={12}>
                    {children}
                </Grid>
                {drawerButtons && (
                    <Grid item xs={12} pb={1} height="fit-content">
                        {drawerButtons}
                    </Grid>
                )}
            </Grid>
        </Box>
    </Drawer>
);
