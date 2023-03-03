import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  status: string;
};

export function StationsMenuOptions({ status }: Props) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', verticalAlign: 'middle', marginRight: 2 }}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon fontSize="medium" sx={{ color: 'primary.main', padding: '3px' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} id="stations-management-menu">
        <MenuItem onClick={() => {}}>{t('stationsPage.stationOptions.manageStation')}</MenuItem>
        {/* TODO Must redirect to stations management */}
        <MenuItem onClick={() => {}}>
          {status === 'ACTIVE'
            ? t('stationsPage.stationOptions.manageEC')
            : status === 'TO_BE_CORRECTED'
            ? t('stationsPage.stationOptions.correctStation')
            : t('stationsPage.stationOptions.editStation')}
        </MenuItem>
      </Menu>
    </Box>
  );
}
