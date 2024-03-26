import { Box, InputAdornment, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

type Props = {
  searchInput: string;
  setSearchInput: (name: string) => void;
};

export default function DelegationTableSearchBar({ searchInput, setSearchInput }: Props) {
  const { t } = useTranslation();

  return (
    <Box width="60%">
      <TextField
        key="fixed"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <GridSearchIcon color="disabled" />
            </InputAdornment>
          ),
          sx: { height: 48 },
        }}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        fullWidth
        placeholder={t('delegationsPage.search.placeholder')}
      />
    </Box>
  );
}
