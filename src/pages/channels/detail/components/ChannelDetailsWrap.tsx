import {ArrowBack, ManageAccounts} from '@mui/icons-material';
import {Grid, Stack, Breadcrumbs, Typography, Paper, Chip, Divider} from '@mui/material';
import {Box} from '@mui/system';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {Link, generatePath} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import ROUTES from '../../../../routes';
import {ChannelDetailsResource} from '../../../../api/generated/portal/ChannelDetailsResource';
import {WrapperStatusEnum} from '../../../../api/generated/portal/WrapperChannelDetailsResource';
import {StatusChip} from '../../../../components/StatusChip';
import DetailButtons from './DetailButtons';
import GetChannelAlert from './GetChannelAlert';

type Props = {
    channelDetWrap?: ChannelDetailsResource;
    setChannelDetail: (value: any) => void;
    channelId: string;
    goBack: () => void;
    PSPAssociatedNumber: number;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ChannelDetailsWrap = ({channelDetWrap, setChannelDetail, channelId, goBack, PSPAssociatedNumber}: Props) => {
    const {t} = useTranslation();

    return channelDetWrap ? (
        <Grid container justifyContent={'center'}>
            <Grid item p={3} xs={8}>
                <Stack direction="row">
                    <ButtonNaked
                        size="small"
                        component="button"
                        onClick={goBack}
                        startIcon={<ArrowBack/>}
                        sx={{color: 'primary.main', mr: '20px'}}
                        weight="default"
                    >
                        {t('general.exit')}
                    </ButtonNaked>
                    <Breadcrumbs>
                        <Typography>{t('general.Channels')}</Typography>
                        <Typography color={'text.disaled'}>
                            {t('channelDetailPage.detail')} {channelId}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
                <Box display="flex" mt={2} alignItems={'center'}>
                  <Typography variant="h4" mr={3}>
                    {channelId}
                  </Typography>
                  <StatusChip status={channelDetWrap?.wrapperStatus ?? ''} />
                </Box>
                <GetChannelAlert channelDetail={channelDetWrap} />
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={3}>
                        {t('channelDetailPage.channelConfiguration')}
                    </Typography>
                    <Divider></Divider>

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
                                        {channelDetWrap.broker_psp_code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.companyName')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetWrap.broker_description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.idChannel')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetWrap.channel_code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Typography variant="sidenav">{t('channelDetailPage.target')}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.endPoint')}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {`${channelDetWrap.target_host}:${channelDetWrap.target_port}${(!channelDetWrap.target_path?.startsWith("/") ? "/" : "")}${channelDetWrap.target_path}`}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} mt={2}>
                                    <Typography variant="sidenav">{t('channelDetailPage.paymentType')}</Typography>
                                </Grid>
                                <Grid container xs={12} mb={3} mt={2}>
                                    {channelDetWrap.payment_types && channelDetWrap.payment_types.length > 0
                                        ? // eslint-disable-next-line sonarjs/no-identical-functions
                                        channelDetWrap.payment_types.map((e, i) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <Grid key={`grid${i}_wrap`} item xs={3} sx={i === 0 ? {ml: 2} : null}>
                                                <Chip key={`chip${i}_wrap`} color="primary" label={`${e}`}/>
                                            </Grid>
                                        ))
                                        : ''}
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="sidenav">{t('channelDetailPage.associatedPsp')}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    textAlign={'right'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'flex-end'}
                                    xs={3}
                                >
                                    <ButtonNaked
                                        component={Link}
                                        to={generatePath(ROUTES.CHANNEL_PSP_LIST, {channelId})}
                                        disabled={channelDetWrap.wrapperStatus !== WrapperStatusEnum.APPROVED}
                                        color="primary"
                                        endIcon={<ManageAccounts/>}
                                        size="medium"
                                    >
                                        {t('channelDetailPage.managePsp')}
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
                                <Grid item xs={12} sx={{mt: 2}}>
                                    <Typography variant="sidenav">{t('channelDetailPage.changes')}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.lastChange')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetWrap.modifiedAt?.toLocaleDateString('en-GB') ?? '-'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="body2">{t('channelDetailPage.operatedBy')}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                                        {channelDetWrap.modifiedBy}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Typography color="action.active" sx={{ my: 2 }}>
                  {t('channelDetailPage.createdOn')}{' '}
                  <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                    {`${channelDetWrap?.createdAt?.toLocaleDateString('en-GB')}`}
                  </Typography>
                  {' '}{t('general.fromLower')}{' '}
                  <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                    {channelDetWrap?.createdBy}
                  </Typography>
                  {'. '}
                  {
                    channelDetWrap?.modifiedBy && (
                        <>
                          {t('channelDetailPage.lastModified')}{' '}
                          <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                            {channelDetWrap?.modifiedBy}
                          </Typography>
                          {' '}{t('general.atLower')}{' '}
                          <Typography component={'span'} fontWeight={'fontWeightMedium'}>
                            {`${channelDetWrap?.modifiedAt?.toLocaleDateString('en-GB')}`}
                          </Typography>
                          {'. '}
                        </>
                    )
                  }
                </Typography>
                <DetailButtons channelDetails={channelDetWrap} setChannelDetails={setChannelDetail} goBack={goBack}/>
            </Grid>
        </Grid>
    ) : (
        <></>
    );
};

export default ChannelDetailsWrap;

