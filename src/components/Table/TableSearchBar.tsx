import { TextField, InputAdornment, Button, Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { GridSearchIcon } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';

type TabFilter = {
  label: string;
  disabled?: boolean;
  'data-testid'?: string;
};

type Props = {
  handleSearchTrigger?: (value: string) => void;
  componentName?: string;
  children?: React.ReactNode;
  customEndButton?: React.ReactNode;
  setExternalSearchInput?: (value: string) => void;
  resetFilters?: () => void;
  listTabFilter?: Array<TabFilter>;
  setActiveTab?: (index: number) => void;
  activeTab?: number;
};

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

export default function TableSearchBar({
  // Function triggered when user clicks on the search/filter button
  handleSearchTrigger,
  componentName,
  // React node to render custom elements between the search input and button
  children,
  // React node to render a custom button at the end of the box instead of the search/filter buttons
  customEndButton,
  // Function to set external search input variable
  setExternalSearchInput,
  resetFilters,
  // List of tabs of type TabFilter
  listTabFilter,
  // Function to set external active tab value
  setActiveTab,
  // Controlled active tab value
  activeTab,
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
            sx: { height: 48, backgroundColor: '#FFFFFF' },
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
              onClick={() => handleSearchTrigger !== undefined && handleSearchTrigger(internalSearchValue)}
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
            value={activeTab}
            onChange={(_event: React.SyntheticEvent, newValue: number) =>
              setActiveTab !== undefined && setActiveTab(newValue)
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
                data-testid={`tab-${tab['data-testid'] ?? index}`}
              />
            ))}
          </Tabs>
        </Box>
      )}
    </>
  );
}
