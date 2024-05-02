import {Button, Chip, Divider, Grid, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useTranslation} from 'react-i18next';
import {generatePath, Link as RouterLink} from 'react-router-dom';
import React from 'react';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import {usePermissions} from '../../../hooks/usePermissions';
import {useOrganizationType} from "../../../hooks/useOrganizationType";


const PSPRegistrationData = () => {
    const {t} = useTranslation();
    const {orgIsPspBrokerSigned, orgIsPspSigned} = useOrganizationType();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const signinData = useAppSelector(partiesSelectors.selectSigninData);
    const {userHasPermission} = usePermissions();

    const stampToString = (stamp: boolean) =>
        stamp
            ? t(`dashboardPage.registrationData.digitalStampValue.yes`)
            : t(`dashboardPage.registrationData.digitalStampValue.no`);

    const isPspBroker = signinData && orgIsPspSigned && orgIsPspBrokerSigned;

    return (
        <>
            <Grid item xs={4} data-testid="psp-registration">
                <Typography variant="body2">{t('dashboardPage.registrationData.companyName')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {selectedParty?.description ?? '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.fiscalCode')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {selectedParty?.fiscalCode ?? '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.abiCode')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {selectedParty?.pspData?.abi_code ?? '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.pspCode')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {signinData?.paymentServiceProviderDetailsResource?.psp_code ?? '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.bicCode')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {signinData?.paymentServiceProviderDetailsResource?.bic ?? '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.digitalStamp')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                    {signinData?.paymentServiceProviderDetailsResource?.stamp !== undefined
                        ? stampToString(signinData.paymentServiceProviderDetailsResource.stamp)
                        : '-'}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.statusLabel')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Chip
                    color={signinData?.paymentServiceProviderDetailsResource?.bic ? 'primary' : 'default'}
                    label={t(
                        `dashboardPage.registrationData.status.${
                            signinData?.paymentServiceProviderDetailsResource?.bic ? 'enabled' : 'disabled'
                        }`
                    )}
                ></Chip>
            </Grid>

            <Grid item xs={12}>
                <Divider sx={{my: 2}}></Divider>
            </Grid>
            <Grid item xs={4}>
                <Typography variant="body2">{t('dashboardPage.registrationData.intermediary')}</Typography>
            </Grid>
            <Grid item xs={8}>
                <Chip
                    color={isPspBroker ? 'primary' : 'default'}
                    label={t(
                        `dashboardPage.registrationData.intermediaryStatus.${
                            isPspBroker ? 'enabled' : 'disabled'
                        }`
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    disabled={!userHasPermission('node-signin')}
                    component={RouterLink}
                    to={generatePath(ROUTES.NODE_SIGNIN)}
                    variant="naked"
                    sx={{ml: 1}}
                    startIcon={<EditIcon/>}
                    data-testid="modify-data-test"
                >
                    {t('dashboardPage.registrationData.modifyData')}
                </Button>
            </Grid>
        </>
    );
};

export default PSPRegistrationData;
