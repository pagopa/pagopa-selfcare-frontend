import { TextField, InputAdornment, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { GridSearchIcon } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  handleSearchTrigger: (name: string) => void;
  componentName?: string;
  children?: React.ReactNode;
  resetFilters?: () => void;
};

export default function TableSearchBar({
  handleSearchTrigger,
  componentName,
  children,
  resetFilters,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const [internalSearchValue, setInternalSearchValue] = useState('');

  function handleResetFilter() {
    setInternalSearchValue('');
    if (resetFilters) {
      resetFilters();
    }
  }

  return (
    <Box width={children ? '100%' : '50%'} display="flex" sx={{ mt: 1 }}>
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
        placeholder={componentName ? t(`${componentName}.search.placeholder`) : ''}
      />
      {children}
      <Button
        onClick={() => {
          handleSearchTrigger(internalSearchValue);
        }}
        variant="contained"
        data-testid="button-search"
        sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto', height: 'auto' }}
      >
        {resetFilters ? t('general.filter') : t('general.search')}
      </Button>
      {resetFilters && (
        <ButtonNaked
          size="medium"
          component="button"
          onClick={() => handleResetFilter()}
          sx={{ color: 'primary.main', ml: 1 }}
          weight="default"
          data-testid="reset-filter-button"
        >
          {t('general.removeFilter')}
        </ButtonNaked>
      )}
    </Box>
  );
}
