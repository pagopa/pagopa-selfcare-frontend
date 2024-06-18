import {Alert, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useTranslation} from 'react-i18next';
import {ChannelDetailsResource} from '../../../../api/generated/portal/ChannelDetailsResource';
import {useUserRole} from "../../../hooks/useUserRole";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function GetChannelAlert = ({ channelDetail }: { channelDetail?: ChannelDetailsResource }) => {
  const { t } = useTranslation();
  const { userIsPagopaOperator } = useUserRole();

  if (channelDetail?.wrapperStatus !== WrapperStatusEnum.APPROVED) {
    const isToBeValidated =
      channelDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK ||
      channelDetail?.wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE;
    const isToBeFixed =
      channelDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX ||
      channelDetail?.wrapperStatus === WrapperStatusEnum.TO_FIX_UPDATE;

    const userHasToTakeAction =
      (isToBeValidated && userIsPagopaOperator) || (isToBeFixed && !userIsPagopaOperator);
    return (
      <>
        {(userIsPagopaOperator || userHasToTakeAction) && (
          <Box my={2}>
            <Alert
              severity={userHasToTakeAction ? 'warning' : 'info'}
              variant="outlined"
              sx={{ py: 2 }}
            >
              {isToBeFixed && (
                <Typography fontWeight={'fontWeightMedium'}>
                  {t('channelDetailPageValidation.alert.toFixTitle')}
                </Typography>
              )}
              <Typography>
                {isToBeFixed && channelDetail?.note?.trim()
                  ? channelDetail.note
                  : t(
                      `channelDetailPageValidation.alert.${
                        isToBeValidated ? 'toCheckMessage' : 'toFixMessage'
                      }`
                    )}
              </Typography>
            </Alert>
          </Box>
        )}
      </>
    );
  }
  return null;
};