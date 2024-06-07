import {useState} from 'react';
import {Box, Button, Stack, TextField, Typography} from '@mui/material';
import {generatePath, Link} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {
    ContentCopy,
    Delete,
    MiscellaneousServices,
    ModeEdit,
} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import ROUTES from '../../../../routes';
import {StationFormAction} from '../../../../model/Station';
import {
    StationDetailResource,
    WrapperStatusEnum,
} from '../../../../api/generated/portal/StationDetailResource';
import {useUserRole} from '../../../../hooks/useUserRole';
import {updateWrapperStationWithOperatorReview} from '../../../../services/stationService';
import {LOADING_TASK_STATION_DETAILS_REQUEST_EDIT} from '../../../../utils/constants';
import GenericModal from '../../../../components/Form/GenericModal';

const ModalContent = ({
                          setShowModal,
                          stationDetail,
                          setStationDetail,
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
            stationCode: stationDetail?.stationCode ?? '',
            ciTaxCode: stationDetail?.brokerCode ?? '',
            note: input,
        })
            .then((data: StationDetailResource) => {
                setStationDetail(data);
            })
            .catch((reason) =>
                addError({
                    id: 'PUT_STATION_DETAILS_REQUEST_EDIT',
                    blocking: false,
                    error: reason as Error,
                    techDescription: `An error occurred while getting updating the station with operator's note`,
                    toNotify: true,
                    displayableTitle: t('general.errorTitle'),
                    displayableDescription: t('stationDetailPageValidation.modal.error'),
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
            <Typography variant="h6">{t('stationDetailPageValidation.modal.title')}</Typography>
            <Typography variant="body1" sx={{my: 2}}>
                {t('stationDetailPageValidation.modal.subtitle')}
            </Typography>
            <TextField
                fullWidth
                id="requestInput"
                name="requestInput"
                required
                multiline
                placeholder={t('stationDetailPageValidation.modal.placeholder')}
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                helperText={t('stationDetailPageValidation.modal.helperText')}
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
    stationDetail: StationDetailResource;
    setStationDetail: (value: any) => void;
};

const DetailButtonsStation = ({stationDetail, setStationDetail}: Props) => {
    const {t} = useTranslation();
    const {userIsPagopaOperator} = useUserRole();

    const status = stationDetail?.wrapperStatus;
    const stationCode = stationDetail?.stationCode;

    const [showModal, setShowModal] = useState<boolean>(false);

    const editPath = () =>
        generatePath(ROUTES.STATION_EDIT, {
            stationId: stationCode,
            actionId: StationFormAction.Edit,
        });

    if (userIsPagopaOperator) {
        return (
            <>
                <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
                    {(status === WrapperStatusEnum.TO_CHECK ||
                        status === WrapperStatusEnum.TO_CHECK_UPDATE) && (
                        <Button
                            variant="outlined"
                            onClick={() => setShowModal(true)}
                            data-testid="request-edit-button"
                        >
                            {t('stationDetailPage.stationOptions.requestEdit')}
                        </Button>
                    )}
                    <Button component={Link} to={editPath} variant="contained" data-testid="edit-button">
                        {t(
                            stationDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED
                                ? 'stationDetailPage.stationOptions.approveAndValidate'
                                : 'general.modify'
                        )}
                    </Button>
                </Stack>
                {showModal && (
                    <GenericModal
                        openModal={showModal}
                        renderContent={() => (
                            <ModalContent
                                setShowModal={setShowModal}
                                setStationDetail={setStationDetail}
                                stationDetail={stationDetail}
                            />
                        )}
                    />
                )}
            </>
        );
    }

    return (
        <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
            {status === WrapperStatusEnum.APPROVED ? (
                <>
                    <Button
                        component={Link}
                        to={''}
                        color="error"
                        variant="outlined"
                        disabled={true}
                        startIcon={<Delete/>}
                        // onClick={() => ''}
                        data-testid="delete-button"
                    >
                        {t('general.delete')}
                    </Button>
                    <Button
                        component={Link}
                        to={generatePath(ROUTES.STATION_EC_LIST, {stationId: stationCode})}
                        color="primary"
                        startIcon={<MiscellaneousServices/>}
                        variant="outlined"
                        data-testid="manage-ec-button"
                    >
                        {t('stationDetailPage.manageEC')}
                    </Button>
                    <Button
                        component={Link}
                        to={() =>
                            generatePath(ROUTES.STATION_EDIT, {
                                stationId: stationCode,
                                actionId: StationFormAction.Duplicate,
                            })
                        }
                        startIcon={<ContentCopy/>}
                        variant="outlined"
                        data-testid="duplicate-button"
                    >
                        {t('stationDetailPage.stationOptions.duplicateStation')}
                    </Button>
                    <Button
                        component={Link}
                        to={editPath}
                        variant="contained"
                        startIcon={<ModeEdit/>}
                        data-testid="edit-button"
                    >
                        {t('stationDetailPage.stationOptions.editStation')}
                    </Button>
                </>
            ) : (
                <Button
                    component={Link}
                    to={editPath}
                    variant="contained"
                    startIcon={<ModeEdit/>}
                    data-testid="edit-button"
                >
                    {t(
                        `stationDetailPage.stationOptions.${
                            status === WrapperStatusEnum.TO_FIX || status === WrapperStatusEnum.TO_FIX_UPDATE
                                ? 'correctStation'
                                : 'editStation'
                        }`
                    )}
                </Button>
            )}
        </Stack>
    );
};

export default DetailButtonsStation;
