import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PSP } from '../../../model/PSP';
import { Delegation } from '../../../api/generated/portal/Delegation';
import PSPSelectionSearchInput from './PSPSelectionSearchInput';
import PSPItemContainer from './PSPSelectionSearchItemContainer';
import PSPAccountItemSelection from './PSPAccountItemSelection';

type Props = {
  availablePSP: Array<Delegation>;
  selectedPSP: Delegation | undefined;
  onPSPSelectionChange: (selectedPSP: Delegation | undefined) => void;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
  PSPTitle?: string;
};

const verifyPSPFilter = (psp: Delegation, filter: string) =>
  psp?.institution_name
    ? psp.institution_name.toUpperCase().indexOf(filter.toUpperCase()) >= 0
    : false;

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
  const [filteredParties, setFilteredParties] = useState<Array<Delegation>>([]);

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value || value.length < 3) {
      setFilteredParties([]);
    } else {
      setFilteredParties(availablePSP.filter((e) => verifyPSPFilter(e, value)));
    }
    if (value && selectedPSP && !verifyPSPFilter(selectedPSP, value)) {
      onPSPSelectionChange(undefined);
    }
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    PSP: Delegation
  ) => {
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
            <CustomBox>
              {filteredParties &&
                filteredParties.map((PSP) => (
                  <PSPItemContainer
                    key={PSP.institution_id}
                    title={PSP.institution_name}
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
