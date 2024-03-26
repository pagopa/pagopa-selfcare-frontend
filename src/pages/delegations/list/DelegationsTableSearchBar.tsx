import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  setSearchInput: (name: string) => void;
};

export default function DelegationsTableSearchBar({ setSearchInput }: Props) {
  const { t } = useTranslation();
  const [internalSearchValue, setInternalSearchValue] = useState('');

  return (
    <Box width="50%" display="flex" sx={{ mt: 1 }}>
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
        value={internalSearchValue}
        inputProps={{
          'data-testid': 'search-input',
        }}
        onChange={(event) => setInternalSearchValue(event.target.value)}
        fullWidth
        placeholder={t('delegationsPage.search.placeholder')}
      />
      <Button
        onClick={() => setSearchInput(internalSearchValue)}
        variant="contained"
        data-testid="button-search"
        sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto' }}
      >
        {t('general.search')}
      </Button>
    </Box>
  );
}
