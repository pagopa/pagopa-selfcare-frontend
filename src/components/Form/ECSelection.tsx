import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { PartyAccountItem } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { CreditorInstitutionInfo } from '../../api/generated/portal/CreditorInstitutionInfo';
import { CreditorInstitutionResource } from '../../api/generated/portal/CreditorInstitutionResource';

type CreditorInstitutionGeneric = CreditorInstitutionInfo | CreditorInstitutionResource;

type Props = {
  availableEC: Array<CreditorInstitutionGeneric>;
  selectedEC: CreditorInstitutionGeneric | undefined;
  onECSelectionChange: (selectedEC: CreditorInstitutionGeneric | undefined) => void;
  loading?: boolean;
  onChangeInput?: (event: any) => void;
  serverSide?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

export default function ECSelection({
  availableEC,
  selectedEC,
  onECSelectionChange,
  loading,
  onChangeInput,
  serverSide,
  errorMessage,
  disabled,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Grid container item direction="column" display="flex" justifyContent="center" xs={12}>
      {selectedEC === undefined && (
        <Autocomplete
          noOptionsText={t('general.noOptions')}
          loadingText={t('general.loading')}
          id="ec-selection"
          data-testid="ec-selection-id-test"
          disabled={disabled || (serverSide ? false : availableEC.length === 0)}
          value={selectedEC}
          loading={loading}
          onChange={(event, newSelecteCI: CreditorInstitutionGeneric | null) => {
            onECSelectionChange(newSelecteCI ?? undefined);
          }}
          onInputChange={onChangeInput}
          options={availableEC}
          filterOptions={serverSide ? (x) => x : undefined}
          getOptionLabel={(optionEC: CreditorInstitutionGeneric) => optionEC?.businessName ?? ''}
          sx={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={errorMessage ? true : false}
              helperText={errorMessage}
              label={t('stationAssociateECPage.associationForm.ECSelectionInputPlaceholder')}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>{loading ? <CircularProgress color="inherit" size={20} /> : null}</>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
              key={(props as any)['data-option-index']}
            >
              <PartyAccountItem
                partyName={option?.businessName ?? ''}
                maxCharactersNumberMultiLine={20}
                noWrap={false}
              />
            </Box>
          )}
        />
      )}

      <Grid
        item
        sx={{
          overflow: 'auto',
          height: 'auto',
          maxHeight: '220px',
        }}
        data-testid="grid-item"
      >
        {selectedEC !== undefined && (
          <Box display="flex">
            <Box width="100%" data-testid="selected-ec-item-id-test">
              <PartyAccountItem
                partyName={selectedEC?.businessName ?? ''}
                maxCharactersNumberMultiLine={20}
                noWrap={false}
              />
            </Box>
            {!disabled && (
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => onECSelectionChange(undefined)}
                  id="clearIcon"
                  aria-label="removeSelectionIcon"
                  data-testid="remove-selected-ec-btn-id-test"
                >
                  <ClearOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
