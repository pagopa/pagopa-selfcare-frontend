import React from 'react';
import {Grid} from '@mui/material';
import {Box} from '@mui/system';
import SideMenu from './SideMenu';

export default function SideMenuLayout({children}: { children: React.ReactNode }) {
    return (
        <Grid container item xs={12} sx={{backgroundColor: 'background.paper'}}>
            <Grid item xs={2}>
                <Box>
                    <SideMenu/>
                </Box>
            </Grid>
            <Grid
                item
                xs={10}
                sx={{backgroundColor: '#F5F6F7'}}
                display="flex"
                justifyContent="center"
                p={3}
                px={1}
            >
                <Box width="100%" px={2}>
                    {children}
                </Box>
            </Grid>
        </Grid>
    );
}
