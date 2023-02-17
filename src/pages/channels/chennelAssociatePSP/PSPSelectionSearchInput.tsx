import { Grid, TextField, IconButton, styled } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import React, { ChangeEventHandler } from 'react';

const CustomIconButton = styled(IconButton)({
  '&:hover': {
    backgroundColor: 'transparent !important',
  },
});
const CustomTextField = styled(TextField)({
  label: { fontSize: '14px', fontWeight: 'fontWeightMedium', color: '#475A6D', paddingLeft: '8px' },
  input: { cursor: 'pointer' },
  '& .MuiOutlinedInput-root.MuiInputBase-adornedStart.MuiInputBase-adornedEnd': {
    height: '48px',
    paddingLeft: '16px',
  },
});
type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  input: string;
  clearField?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
};

export default function PSPSelectionSearchInput({
  onChange,
  input,
  clearField,
  label,
  iconColor = '#475A6D',
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>();

  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Grid item display="flex" justifyContent="center" xs={12}>
      <CustomTextField
        inputRef={inputRef}
        label={label}
        name="partySearchInput"
        sx={{ width: '100%' }}
        value={input}
        onChange={onChange}
        id="search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {
                <CustomIconButton disableRipple={true} onClick={focusTextInput}>
                  <SearchOutlinedIcon sx={{ color: iconColor }} />
                </CustomIconButton>
              }
            </InputAdornment>
          ),
          endAdornment: (
            <CustomIconButton
              disableRipple={true}
              onClick={clearField}
              aria-label="removeSelectionIcon"
            >
              <ClearOutlinedIcon sx={{ color: iconColor }} />
            </CustomIconButton>
          ),
        }}
      />
    </Grid>
  );
}
