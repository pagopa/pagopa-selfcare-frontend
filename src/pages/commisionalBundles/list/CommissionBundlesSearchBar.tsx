import {Box, Button, TextField} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {generatePath, Link as RouterLink} from 'react-router-dom';
import ROUTES from '../../../routes';
import {useUserRole} from "../../../hooks/useUserRole";
import {useOrganizationType} from "../../../hooks/useOrganizationType";

type Props = {
    bundleNameInput: string;
    setBundleNameInput: (value: string) => void;
};

const CommissionBundlesSearchBar = ({bundleNameInput, setBundleNameInput}: Props) => {
    const {t} = useTranslation();
    const {userIsAdmin} = useUserRole();
    const {orgInfo} = useOrganizationType();

    return (
    <Box width="100%" display="flex">
            <TextField
                sx={{backgroundColor: '#FFFFFF'}}
                key="fixed"
                value={bundleNameInput}
                onChange={(e) => setBundleNameInput(e.target.value)}
                fullWidth
                placeholder={t('commissionBundlesPage.list.searchByName')}
                inputProps={{
                    'data-testid': 'search-name-test',
                }}
            />
            {orgInfo.types.isPsp && userIsAdmin && (
                <Button
                    component={RouterLink}
                    to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
                    variant="contained"
                    sx={{ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto'}}
                    data-testid={"create-bundle-button"}
                >
                    {t('commissionBundlesPage.list.createBundle')}
                </Button>
            )}
        </Box>
    );
};

export default CommissionBundlesSearchBar;
