import { Alert, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { WrapperStatusEnum } from '../../api/generated/portal/ChannelDetailsResource';
import { useUserRole } from '../../hooks/useUserRole';

type Props = {
  componentPath: string;
  wrapperStatus: WrapperStatusEnum;
  note: string;
  pendingUpdate: boolean;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function GetAlert({
  componentPath,
  wrapperStatus,
  note,
  pendingUpdate,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { userIsPagopaOperator } = useUserRole();

  if (wrapperStatus !== WrapperStatusEnum.APPROVED) {
    const isToBeValidated =
      wrapperStatus === WrapperStatusEnum.TO_CHECK ||
      wrapperStatus === WrapperStatusEnum.TO_CHECK_UPDATE;
    const isToBeFixed =
      wrapperStatus === WrapperStatusEnum.TO_FIX ||
      wrapperStatus === WrapperStatusEnum.TO_FIX_UPDATE;

    const userHasToTakeAction =
      (isToBeValidated && userIsPagopaOperator) || (isToBeFixed && !userIsPagopaOperator);
    return (
      <Box my={2} data-testid="on-validation-alert-test-id">
        <Alert
          severity={userHasToTakeAction ? 'warning' : 'info'}
          variant="outlined"
          sx={{ py: 2 }}
        >
          <GetAlertContent
            isToBeFixed={isToBeFixed}
            isToBeValidated={isToBeValidated}
            userIsPagopaOperator={userIsPagopaOperator}
            componentPath={componentPath}
            note={note}
            t={t}
          />
        </Alert>
      </Box>
    );
  } else if (pendingUpdate) {
    return (
      <Box my={2} data-testid="pending-update-alert-test-id">
        <Alert severity="warning" variant="outlined" sx={{ py: 2 }}>
          <Typography fontWeight={'fontWeightMedium'} sx={{ whiteSpace: 'pre-line' }}>
            {t(`${componentPath}.alert.pendingUpdate`)}
          </Typography>
        </Alert>
      </Box>
    );
  }
  return null;
}

function GetAlertContent({
  isToBeFixed,
  isToBeValidated,
  userIsPagopaOperator,
  componentPath,
  note,
  t,
}: Readonly<{
  isToBeFixed: boolean;
  isToBeValidated: boolean;
  userIsPagopaOperator: boolean;
  componentPath: string;
  note: string;
  t: (key: string) => string;
}>) {
  if (isToBeFixed) {
    return (
      <>
        <Typography fontWeight={'fontWeightMedium'}  data-testid="to-fix-alert-test-id">
          {t(`${componentPath}.alert.toFixTitle`)}
        </Typography>
        <Typography>{note.trim() ? note : t(`${componentPath}.alert.toFixMessage`)}</Typography>
      </>
    );
  }
  if (isToBeValidated && userIsPagopaOperator) {
    return <Typography  data-testid="to-check-alert-test-id">{t(`${componentPath}.alert.toCheckMessage`)}</Typography>;
  }
  if (isToBeValidated && !userIsPagopaOperator) {
    return <Typography  data-testid="waiting-for-review-alert-test-id">{t(`${componentPath}.alert.waitingForRevision`)}</Typography>;
  }
  return null;
}
