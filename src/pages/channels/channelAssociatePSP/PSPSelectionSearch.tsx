import React, {useState} from 'react';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {PSP} from '../../../model/PSP';
import PSPSelectionSearchInput from './PSPSelectionSearchInput';
import PSPItemContainer from './PSPSelectionSearchItemContainer';
import PSPAccountItemSelection from './PSPAccountItemSelection';

type Props = {
  availablePSP: Array<PSP>;
  selectedPSP: PSP | undefined;
  onPSPSelectionChange: (selectedPSP: PSP | undefined) => void;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
  PSPTitle?: string;
};

const verifyPSPFilter = (psp: PSP, filter: string) =>
  psp.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;

const CustomBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
    borderRadius: '16px',
  },
  overflowY: 'auto',
  height: '100%',
});

export default function PSPSelectionSearch({
  availablePSP,
  selectedPSP,
  onPSPSelectionChange,
  label,
  iconColor,
  iconMarginRight,
}: Props) {
  const [input, setInput] = useState<string>('');
  const [filteredParties, setFilteredParties] = useState<Array<PSP>>([]);

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value || value.length < 3) {
      setFilteredParties([]);
    } else {
      setFilteredParties(availablePSP?.filter((e) => verifyPSPFilter(e, value)));
    }
    if (value && selectedPSP && !verifyPSPFilter(selectedPSP, value)) {
      onPSPSelectionChange(undefined);
    }
  };

  const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, PSP: PSP) => {
    onPSPSelectionChange(PSP);
  };

  return (
    <React.Fragment>
      <Grid container item direction="column">
        {!selectedPSP && (
          <Grid item my={2}>
            <PSPSelectionSearchInput
              label={label}
              iconMarginRight={iconMarginRight}
              onChange={(e) => onFilterChange(e.target.value)}
              input={input}
              clearField={() => onFilterChange('')}
              iconColor={iconColor}
            />
          </Grid>
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
          {selectedPSP ? (
            <PSPAccountItemSelection
              selectedPSP={selectedPSP}
              clearField={() => onPSPSelectionChange(undefined)}
            />
          ) : (
            <CustomBox sx={{ pointerEvents: availablePSP.length !== 1 ? 'auto' : 'none' }}>
              {filteredParties &&
                filteredParties.map((PSP) => (
                  <PSPItemContainer
                    key={PSP.broker_psp_code}
                    title={PSP.description}
                    subTitle={/* t(roleLabels[PSP.userRole].longLabelKey) */ ''}
                    image={/* PSP.urlLogo */ ''}
                    action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      handleListItemClick(event, PSP)
                    }
                  />
                ))}
            </CustomBox>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
