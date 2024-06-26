import {Box, Divider, Grid} from '@mui/material';
import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {theme} from '@pagopa/mui-italia';
import {InstitutionUploadData} from '../../../api/generated/portal/InstitutionUploadData';

type Props = {
    data?: InstitutionUploadData;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const PaymentNoticesDetailPage = ({
                                      data
                                  }: // eslint-disable-next-line sonarjs/cognitive-complexity
                                      Props) => {
    const {t} = useTranslation();
    const history = useHistory();

    return (
        <Grid container justifyContent={'center'}>
            <Grid item xs={12}>

                <Paper
                    elevation={5}
                    sx={{
                        mt: 2,
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Grid container item spacing={2} sx={{ml: 0}}>
                        <Grid container xs={6}>
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="sidenav">
                                        {t('addEditInstitutionsDataPage.detail.ci')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} pt={2}>
                                    <Typography variant="body2">
                                        {t('addEditInstitutionsDataPage.addForm.fields.logo')}
                                    </Typography>
                                    <Grid
                                        sx={{
                                            border: `2px solid ${theme.palette.divider}`,
                                            borderRadius: theme.spacing(0.5),
                                            px: 2,
                                            py: 1.5,
                                            width: '25%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mt: 1
                                        }}>
                                        <img src={data?.logo} style={{width: '100px', height: '100px'}}/>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} pt={2}>
                                    <Typography variant="body2">
                                        {t('addEditInstitutionsDataPage.addForm.fields.name')}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {data?.fullName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} pt={2}>
                                    <Typography variant="body2">
                                        {t('addEditInstitutionsDataPage.addForm.fields.taxCode')}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {data?.taxCode}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} pt={2}>
                                    <Typography variant="body2">
                                        {t('addEditInstitutionsDataPage.addForm.fields.organization')}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {data?.organization}
                                    </Typography>
                                </Grid>
                            </>
                        </Grid>
                        <Grid container xs={6}>
                            <Grid item xs={12}>
                                <Typography variant="sidenav">
                                    {t('addEditInstitutionsDataPage.detail.assistance')}
                                </Typography>
                                <Grid item xs={12} pt={2}>
                                    <Typography variant="body2">
                                        {data?.info}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {data?.webChannel || data?.appChannel ?
                        (
                            <React.Fragment>
                                <Divider sx={{mt: 3}}></Divider>
                                <Grid container item spacing={2} pt={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="sidenav">
                                            {t('addEditInstitutionsDataPage.detail.wherePay')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            {t('addEditInstitutionsDataPage.detail.paymentChannel')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                            {t(data.webChannel ?
                                                data.appChannel ? 'addEditInstitutionsDataPage.detail.webApp' :
                                                    'addEditInstitutionsDataPage.detail.onlyWeb'
                                                : data.appChannel ? 'addEditInstitutionsDataPage.detail.onlyApp' :
                                                    'addEditInstitutionsDataPage.detail.none')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ) : (<Box></Box>)
                    }

                    {data?.posteAuth ?
                        (
                            <React.Fragment>
                                <Divider sx={{mt: 3}}></Divider>
                                <Grid container item spacing={2} pt={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="sidenav">
                                            {t('addEditInstitutionsDataPage.detail.poste')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2">
                                            {t('addEditInstitutionsDataPage.addForm.fields.posteName')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                            {data?.posteName ? data.posteName : '-'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} mb={0}>
                                        <Typography variant="body2">
                                            {t('addEditInstitutionsDataPage.addForm.fields.posteAccountNumber')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                            {data?.posteAccountNumber}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            {t('addEditInstitutionsDataPage.addForm.fields.posteAuth')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                            {data?.posteAuth}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ) : (<Box></Box>)
                    }

                </Paper>

            </Grid>
        </Grid>
    );
};
export default PaymentNoticesDetailPage;
