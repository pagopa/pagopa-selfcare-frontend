import { Box, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, generatePath /* useHistory */ } from 'react-router-dom';
import ROUTES from '../../../routes';
import { FormAction } from '../../../model/CommissionPackage';

type Props = {
  packageNameInput: string;
  setPackageNameInput: (value: string) => void;
};

const CommissionPackagesSearchBar = ({ packageNameInput, setPackageNameInput }: Props) => {
  const { t } = useTranslation();
  // const history = useHistory();

  return (
    <Box width="100%" display="flex" sx={{ mt: 1 }}>
      <TextField
        sx={{ backgroundColor: '#FFFFFF' }}
        key="fixed"
        value={packageNameInput}
        onChange={(e) => setPackageNameInput(e.target.value)}
        fullWidth
        placeholder={t('commissionPackagesPage.list.searchByName')}
        inputProps={{
          'data-testid': 'search-name-test',
        }}
      />
      <Button
        component={RouterLink}
        to={generatePath(ROUTES.COMMISSION_PACKAGES_ADD)}
        variant="contained"
        sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto' }}
      >
        {t('commissionPackagesPage.list.createPackage')}
      </Button>
    </Box>
  );
};

export default CommissionPackagesSearchBar;
