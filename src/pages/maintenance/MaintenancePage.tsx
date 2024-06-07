import {Typography} from '@mui/material';
import {Box} from '@mui/system';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

export default function MaintenancePage({message}: Readonly<{ message: string }>) {
    return (
        <Box
            width="100%"
            height="65vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            px={10}
        >
            <EngineeringOutlinedIcon sx={{fill: 'rgb(0, 197, 202)', width: 140, height: 140}}/>
            <Typography variant="body1">
                <div dangerouslySetInnerHTML={{__html: message}}/>
            </Typography>
        </Box>
    );
}
