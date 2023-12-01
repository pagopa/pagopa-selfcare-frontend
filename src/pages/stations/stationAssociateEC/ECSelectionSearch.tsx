import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { EC } from '../../../model/EC';
import { Delegation } from '../../../api/generated/portal/Delegation';
import ECSelectionSearchInput from './ECSelectionSearchInput';
import ECSelectionSearchItemContainer from './ECSelectionSearchItemContainer';
import ECAccountItemSelection from './ECAccountItemSelection';

type Props = {
  availableEC: Array<Delegation>;
  selectedEC: Delegation | undefined;
  onECSelectionChange: (selectedEC: Delegation | undefined) => void;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
  ECTitle?: string;
};

const verifyECFilter = (ec: Delegation, filter: string) =>
  ec.broker_name && ec.broker_name.toUpperCase().indexOf(filter.toUpperCase()) >= 0;

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

export default function ECSelectionSearch({
  availableEC,
  selectedEC,
  onECSelectionChange,
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
      setFilteredParties(
        availableEC.filter(
          (e) => e.broker_name && e.broker_name.toUpperCase().includes(value.toUpperCase())
        )
      );
    }

    // if (value && selectedEC && !verifyECFilter(selectedEC, value)) {
    //   onECSelectionChange(undefined);
    // }
  };

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    EC: Delegation
  ) => {
    onECSelectionChange(EC);
  };

  return (
    <React.Fragment>
      <Grid container item direction="column">
        {!selectedEC && (
          <Grid item my={2}>
            <ECSelectionSearchInput
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
          {selectedEC ? (
            <ECAccountItemSelection
              selectedEC={selectedEC}
              clearField={() => onECSelectionChange(undefined)}
            />
          ) : (
            <CustomBox sx={{ pointerEvents: availableEC.length >= 1 ? 'auto' : 'none' }}>
              {filteredParties &&
                filteredParties.map((EC) => (
                  <ECSelectionSearchItemContainer
                    key={EC.broker_id}
                    title={EC.broker_name}
                    subTitle={/* t(roleLabels[EC.userRole].longLabelKey) */ ''}
                    image={/* EC.urlLogo */ ''}
                    action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                      handleListItemClick(event, EC);
                    }}
                  />
                ))}
            </CustomBox>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
