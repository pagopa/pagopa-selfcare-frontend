import { Box, Grid } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const ChannelDetailPage = () => {
  const { t } = useTranslation();
  const { channelId } = useParams<{ channelId: string }>();

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Box width="100%">
        <TitleBox
          title={t('channelsPage.title')}
          subTitle={t('channelsPage.subtitle')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
      </Box>
      <Box>ChannelId:{channelId}</Box>
    </Grid>
  );
};

export default ChannelDetailPage;
