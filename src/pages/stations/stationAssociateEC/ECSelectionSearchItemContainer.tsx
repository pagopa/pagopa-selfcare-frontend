import React from 'react';
import { Grid } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia/dist/components/PartyAccountItemButton';

type Props = {
  title: string | undefined;
  subTitle: string | undefined;
  image: string | undefined;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
};
const ECItemContainer = ({ title, subTitle, image, action }: Props) => (
  <Grid
    className={'selectedMoreThen3'}
    container
    my={1}
    direction={'row'}
    role={'Institution'}
    data-testid={`PartyItemContainer: ${title}`}
    onKeyDownCapture={(e) => {
      if (action && (e.key === 'Enter' || e.key === ' ')) {
        action(e as any);
      }
    }}
    onClick={(e) => action && action(e as any)}
  >
    <PartyAccountItemButton
      partyName={title as string}
      partyRole={subTitle as string}
      image={image}
      selectedItem={false}
      action={action}
      disabled={false}
      maxCharactersNumberMultiLine={20}
    />
  </Grid>
);

export default ECItemContainer;
