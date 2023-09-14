import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import SideMenu from '../../components/SideMenu/SideMenu';
import TabPanels from './components/TabPanels';

const CommisionalPackagesPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
        <Grid item xs={2}>
          <Box>
            <SideMenu />
          </Box>
        </Grid>
        <Grid
          item
          xs={10}
          sx={{ backgroundColor: '#F5F6F7' }}
          display="flex"
          justifyContent="center"
          pb={8}
        >
          <Box width="100%" px={2}>
            <TitleBox
              title={t('commisionalPackagesPage.title')}
              subTitle={t('commisionalPackagesPage.subtitle')}
              mbTitle={2}
              mtTitle={4}
              mbSubTitle={3}
              variantTitle="h4"
              variantSubTitle="body1"
            />
            <TabPanels />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CommisionalPackagesPage;
