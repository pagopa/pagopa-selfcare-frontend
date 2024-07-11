import React from 'react';
import {Grid} from '@mui/material';
import {useTranslation} from 'react-i18next';
import tosJson from '../../data/privacy.json';
import Snippet from '../../components/Snippet/Snippet';

export function PRIVACY() {
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <Grid container mt={3}>
                <Snippet html={tosJson.html} />
            </Grid>
        </React.Fragment>
    );
}
