import { ArrowBack } from '@mui/icons-material';
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import ROUTES from '../../../routes';
import NodeSignInForm from './NodeSignInForm';

const NodeSignInPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const goBack = () => history.push(ROUTES.HOME);

  useEffect(() => {
    // load data
  }, []);

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
            {t('general.exit')}
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>{t('general.dashboard')}</Typography>
            <Typography color={'#A2ADB8'}>{t(`nodeSignInPage.breadcrumb`)}</Typography>
          </Breadcrumbs>
        </Stack>
        <TitleBox
          title={t(`nodeSignInPage.title`)}
          subTitle={t(`nodeSignInPage.subtitle`)}
          mbTitle={2}
          mtTitle={4}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        <NodeSignInForm goBack={goBack}></NodeSignInForm>
      </Grid>
    </Grid>
  );
};

export default NodeSignInPage;
