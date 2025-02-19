import {Icon, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import {ExitToApp, SvgIconComponent} from '@mui/icons-material';

type Props = {
    handleClick: () => void;
    title: string;
    isSelected?: boolean;
    icon: SvgIconComponent;
    disabled?: boolean;
    dataTestId?: string;
    isLink?: boolean;
    endIcon?: SvgIconComponent;
};

export default function SidenavItem({
                                        handleClick,
                                        title,
                                        isSelected,
                                        icon,
                                        disabled,
                                        dataTestId,
                                        isLink,
                                        endIcon
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
                <Icon component={icon}/>
            </ListItemIcon>

            <ListItemText primary={title}/>

            {(isLink || endIcon) && <ListItemIcon>
                <Icon component={endIcon ?? ExitToApp}></Icon>
            </ListItemIcon>}
        </ListItemButton>
    );
}
