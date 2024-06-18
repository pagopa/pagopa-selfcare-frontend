import {Button, Stack} from '@mui/material';
import {generatePath, Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FormAction} from '../../../../model/Channel';
import ROUTES from '../../../../routes';
import {ChannelDetailsResource, WrapperStatusEnum,} from '../../../../api/generated/portal/ChannelDetailsResource';
import {useUserRole} from "../../../../hooks/useUserRole";
import {updateWrapperStationWithOperatorReview} from '../../../../services/channelService';

const ModalContent = ({
                          setShowModal,
                          channelDetail,
                          setChannelDetail,
                      }: {
    setShowModal: (value: boolean) => void;
} & Props) => {
    const {t} = useTranslation();

    const addError = useErrorDispatcher();
    const setLoading = useLoading(LOADING_TASK_STATION_DETAILS_REQUEST_EDIT);

    const [input, setInput] = useState<string>(stationDetail?.note ?? '');

    const sendEditRequest = () => {
        setLoading(true);
        updateWrapperStationWithOperatorReview({
            channelCode: channelDetail?.channel_code ?? '',
            brokerPspCode: channelDetail?.broker_psp_code ?? '',
            note: input,
        })
            .then((data: ChannelDetailsResource) => {
                setChannelDetail(data);
            })
            .catch((reason) =>
                addError({
                    id: 'PUT_CHANNEL_DETAILS_REQUEST_EDIT',
                    blocking: false,
                    error: reason as Error,
                    techDescription: `An error occurred while getting updating the channel with operator's note`,
                    toNotify: true,
                    displayableTitle: t('general.errorTitle'),
                    displayableDescription: t('channelDetailPageValidation.modal.error'),
                    component: 'Toast',
                })
            )
            .finally(() => {
                setShowModal(false);
                setLoading(false);
            });
    };
    return (
        <>
            <Typography variant="h6">{t('channelDetailPageValidation.modal.title')}</Typography>
            <Typography variant="body1" sx={{my: 2}}>
                {t('channelDetailPageValidation.modal.subtitle')}
            </Typography>
            <TextField
                fullWidth
                id="requestInput"
                name="requestInput"
                required
                multiline
                placeholder={t('channelDetailPageValidation.modal.placeholder')}
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                helperText={t('channelDetailPageValidation.modal.helperText')}
                inputProps={{
                    'data-testid': 'requestInput',
                    maxLength: 200,
                }}
            />
            <Box display="flex" justifyContent={'flex-end'} mt={2}>
                <Button
                    variant="outlined"
                    sx={{mr: 1}}
                    onClick={() => setShowModal(false)}
                    data-testid="cancel-button-test"
                >
                    {t('general.turnBack')}
                </Button>
                <Button
                    variant="contained"
                    disabled={!input}
                    onClick={() => sendEditRequest()}
                    data-testid="confirm-and-send-button"
                >
                    {t('general.confirmAndSend')}
                </Button>
            </Box>
        </>
    );
};

type Props = {
    channelDetails?: ChannelDetailsResource;
    goBack: () => void;
};

const DetailButtons = ({channelDetails, goBack}: Props) => {
    const {channelId} = useParams<{ channelId: string }>();
    const {userIsPagopaOperator} = useUserRole();
    const {t} = useTranslation();

    return (
        <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
            {/*
              <Button
                color={'error'}
                style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                variant="outlined"
                onClick={goBack}
              >
                {t('channelDetailPage.disable')}
              </Button>
              */}

            {userIsPagopaOperator && channelDetails?.wrapperStatus === WrapperStatusEnum.APPROVED ? (
                <>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.CHANNEL_EDIT, {
                            channelId,
                            actionId: FormAction.Edit,
                        })}
                        variant="contained"
                    >
                        {t('channelDetailPage.edit')}
                    </Button>
                </>
            ) : userIsPagopaOperator && channelDetails?.wrapperStatus !== WrapperStatusEnum.APPROVED ? (
                <>
                    <Button
                        component={Link}
                        to={''}
                        color="error"
                        variant="outlined"
                        disabled={false}
                        onClick={() => ''}
                    >
                        {t('channelDetailPage.correctionRequired')}
                    </Button>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.CHANNEL_EDIT, {
                            channelId,
                            actionId: FormAction.Edit,
                        })}
                        variant="contained"
                    >
                        {t(
                            `channelDetailPage.${
                                status === WrapperStatusEnum.TO_FIX || status === WrapperStatusEnum.TO_FIX_UPDATE
                                    ? 'approveAndValidate'
                                    : 'configure'
                            }`
                        )}
                    </Button>
                </>
            ) : channelDetails?.wrapperStatus === WrapperStatusEnum.APPROVED ? (
                <>
                    <Button
                        component={Link}
                        to={''}
                        color="error"
                        variant="outlined"
                        disabled={true}
                        onClick={() => ''}
                    >
                        {t('channelDetailPage.deleteRequired')}
                    </Button>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.CHANNEL_EDIT, {
                            channelId,
                            actionId: FormAction.Duplicate,
                        })}
                        color="primary"
                        variant="outlined"
                        onClick={goBack}
                    >
                        {t('channelDetailPage.duplicate')}
                    </Button>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.CHANNEL_EDIT, {
                            channelId,
                            actionId: FormAction.Edit,
                        })}
                        variant="contained"
                    >
                        {t('channelDetailPage.edit')}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.CHANNEL_EDIT, {
                            channelId,
                            actionId: FormAction.Edit,
                        })}
                        variant="contained"
                    >
                        {t('channelDetailPage.edit')}
                    </Button>
                </>
            )}
        </Stack>
    );
};

export default DetailButtons;
