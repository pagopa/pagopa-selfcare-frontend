import { Icon, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExitToApp, SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
  disabled?: boolean;
  dataTestId?: string;
  isLink?: boolean;
  endIcon?: SvgIconComponent;
  collapsed?: boolean;
};

export default function SidenavItem({
  handleClick,
  title,
  isSelected,
  icon,
  disabled,
  dataTestId,
  isLink,
  endIcon,
  collapsed,
}: Props) {
  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        ...(collapsed && { justifyContent: 'center' }),
      }}
      data-testid={dataTestId}
    >
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      {!collapsed && (
        <>
          <ListItemText primary={title} />
          {(isLink || endIcon) && (
            <ListItemIcon sx={{ ml: 'auto' }}>
              <Icon component={endIcon ?? ExitToApp}></Icon>
            </ListItemIcon>
          )}
        </>
      )}
    </ListItemButton>
  );
}
