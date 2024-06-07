import React, {useEffect, useState} from 'react';
// import axios from 'axios';
import {Grid} from '@mui/material';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {useTranslation} from 'react-i18next';
// import { ENV } from '../../utils/env';
// import { getReplacedAssetsPaths } from '../../lib/guides-utils';
import tosJson from '../../data/tos.json';

export function TOS() {
    const {t} = useTranslation();
    const [htmlString, setHtmlString] = useState('');

    useEffect(() => {
        /* async function asyncFetchData() {
          const resp = await axios.get(`${ENV.PUBLIC_URL}/data/it/tos.json`);
          const html = getReplacedAssetsPaths(resp?.data.html as string);
          setHtmlString(html);
        }

        asyncFetchData(); */

        setHtmlString(tosJson.html);
    }, []);

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={8} sx={{px: 3, py: 3}}>
                    <TitleBox
                        title={t('tos.title')}
                        mbTitle={2}
                        mtTitle={4}
                        mbSubTitle={6}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />

                    {/*           <div dangerouslySetInnerHTML={{ __html: htmlString }} /> */}
                    <div dangerouslySetInnerHTML={{__html: t(`general.maintenancePageText`)}}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
