import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { EC } from '../../../model/EC';
import ECSelectionSearchInput from './ECSelectionSearchInput';
import ECSelectionSearchItemContainer from './ECSelectionSearchItemContainer';
import ECAccountItemSelection from './ECAccountItemSelection';

type Props = {
  availableEC: Array<EC>;
  selectedEC: EC | undefined;
  onECSelectionChange: (selectedEC: EC | undefined) => void;
  label?: string;
  iconColor?: string;
  iconMarginRight?: string;
  ECTitle?: string;
};

const verifyECFilter = (ec: EC, filter: string) =>
  ec.description.toUpperCase().indexOf(filter.toUpperCase()) >= 0;

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
  const [filteredParties, setFilteredParties] = useState<Array<EC>>([]);

  const onFilterChange = (value: string) => {
    setInput(value);
    if (!value || value.length < 3) {
      setFilteredParties([]);
    } else {
      setFilteredParties(availableEC?.filter((e) => verifyECFilter(e, value)));
    }
    if (value && selectedEC && !verifyECFilter(selectedEC, value)) {
      onECSelectionChange(undefined);
    }
  };

  const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, EC: EC) => {
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
            <CustomBox sx={{ pointerEvents: availableEC.length !== 1 ? 'auto' : 'none' }}>
              {filteredParties &&
                filteredParties.map((EC) => (
                  <ECSelectionSearchItemContainer
                    key={EC.broker_ec_code}
                    title={EC.description}
                    subTitle={/* t(roleLabels[EC.userRole].longLabelKey) */ ''}
                    image={/* EC.urlLogo */ ''}
                    action={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      handleListItemClick(event, EC)
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
