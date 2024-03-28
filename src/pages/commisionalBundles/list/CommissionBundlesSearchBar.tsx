import { Box, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, generatePath /* useHistory */ } from 'react-router-dom';
import ROUTES from '../../../routes';
import { usePermissions } from '../../../hooks/usePermissions';

type Props = {
  bundleNameInput: string;
  setBundleNameInput: (value: string) => void;
};

const CommissionBundlesSearchBar = ({ bundleNameInput, setBundleNameInput }: Props) => {
  const { t } = useTranslation();
  const { isPsp } = usePermissions();

  return (
    <Box width="100%" display="flex">
      <TextField
        sx={{ backgroundColor: '#FFFFFF' }}
        key="fixed"
        value={bundleNameInput}
        onChange={(e) => setBundleNameInput(e.target.value)}
        fullWidth
        placeholder={t('commissionBundlesPage.list.searchByName')}
        inputProps={{
          'data-testid': 'search-name-test',
        }}
      />
      {isPsp() && (
        <Button
          component={RouterLink}
          to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
          variant="contained"
          sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto' }}
        >
          {t('commissionBundlesPage.list.createBundle')}
        </Button>
      )}
    </Box>
  );
};

export default CommissionBundlesSearchBar;
