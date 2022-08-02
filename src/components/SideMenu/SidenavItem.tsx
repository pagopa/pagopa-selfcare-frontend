import { ListItemButton, ListItemText, ListItemIcon, Icon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
};

export default function SidenavItem({ handleClick, title, isSelected, icon }: Props) {
  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
      sx={{
        height: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      <ListItemText primary={title} />
    </ListItemButton>
  );
}
