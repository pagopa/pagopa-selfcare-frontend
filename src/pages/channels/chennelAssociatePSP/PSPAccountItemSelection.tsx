import { PartyAccountItem } from '@pagopa/mui-italia';
import { Box, IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { PSP } from '../../../model/PSP';

type Props = {
  selectedPSP: PSP | null;
  clearField: () => void;
};

export default function PSPAccountItemSelection({ selectedPSP, clearField }: Props) {
  return (
    <Box display="flex" p={2}>
      <Box width="100%">
        <PartyAccountItem
          partyName={selectedPSP ? selectedPSP.description : ''}
          partyRole={/* selectedPSP ? t(roleLabels[selectedPSP.userRole].longLabelKey) : */ ''}
          image={/* selectedPSP?.urlLogo */ ''}
          maxCharactersNumberMultiLine={20}
          noWrap={false}
        />
      </Box>
      <Box display="flex" alignItems="center">
        <IconButton onClick={clearField} id="clearIcon" aria-label="removeSelectionIcon">
          <ClearOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
