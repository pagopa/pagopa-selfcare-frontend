import { ListItemButton, ListItemText, ListItemIcon, Icon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  disabled?: boolean;
  dataTestId?: string;
};

export default function SidenavItem({
  handleClick,
  title,
  isSelected,
  icon,
  disabled,
  dataTestId,
}: Props) {
  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
      }}
      data-testid={dataTestId}
    >
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      <ListItemText primary={title} />
    </ListItemButton>
  );
}
