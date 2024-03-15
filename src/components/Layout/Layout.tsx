import {Box, Grid} from '@mui/material';
import {Footer} from '@pagopa/selfcare-common-frontend';
import {useUnloadEventOnExit} from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import React from 'react';
import {useSelector} from 'react-redux';
import {userSelectors} from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import Header from '../Header';
// import withParties, { WithPartiesProps } from '../../decorators/withParties';
// import SideMenu from '../SideMenu/SideMenu';

// type Props = {
//   children?: React.ReactNode;
// } & WithPartiesProps;

type Props = {
    children?: React.ReactNode;
};

/** The layout of the application: Header, Body (having a sidemenu) and Footer */
// const Layout = ({ children, parties }: Props) => {
const Layout = ({children}: Props) => {
    const onExit = useUnloadEventOnExit();
    const loggedUser = useSelector(userSelectors.selectLoggedUser);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Box gridArea="header" sx={{position: 'sticky', top: 0, zIndex: '100'}}>
                <Header onExit={onExit} loggedUser={loggedUser}/>
            </Box>
            <Grid container direction="row" flexGrow={1}>
                {children}
            </Grid>
            <Box gridArea="footer">
                <Footer onExit={onExit} loggedUser={true}/>
            </Box>
        </Box>
    );
};
export default Layout;
