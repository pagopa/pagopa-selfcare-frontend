import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { Autocomplete, Box, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import { PartyAccountItem } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { CreditorInstitutionInfo } from '../../api/generated/portal/CreditorInstitutionInfo';

type Props = {
  availableEC: Array<CreditorInstitutionInfo>;
  selectedEC: CreditorInstitutionInfo | undefined;
  onECSelectionChange: (selectedEC: CreditorInstitutionInfo | undefined) => void;
};

export default function ECSelection({
  availableEC,
  selectedEC,
  onECSelectionChange,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Grid container item direction="column" display="flex" justifyContent="center" xs={12}>
      {selectedEC === undefined && (
        <Autocomplete
          id="ec-selection"
          data-testid="ec-selection-id-test"
          disabled={availableEC.length === 0}
          value={selectedEC}
          onChange={(event, newSelecteCI: CreditorInstitutionInfo | null) => {
            onECSelectionChange(newSelecteCI ?? undefined);
          }}
          options={availableEC}
          getOptionLabel={(optionEC: CreditorInstitutionInfo) => optionEC?.business_name ?? ''}
          sx={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('stationAssociateECPage.associationForm.ECSelectionInputPlaceholder')}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <GridSearchIcon />
                  </InputAdornment>
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
                partyName={option?.business_name ? option.business_name : ''}
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
          <Box display="flex" p={2}>
            <Box width="100%" data-testid="selected-ec-item-id-test">
              <PartyAccountItem
                partyName={selectedEC?.business_name ? selectedEC.business_name : ''}
                maxCharactersNumberMultiLine={20}
                noWrap={false}
              />
            </Box>
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
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
