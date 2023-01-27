import { Box, Button, Grid, InputAdornment, TextField } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import SideMenu from '../../components/SideMenu/SideMenu';
import ChannelsTable from './ChannelsTable';

const Channels = () => {
  const { t } = useTranslation();

  return (
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
        flexDirection="column"
        justifyContent="center"
        pb={8}
        px={3}
      >
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
        <Box width="100%" display="flex">
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { height: 48 },
            }}
            fullWidth
            placeholder={t('channelsPage.searchPlaceholder')}
          />
          <Button variant="contained" sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}>
            {t('channelsPage.createChannelButtonLabel')}
          </Button>
        </Box>
        <Box display="flex" width="100%" mt={3}>
          <Box
            px={3}
            pt={3}
            display="flex"
            width="100%"
            sx={{ backgroundColor: 'background.default' }}
          >
            <ChannelsTable></ChannelsTable>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Channels;
