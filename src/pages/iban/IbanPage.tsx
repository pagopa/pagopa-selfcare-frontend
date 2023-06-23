import { Box, Grid, Alert, Card, Button } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { Link, generatePath, useHistory } from 'react-router-dom';
import SideMenu from '../../components/SideMenu/SideMenu';
import ROUTES from '../../routes';
import { IbanFormAction } from '../../model/Iban';
// import { useAppSelector } from '../../redux/hooks';
// import { partiesSelectors } from '../../redux/slices/partiesSlice';

const IbanPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  // const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

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
        justifyContent="center"
        pb={8}
      >
        <Box width="100%" px={2}>
          <TitleBox
            title={t('ibanPage.title')}
            subTitle={t('ibanPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
          {history.location.state && (history.location.state as any).alertSuccessMessage && (
            <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
              {(history.location.state as any).alertSuccessMessage}
            </Alert>
          )}

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 1 }}>
                <Box mb={3}></Box>
                <Grid container spacing={3} pb={4}>
                  <Button
                    component={Link}
                    to={generatePath(ROUTES.IBAN_ADD)}
                    variant="contained"
                    sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
                  >
                    {t('ibanPage.addIban')}
                  </Button>
                  <Button
                    component={Link}
                    to={generatePath(ROUTES.IBAN_DETAIL, { ibanId: 'IT12A1234512345123456789012' })}
                    variant="contained"
                    sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
                  >
                    Dettaglio IBAN
                  </Button>
                  <Button
                    component={Link}
                    to={generatePath(ROUTES.IBAN_EDIT, {
                      ibanId: 'IT12A1234512345123456789012',
                      actionId: IbanFormAction.Edit,
                    })}
                    variant="contained"
                    sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
                  >
                    Edit IBAN
                  </Button>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default IbanPage;
