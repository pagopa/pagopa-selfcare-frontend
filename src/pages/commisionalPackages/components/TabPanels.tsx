import { Typography, Tabs, Tab, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import CommisionalPackagesEmpty from './CommisionalPackagesEmpty';

type Props = {
  children?: React.ReactNode;
  index: number;
  valueTab: number;
};

const TabPanels = () => {
  const [value, setValue] = useState(0);

  const CustomTabPanel = (props: Props) => {
    const { children, index, valueTab, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, width: '100%' }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ width: '100%' }}
          centered
          variant="fullWidth"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel valueTab={value} index={0}>
        <CommisionalPackagesEmpty />
      </CustomTabPanel>
      <CustomTabPanel valueTab={value} index={1}>
        <CommisionalPackagesEmpty />
      </CustomTabPanel>
      <CustomTabPanel valueTab={value} index={2}>
        <CommisionalPackagesEmpty />
      </CustomTabPanel>
    </Box>
  );
};

export default TabPanels;
