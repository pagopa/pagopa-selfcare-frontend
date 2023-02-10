import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import ROUTES from '../../../routes';
import AddChannelForm from './AddChannelForm';

const AddChannelPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const goBack = () => history.push(ROUTES.CHANNELS);

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>
        <Stack direction="row">
          <ButtonNaked
            size="small"
            component="button"
            onClick={goBack}
            startIcon={<ArrowBack />}
            sx={{ color: 'primary.main', mr: '20px' }}
            weight="default"
          >
            {t('addChannelPage.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>Canali</Typography>
            <Typography color={'#A2ADB8'}>Crea canale</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t('addChannelPage.title')}
          subTitle={t('addChannelPage.subtitle')}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <AddChannelForm goBack={goBack} />
      </Grid>
    </Grid>
  );
};

export default AddChannelPage;
