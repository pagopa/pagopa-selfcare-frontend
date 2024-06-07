/* eslint-disable complexity */
import {ManageAccounts, VisibilityOff} from '@mui/icons-material';
import {Alert, Chip, Divider, Grid, IconButton, Paper, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {generatePath, Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ROUTES from '../../../../routes';
import {ChannelDetailsResource} from '../../../../api/generated/portal/ChannelDetailsResource';
import {ProtocolEnum, WrapperStatusEnum,} from '../../../../api/generated/portal/WrapperChannelDetailsResource';
import {StatusChip} from '../../../../components/StatusChip';
import {ENV} from '../../../../utils/env';
import {useUserRole} from "../../../../hooks/useUserRole";
import DetailButtons from './DetailButtons';

type Props = {
    channelDetail: ChannelDetailsResource;
    channelId: string;
    goBack: () => void;
    PSPAssociatedNumber: number;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChannelDetails = ({channelDetail, channelId, goBack, PSPAssociatedNumber}: Props) => {
    const {t} = useTranslation();
    const {userIsPagopaOperator} = useUserRole();
    const targetPath = (!channelDetail.target_path?.startsWith("/") ? "/" : "").concat(channelDetail.target_path !== undefined ? channelDetail.target_path : "");
    const targetValue = `${channelDetail.target_host}:${channelDetail.target_port}${targetPath}`;

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const hidePassword = 'XXXXXXXXXXXXXX';
    const showOrHidePassword = (password?: string) => {
        if (showPassword) {
            return password;
        }
        return hidePassword;
    };

    const forwarder01 =
        ENV.ENV === 'prod'
            ? 'https://api.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward'
            : 'https://api.uat.platform.pagopa.it/pagopa-node-forwarder/api/v1/forward';

    const newConnectionValue = `${
        channelDetail.protocol === ProtocolEnum.HTTPS ? 'https://' : 'http://'
    }${channelDetail.ip}${channelDetail.service}`;

    return (
        <Grid container justifyContent={'center'}>
            <Grid item p={3} xs={8}>
                <Grid container mt={3}>
                    <Grid item xs={6}>
                        <TitleBox title={channelId} mbTitle={2} variantTitle="h4" variantSubTitle="body1"/>
                        <Typography mb={5} color="text.secondary">
                            {t('channelDetailPage.createdOn')}{' '}
                            <Typography component={'span'} color="text.secondary">
                                {`${channelDetail.createdAt?.toLocaleDateString('en-GB')} da ${
                                    channelDetail.createdBy
                                }`}
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailButtons channelDetails={channelDetail} goBack={goBack}/>
                    </Grid>
                    {userIsPagopaOperator &&
                    (channelDetail.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
                        channelDetail.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE) ? (
                        <Grid item xs={12} sx={{mb: 5}}>
                            <Alert severity="warning" variant="outlined">
                                <Typography sx={{py: 2}}>{t('channelDetailPage.alertWarning')}</Typography>
                            </Alert>
                        </Grid>
                    ) : null}
                </Grid>

                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Grid container alignItems={'center'} spacing={0} mb={2}>
                        <Grid item xs={3}>
                            <Typography variant="subtitle2">{t('channelDetailPage.state')}</Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="right">
                            <StatusChip status={channelDetail.wrapperStatus ?? ''}/>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" mb={1}>
                        {t('channelDetailPage.channelConfiguration')}
                    </Typography>
                    <Typography variant="body2">{t('channelDetailPage.institutionInfo')}</Typography>
                    <Divider sx={{mt: 3}}></Divider>

                    <Box mt={5}>
                        <Grid container spacing={2}>
                            <Grid container item alignContent="center" spacing={2} pb={4}>
                                <Grid item xs={12}>
                                    <Typography variant="sidenav">{t('channelDetailPage.registry')}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.pspBrokerCode')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail.broker_psp_code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.companyName')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail.broker_description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.idChannel')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail.channel_code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Typography variant="sidenav">{t('channelDetailPage.target')}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.endPoint')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {targetValue}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Typography variant="sidenav">{t('channelDetailPage.paymentType')}</Typography>
                                </Grid>
                                <Grid container xs={12} mb={3} mt={2}>
                                    {channelDetail.payment_types && channelDetail.payment_types.length > 0
                                        ? channelDetail.payment_types.map((e, i) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <Grid
                                                item
                                                key={`grid${i}`}
                                                xs={3}
                                                sx={i === 0 ? {ml: 2, width: '100%'} : null}
                                            >
                                                <Chip key={`chip${i}`} color="primary" label={`${e}`}/>
                                            </Grid>
                                        ))
                                        : ''}
                                </Grid>
                                <Grid item xs={6} alignItems={'center'}>
                                    <Typography variant="sidenav">{t('channelDetailPage.associatedPsp')}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    textAlign={'right'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'flex-end'}
                                    xs={6}
                                >
                                    <ButtonNaked
                                        component={Link}
                                        to={generatePath(ROUTES.CHANNEL_PSP_LIST, {channelId})}
                                        disabled
                                        color="primary"
                                        endIcon={<ManageAccounts/>}
                                        size="medium"
                                    >
                                        {t('channelDetailPage.changeHistory')}
                                    </ButtonNaked>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.associated')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {PSPAssociatedNumber}
                                    </Typography>
                                </Grid>
                                {/* TODO: get from channelDetail when will be available */}
                                <Grid item xs={12} mt={2}>
                                    <Typography variant="sidenav">{t('channelDetailPage.changes')}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.lastChange')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail.modifiedAt?.toLocaleDateString('en-GB') ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail.modifiedBy ?? '-'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Paper
                    elevation={8}
                    sx={{
                        mt: 2,
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Grid container alignItems={'center'} spacing={0} mb={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" mb={3}>
                                {t('channelDetailValidationPage.title')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" mb={3}>
                                {t('channelDetailValidationPage.subtitle')}
                            </Typography>
                            <Divider> </Divider>
                        </Grid>
                    </Grid>

                    <Box mt={5}>
                        <Grid container spacing={2}>
                            <Grid container item alignContent="center" spacing={2} pb={4}>
                                <Grid item xs={12}>
                                    <Typography variant="sidenav">
                                        {t('channelDetailValidationPage.registry')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.primitiveVersion')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.primitive_version ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.password')}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={9}
                                    sx={{
                                        display: 'flex',
                                        height: '38px',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {channelDetail?.password ? (
                                        <>
                                            <Typography variant="body2" fontWeight={'fontWeightMedium'}
                                                        data-testid="password-value-test">
                                                {showOrHidePassword(channelDetail?.password)}
                                            </Typography>
                                            <IconButton
                                                style={{
                                                    border: 'none !important',
                                                    marginLeft: '42px',
                                                }}
                                                onClick={() => {
                                                    setShowPassword(!showPassword);
                                                }}
                                                data-testid="show-psw-test"
                                            >
                                                {showPassword ? (
                                                    <VisibilityIcon color="primary" sx={{width: '80%'}}/>
                                                ) : (
                                                    <VisibilityOff color="primary" sx={{width: '80%'}}/>
                                                )}
                                            </IconButton>
                                        </>
                                    ) : (
                                        '-'
                                    )}
                                </Grid>
                                <Grid item xs={12} mt={4}>
                                    <Typography variant="sidenav">
                                        {t('channelDetailValidationPage.connection')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.newConnection')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {forwarder01 === newConnectionValue
                                            ? t('channelDetailValidationPage.forwarder01')
                                            : targetValue}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} mt={4}>
                                    <Typography variant="sidenav">
                                        {t('channelDetailValidationPage.proxy')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.proxyAddress')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.proxy_host && channelDetail?.proxy_port
                                            ? `${channelDetail?.proxy_host}:${channelDetail?.proxy_port}`
                                            : '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} mt={4}>
                                    <Typography variant="sidenav">
                                        {t('channelDetailValidationPage.otherInfo')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.timeoutA')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.timeout_a ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.timeoutB')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.timeout_b ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.timeoutC')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.timeout_c ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {t('channelDetailValidationPage.pspNotify')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.flag_io
                                            ? t('channelDetailValidationPage.enabled')
                                            : t('channelDetailValidationPage.disabled')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailValidationPage.stamp')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetail?.digital_stamp_brand
                                            ? t('channelDetailValidationPage.enabled')
                                            : t('channelDetailValidationPage.disabled')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ChannelDetails;
