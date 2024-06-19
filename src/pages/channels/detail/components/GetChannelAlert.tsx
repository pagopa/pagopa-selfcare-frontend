import {Alert, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useTranslation} from 'react-i18next';
import {ChannelDetailsResource} from '../../../../api/generated/portal/ChannelDetailsResource';
import {WrapperStatusEnum,} from '../../../../api/generated/portal/WrapperChannelDetailsResource';
import {useUserRole} from "../../../../hooks/useUserRole";

type Props = {
    channelDetail: ChannelDetailsResource;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function GetChannelAlert({channelDetail}: Props) {
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
                  {t('channelDetailValidationPage.alert.toFixTitle')}
                </Typography>
              )}
              <Typography>
                {isToBeFixed && channelDetail?.note?.trim()
                  ? channelDetail.note
                  : t(
                      `channelDetailValidationPage.alert.${
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
