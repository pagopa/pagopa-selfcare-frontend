import { Grid } from "@mui/material";
import SideMenuLayout from "../../components/SideMenu/SideMenuLayout";

const SettingsPage = () => {
    console.log("loading settings");
    return (
        <SideMenuLayout>
            <Grid container justifyContent={'center'}>
                <h1>TEST</h1>
            </Grid>
        </SideMenuLayout>
    );
};

export default SettingsPage;