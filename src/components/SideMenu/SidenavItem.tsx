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
};

export default function SidenavItem({
                                        handleClick,
                                        title,
                                        isSelected,
                                        icon,
                                        disabled,
                                        dataTestId,
                                        isLink
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

            {isLink && <ListItemIcon>
                <Icon component={ExitToApp}></Icon>
            </ListItemIcon>}
        </ListItemButton>
    );
}
