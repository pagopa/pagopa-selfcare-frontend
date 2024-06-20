import {Grid, Stack, Breadcrumbs, Typography, Paper, Chip, Divider} from '@mui/material';
import {Box} from '@mui/system';
import {ButtonNaked} from '@pagopa/mui-italia';
import {ArrowBack, ManageAccounts, VisibilityOff} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {StatusChip} from '../../../../components/StatusChip';
import {ChannelDetailsResource} from '../../../../api/generated/portal/ChannelDetailsResource';
import {useUserRole} from "../../../../hooks/useUserRole";

type Props = {
    channelDetail: ChannelDetailsResource;
    channelId: string;
    goBack: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ChannelDetailHeader({channelDetail, channelId, goBack}: Props) {
  const { t } = useTranslation();

    return (
      <>
        <Stack direction="row">
            <ButtonNaked
                size="small"
                component="button"
                onClick={goBack}
                startIcon={<ArrowBack/>}
                sx={{color: 'primary.main', mr: '20px'}}
                weight="default"
                data-testid="back-button-test"
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
          <StatusChip status={channelDetail?.wrapperStatus ?? ''} />
        </Box>
      </>
    );

};
