import { useErrorDispatcher, useLoading, useUserNotify } from '@pagopa/selfcare-common-frontend';
import { Button, Stack, Typography, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { ContentCopy, Delete, Edit, ManageAccounts } from '@mui/icons-material';
import { generatePath, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FormAction } from '../../../../model/Channel';
import ROUTES from '../../../../routes';
import {
  ChannelDetailsResource,
  WrapperStatusEnum,
} from '../../../../api/generated/portal/ChannelDetailsResource';
import { useUserRole } from '../../../../hooks/useUserRole';
import { LOADING_TASK_CHANNEL_DETAIL } from '../../../../utils/constants';
import { updateWrapperChannelWithOperatorReview } from '../../../../services/channelService';
import GenericModal from '../../../../components/Form/GenericModal';

const ModalContent = ({
  setShowModal,
  channelDetails,
  setChannelDetails,
}: {
  setShowModal: (value: boolean) => void;
} & Props) => {
  const { t } = useTranslation();

  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_CHANNEL_DETAIL);
  const addNotify = useUserNotify();

  const [input, setInput] = useState<string>(channelDetails?.note ?? '');

  const sendEditRequest = () => {
    setLoading(true);
    updateWrapperChannelWithOperatorReview({
      channelCode: channelDetails?.channel_code ?? '',
      brokerPspCode: channelDetails?.broker_psp_code ?? '',
      note: input,
    })
      .then((data: ChannelDetailsResource) => {
        setChannelDetails(data);
        addNotify({
          id: 'ADDEDIT_INSTITUTION_DATA_SAVE',
          title: '',
          message: t('channelDetailValidationPage.modal.successMessage'),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          id: 'PUT_CHANNEL_DETAILS_REQUEST_EDIT',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while getting updating the channel with operator's note`,
          toNotify: true,
          displayableTitle: t('general.errorTitle'),
          displayableDescription: t('channelDetailValidationPage.modal.error'),
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
      <Typography variant="h6">{t('channelDetailValidationPage.modal.title')}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        {t('channelDetailValidationPage.modal.subtitle')}
      </Typography>
      <TextField
        fullWidth
        id="requestInput"
        name="requestInput"
        required
        multiline
        placeholder={t('channelDetailValidationPage.modal.placeholder')}
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        helperText={t('channelDetailValidationPage.modal.helperText')}
        inputProps={{
          'data-testid': 'requestInput',
          maxLength: 200,
        }}
      />
      <Box display="flex" justifyContent={'flex-end'} mt={2}>
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
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

function Buttons({
  channelDetails,
  setShowModal,
}: {
  channelDetails?: ChannelDetailsResource;
  setShowModal: (value: boolean) => void;
}) {
  const { userIsPagopaOperator } = useUserRole();
  const { t } = useTranslation();
  const { channelId } = useParams<{ channelId: string }>();

  if (userIsPagopaOperator) {
    return (
      <>
        {(channelDetails?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
          channelDetails?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE) && (
          <Button
            variant="outlined"
            onClick={() => setShowModal(true)}
            data-testid="request-edit-button"
          >
            {t('channelDetailPage.requestEdit')}
          </Button>
        )}
        <Button
          component={Link}
          to={generatePath(ROUTES.CHANNEL_EDIT, {
            channelId,
            actionId: FormAction.Edit,
          })}
          variant="contained"
        >
          {t(
            channelDetails?.wrapperStatus === WrapperStatusEnum.APPROVED
              ? 'general.modify'
              : 'channelDetailPage.approveAndValidate'
          )}
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button
          component={Link}
          to={''}
          color="error"
          variant="outlined"
          startIcon={<Delete />}
          disabled={true}
          onClick={() => ''}
        >
          {t('general.delete')}
        </Button>
        {channelDetails?.wrapperStatus === WrapperStatusEnum.APPROVED && (
          <>
            <Button
              component={Link}
              to={generatePath(ROUTES.CHANNEL_PSP_LIST, { channelId })}
              color="primary"
              startIcon={<ManageAccounts />}
              size="medium"
              variant="outlined"
            >
              {t('channelDetailPage.managePsp')}
            </Button>
            <Button
              component={Link}
              to={generatePath(ROUTES.CHANNEL_EDIT, {
                channelId,
                actionId: FormAction.Duplicate,
              })}
              color="primary"
              variant="outlined"
              startIcon={<ContentCopy />}
            >
              {t('channelDetailPage.duplicate')}
            </Button>
          </>
        )}
        <Button
          component={Link}
          to={generatePath(ROUTES.CHANNEL_EDIT, {
            channelId,
            actionId: FormAction.Edit,
          })}
          variant="contained"
          startIcon={<Edit />}
        >
          {t('general.modify')}
        </Button>
      </>
    );
  }
}

type Props = {
  channelDetails?: ChannelDetailsResource;
  setChannelDetails: (value: any) => void;
  goBack: () => void;
};

const DetailButtons = ({ channelDetails, setChannelDetails, goBack }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
        <Buttons channelDetails={channelDetails} setShowModal={setShowModal} />
      </Stack>
      {showModal && (
        <GenericModal
          openModal={showModal}
          renderContent={() => (
            <ModalContent
              setShowModal={setShowModal}
              setChannelDetails={setChannelDetails}
              channelDetails={channelDetails}
              goBack={goBack}
            />
          )}
        />
      )}
    </>
  );
};

export default DetailButtons;
