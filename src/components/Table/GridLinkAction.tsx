import {GridActionsCellItem, GridActionsCellItemProps} from '@mui/x-data-grid';
import {RefAttributes} from 'react';
import {Link as RouterLink} from 'react-router-dom';

type GridLinkActionProps = { to: string } & GridActionsCellItemProps &
    RefAttributes<HTMLButtonElement>;

const GridLinkAction = ({to, ...props}: GridLinkActionProps) => (
    <RouterLink to={to} style={{color: 'primary.main', cursor: 'pointer', textDecoration: 'none'}}>
        <GridActionsCellItem {...props} />
    </RouterLink>
);

export default GridLinkAction;
