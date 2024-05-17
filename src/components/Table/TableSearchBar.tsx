import { TextField, InputAdornment, Button, Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { GridSearchIcon } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

type TabFilter = {
  label: string;
  disabled?: boolean;
};

type Props = {
  handleSearchTrigger?: (value: string) => void;
  componentName?: string;
  children?: React.ReactNode;
  customEndButton?: React.ReactNode;
  setExternalSearchInput?: (value: string) => void;
  resetFilters?: () => void;
  listTabFilter?: Array<TabFilter>;
  setTabFilter?: (index: number) => void;
  activeTabFilter?: number;
};

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

export default function TableSearchBar({
  handleSearchTrigger,
  componentName,
  children,
  customEndButton,
  setExternalSearchInput,
  resetFilters,
  listTabFilter,
  setTabFilter,
  activeTabFilter,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const [internalSearchValue, setInternalSearchValue] = useState('');

  function handleResetFilter() {
    setInternalSearchValue('');
    if (resetFilters) {
      resetFilters();
    }
  }

  function handleOnChangeSearchInput(value: string) {
    setInternalSearchValue(value);
    if (setExternalSearchInput) {
      setExternalSearchInput(value);
    }
  }

  return (
    <>
      <Box
        width={children || customEndButton !== undefined ? '100%' : '50%'}
        display="flex"
        sx={{ mt: 1 }}
      >
        <TextField
          key="fixed"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GridSearchIcon color="disabled" />
              </InputAdornment>
            ),
            sx: { height: 48,backgroundColor: '#FFFFFF' },
          }}
          value={internalSearchValue}
          inputProps={{
            'data-testid': 'search-input',
          }}
          onChange={(event) => handleOnChangeSearchInput(event.target.value)}
          fullWidth
          placeholder={componentName ? t(`${componentName}.search.placeholder`) : ''}
        />
        {children}
        {customEndButton !== undefined ? (
          customEndButton
        ) : (
          <>
            <Button
              onClick={() => handleSearchTrigger && handleSearchTrigger(internalSearchValue)}
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
          </>
        )}
      </Box>

      {listTabFilter && (
        <Box sx={{ borderColor: 'divider', width: '100%', mt: 3 }}>
          <Tabs
            value={activeTabFilter}
            onChange={(_event: React.SyntheticEvent, newValue: number) =>
              setTabFilter && setTabFilter(newValue)
            }
            sx={{ width: '100%' }}
            centered
            variant="fullWidth"
          >
            {listTabFilter?.map((tab, index) => (
              <Tab
                key={tab.label + String(index)}
                label={tab.label}
                {...a11yProps(index)}
                disabled={tab.disabled}
                data-testid="tab-private"
              />
            ))}
          </Tabs>
        </Box>
      )}
    </>
  );
}
