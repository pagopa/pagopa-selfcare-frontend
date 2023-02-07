/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable functional/no-let */
import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { debounce } from '@mui/material/utils';
import { useGridApiContext } from '@mui/x-data-grid';
import { useGridRootProps } from '@mui/x-data-grid';
import { useGridSelector } from '@mui/x-data-grid';
import { gridQuickFilterValuesSelector } from '@mui/x-data-grid';
import { GridFilterModel } from '@mui/x-data-grid';
import { Box, Button, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes';

const GridToolbarQuickFilterRoot = styled(TextField, {
  name: 'MuiDataGrid',
  slot: 'ToolbarQuickFilter',
  overridesResolver: (_props, styles) => styles.toolbarQuickFilter,
})(({ theme }) => ({
  width: 'auto',
  paddingBottom: theme.spacing(0.5),
  '& input': {
    marginLeft: theme.spacing(0.5),
  },
  '& .MuiInput-underline:before': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  [`& input[type=search]::-ms-clear,
& input[type=search]::-ms-reveal`]: {
    /* clears the 'X' icon from IE */
    display: 'none',
    width: 0,
    height: 0,
  },
  [`& input[type="search"]::-webkit-search-decoration,
  & input[type="search"]::-webkit-search-cancel-button,
  & input[type="search"]::-webkit-search-results-button,
  & input[type="search"]::-webkit-search-results-decoration`]: {
    /* clears the 'X' icon from Chrome */
    display: 'none',
  },
}));

const defaultSearchValueParser = (searchText: string) =>
  searchText.split(' ').filter((word) => word !== '');

const defaultSearchValueFormatter = (values: Array<string>) => values.join(' ');

export type GridToolbarQuickFilterProps = TextFieldProps & {
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser?: (input: string) => Array<any>;
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   */
  quickFilterFormatter?: (values: GridFilterModel['quickFilterValues']) => string;
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs?: number;
};

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const {
    quickFilterParser = defaultSearchValueParser,
    quickFilterFormatter = defaultSearchValueFormatter,
    debounceMs = 500,
    ...other
  } = props;

  const { t } = useTranslation();

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const quickFilterValues = useGridSelector(apiRef, gridQuickFilterValuesSelector);

  const [searchValue, setSearchValue] = React.useState(() =>
    quickFilterFormatter(quickFilterValues ?? [])
  );

  const [prevQuickFilterValues, setPrevQuickFilterValues] = React.useState(quickFilterValues);

  React.useEffect(() => {
    if (!isDeepEqual(prevQuickFilterValues, quickFilterValues)) {
      // The model of quick filter value has been updated
      setPrevQuickFilterValues(quickFilterValues);

      // Update the input value if needed to match the new model
      setSearchValue((prevSearchValue) =>
        isDeepEqual(quickFilterParser(prevSearchValue), quickFilterValues)
          ? prevSearchValue
          : quickFilterFormatter(quickFilterValues ?? [])
      );
    }
  }, [prevQuickFilterValues, quickFilterValues, quickFilterFormatter, quickFilterParser]);

  const updateSearchValue = React.useCallback(
    (newSearchValue: string) => {
      apiRef.current.setQuickFilterValues(quickFilterParser(newSearchValue));
    },
    [apiRef, quickFilterParser]
  );

  const debouncedUpdateSearchValue = React.useMemo(
    () => debounce(updateSearchValue, debounceMs),
    [updateSearchValue, debounceMs]
  );

  const handleSearchValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchValue = event.target.value;
      setSearchValue(newSearchValue);
      debouncedUpdateSearchValue(newSearchValue);
    },
    [debouncedUpdateSearchValue]
  );

  const handleSearchReset = React.useCallback(() => {
    setSearchValue('');
    updateSearchValue('');
  }, [updateSearchValue]);

  return (
    <Box width="100%" display="flex">
      <GridToolbarQuickFilterRoot
        as={TextField}
        value={searchValue}
        onChange={handleSearchValueChange}
        placeholder={t('channelsPage.searchPlaceholder')}
        aria-label={apiRef.current.getLocaleText('toolbarQuickFilterLabel')}
        type="search"
        sx={{ width: '100%' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="disabled" />
            </InputAdornment>
          ),
          sx: { height: 48 },
          endAdornment: (
            <IconButton
              aria-label={apiRef.current.getLocaleText('toolbarQuickFilterDeleteIconLabel')}
              size="small"
              sx={{ visibility: searchValue ? 'visible' : 'hidden' }}
              onClick={handleSearchReset}
            >
              <rootProps.components.QuickFilterClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        {...other}
        {...rootProps.componentsProps?.baseTextField}
      />
      <Button
        component={Link}
        to={ROUTES.CREATE_CHANNEL}
        variant="contained"
        sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
      >
        {t('channelsPage.createChannelButtonLabel')}
      </Button>
    </Box>
  );
}

// eslint-disable-next-line functional/immutable-data
GridToolbarQuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The debounce time in milliseconds.
   * @default 500
   */
  debounceMs: PropTypes.number,
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   */
  quickFilterFormatter: PropTypes.func,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   */
  quickFilterParser: PropTypes.func,
} as any;

export { GridToolbarQuickFilter };

// eslint-disable-next-line complexity
function isDeepEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) {
      return false;
    }

    if (Array.isArray(a)) {
      const length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (let i = 0; i < length; i += 1) {
        if (!isDeepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) {
        return false;
      }

      const entriesA = Array.from(a.entries());

      for (let i = 0; i < entriesA.length; i += 1) {
        if (!b.has(entriesA[i][0])) {
          return false;
        }
      }
      for (let i = 0; i < entriesA.length; i += 1) {
        const entryA = entriesA[i];
        if (!isDeepEqual(entryA[1], b.get(entryA[0]))) {
          return false;
        }
      }
      return true;
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) {
        return false;
      }

      const entries = Array.from(a.entries());
      for (let i = 0; i < entries.length; i += 1) {
        if (!b.has(entries[i][0])) {
          return false;
        }
      }
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      const length = (a as any).length;
      if (length !== (b as any).length) {
        return false;
      }
      for (let i = 0; i < length; i += 1) {
        if ((a as any)[i] !== (b as any)[i]) {
          return false;
        }
      }
      return true;
    }

    if (a.constructor === RegExp) {
      return a.source === b.source && a.flags === b.flags;
    }
    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf();
    }
    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString();
    }

    const keys = Object.keys(a);
    const length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }

    for (let i = 0; i < length; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (let i = 0; i < length; i += 1) {
      const key = keys[i];
      if (!isDeepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  // true if both NaN, false otherwise
  // eslint-disable-next-line no-self-compare
  return a !== a && b !== b;
}
