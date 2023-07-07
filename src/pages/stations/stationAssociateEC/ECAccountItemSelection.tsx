import {PartyAccountItem} from '@pagopa/mui-italia';
import {Box, IconButton} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {EC} from '../../../model/EC';

type Props = {
  selectedEC: EC | null;
  clearField: () => void;
};

export default function ECAccountItemSelection({ selectedEC, clearField }: Props) {
  return (
    <Box display="flex" p={2}>
      <Box width="100%">
        <PartyAccountItem
          partyName={selectedEC ? selectedEC.description : ''}
          partyRole={/* selectedEC ? t(roleLabels[selectedEC.userRole].longLabelKey) : */ ''}
          image={/* selectedEC?.urlLogo */ ''}
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
