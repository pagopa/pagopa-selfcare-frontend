import { Stack, Button } from '@mui/material';
import { Link, generatePath, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormAction } from '../../../../model/Channel';
import ROUTES from '../../../../routes';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { ChannelDetailsResource } from '../../../../api/generated/portal/ChannelDetailsResource';

type Props = {
  channelDetails?: ChannelDetailsResource;
  goBack: () => void;
};

const DetailButtons = ({ channelDetails, goBack }: Props) => {
  const { channelId } = useParams<{ channelId: string }>();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';
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

      {isOperator && channelDetails?.enabled ? (
        <>
          <Button
            component={Link}
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
              channelId,
              actionId: FormAction.Edit,
            })}
            variant="contained"
          >
            {t('channelDetailPage.edit')}
          </Button>
        </>
      ) : isOperator && !channelDetails?.enabled ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('channelDetailPage.correctionRequired')}
          </Button>
          <Button
            component={Link}
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
              channelId,
              actionId: FormAction.Edit,
            })}
            variant="contained"
          >
            {t('channelDetailPage.configure')}
          </Button>
        </>
      ) : channelDetails?.enabled ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('channelDetailPage.deleteRequired')}
          </Button>
          <Button
            component={Link}
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
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
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
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
            to={generatePath(`${ROUTES.CHANNEL_EDIT}`, {
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
