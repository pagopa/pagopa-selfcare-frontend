import React, {} from 'react';
import {Grid, styled} from '@mui/material';
import {useTranslation} from 'react-i18next';
import Snippet from '../../components/Snippet/Snippet';

type Props = {
    html: string;
    waitForElementCondition: string | null | undefined;
    waitForElementFunction: () => void | null | undefined;
};

const CustomGrid = styled(Grid)({
    '& .otnotice-menu': {
        border: 'none',
        position: 'absolute',
        background: 'none',
        'box-shadow': 'none'
    }

});

export function TOS_AND_PRIVACY({html, waitForElementCondition, waitForElementFunction}: Props) {
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <CustomGrid container mt={3}>
                <Snippet html={html}
                     waitForElementCondition={waitForElementCondition} 
                     waitForElementFunction={waitForElementFunction} />
            </CustomGrid>
        </React.Fragment>
    );
}
