import React from 'react';
import {Grid} from '@mui/material';
import {PartyAccountItemButton} from '@pagopa/mui-italia';

type Props = {
    title: string | undefined;
    subTitle: string | undefined;
    image: string | undefined;
    disabled?: boolean;
    action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
};
const PSPItemContainer = ({title, subTitle, image, disabled = false, action}: Props) => (
    <Grid
        className={'selectedMoreThen3'}
        container
        my={1}
        direction={'row'}
        role={'Institution'}
        data-testid={`PartyItemContainer: ${title}`}
        sx={disabled ? {opacity: 0.5, pointerEvents: 'none'} : {}}
        onKeyDownCapture={(e) => {
            if (!disabled && action && (e.key === 'Enter' || e.key === ' ')) {
                action(e as any);
            }
        }}
    >
        <PartyAccountItemButton
            partyName={title as string}
            partyRole={subTitle as string}
            image={image}
            selectedItem={false}
            action={disabled ? undefined : action}
            disabled={disabled}
            maxCharactersNumberMultiLine={20}
        />
    </Grid>
);

export default PSPItemContainer;
