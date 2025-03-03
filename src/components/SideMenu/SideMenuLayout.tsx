import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import SideMenu from './SideMenu';

export default function SideMenuLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Grid container sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={collapsed ? 0.5 : 2} mt={1}>
        <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      </Grid>

      <Grid
        item
        xs={collapsed ? 11.5 : 10}
        sx={{ backgroundColor: '#F5F6F7' }}
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
