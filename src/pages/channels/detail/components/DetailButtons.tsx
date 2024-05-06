import {Button, Stack} from '@mui/material';
import {generatePath, Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FormAction} from '../../../../model/Channel';
import ROUTES from '../../../../routes';
import {ChannelDetailsResource, WrapperStatusEnum,} from '../../../../api/generated/portal/ChannelDetailsResource';
import {useUserRole} from "../../../../hooks/useUserRole";

type Props = {
  channelDetails?: ChannelDetailsResource;
  goBack: () => void;
};

const DetailButtons = ({ channelDetails, goBack }: Props) => {
  const { channelId } = useParams<{ channelId: string }>();
  const {userIsPagopaOperator} = useUserRole();
  const { t } = useTranslation();

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
            disabled={true}
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
            {t('channelDetailPage.configure')}
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
