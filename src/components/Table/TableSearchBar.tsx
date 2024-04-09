import { TextField, InputAdornment, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from 'react-i18next';
import { GridSearchIcon } from "@mui/x-data-grid";
import { useState } from "react";

type Props = {
    setSearchInput: (name: string) => void;
    componentName?: string;
  };

export default function TableSearchBar({ setSearchInput, componentName }: Readonly<Props>) {
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
          placeholder={componentName ? t(`${componentName}.search.placeholder`) : ""}
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
  